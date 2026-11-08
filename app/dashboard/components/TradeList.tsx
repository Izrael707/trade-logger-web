"use client";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { toast } from "@/lib/helpers";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type TradeData = {
  pair: string;
  session: string;
  narrative: string;
  note: string;
  uid: string;
  direction: "Long" | "Short";
  entry: number;
  stopLoss: number;
  takeProfit: number;
  riskReward: number;
  result: "Win" | "Loss" | "Breakeven";
  rMultiple: number;
};

type Trade = TradeData & { id: string };

const sessionStyles: Record<string, string> = {
  Asia: "bg-purple-100 text-purple-700 border-purple-200",
  London: "bg-blue-100 text-blue-700 border-blue-200",
  NY: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "NY PM": "bg-amber-100 text-amber-700 border-amber-200",
  "London Close": "bg-rose-100 text-rose-700 border-rose-200",
};

const TradeList = () => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(collection(db, "trades"), where("uid", "==", user.uid));
    const unSub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as TradeData),
      }));
      setTrades(docs);
    });

    return unSub;
  }, [user?.uid]);

  // Close modal on Escape key
  useEffect(() => {
    if (!selectedTrade) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedTrade(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedTrade]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      text: "Are you sure you want to delete this trade?",
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: "#ccc",
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "red",
    });
    if (!result.isConfirmed) return;

    try {
      await deleteDoc(doc(db, "trades", id));
      toast("Trade deleted!", "success", 3000);
      if (selectedTrade?.id === id) setSelectedTrade(null);
    } catch (error: any) {
      toast(error.message, "error", 5000);
    }
  };

  // Empty state
  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
        <p className="text-lg font-medium text-gray-700">
          No trades logged yet
        </p>
        <p className="text-sm text-gray-500">
          Your logged trades will appear here once you add one.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4">
        {trades.map((t) => (
          <div
            key={t.id}
            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t.pair}
                </h3>
                <span
                  className={`rounded-full border px-3 py-0.5 text-xs font-medium ${
                    sessionStyles[t.session] ??
                    "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  {t.session}
                </span>
                <span
                  className={`rounded-full border px-3 py-0.5 text-xs font-medium ${
                    t.result === "Win"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : t.result === "Loss"
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-gray-200 bg-gray-100 text-gray-700"
                  }`}
                >
                  {t.result} · {t.rMultiple >= 0 ? "+" : ""}
                  {t.rMultiple}R
                </span>
              </div>

              <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
                <button
                  onClick={() => setSelectedTrade(t)}
                  className="rounded-md p-2 text-gray-400 transition hover:bg-indigo-50 hover:text-indigo-600 focus:opacity-100"
                  aria-label={`View ${t.pair} trade details`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="rounded-md p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600 focus:opacity-100"
                  aria-label={`Delete ${t.pair} trade`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m1 0v12a1 1 0 01-1 1H8a1 1 0 01-1-1V7h10z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Narrative */}
            {t.narrative && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Narrative
                </p>
                <p className="mt-1 text-sm text-gray-700">{t.narrative}</p>
              </div>
            )}

            {/* Notes */}
            {t.note && (
              <div className="mt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Notes
                </p>
                <p className="mt-1 text-sm text-gray-600">{t.note}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* View Trade Modal */}
      {selectedTrade && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedTrade(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="trade-modal-title"
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-5">
              <div className="flex flex-wrap items-center gap-3">
                <h2
                  id="trade-modal-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  {selectedTrade.pair}
                </h2>
                <span
                  className={`rounded-full border px-3 py-0.5 text-xs font-medium ${
                    sessionStyles[selectedTrade.session] ??
                    "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  {selectedTrade.session}
                </span>
                <span
                  className={`rounded-full border px-3 py-0.5 text-xs font-medium ${
                    selectedTrade.result === "Win"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : selectedTrade.result === "Loss"
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-gray-200 bg-gray-100 text-gray-700"
                  }`}
                >
                  {selectedTrade.result} ·{" "}
                  {selectedTrade.rMultiple >= 0 ? "+" : ""}
                  {selectedTrade.rMultiple}R
                </span>
              </div>
              <button
                onClick={() => setSelectedTrade(null)}
                className="rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="space-y-5 p-5">
              {/* Direction + R multiple summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Direction
                  </p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      selectedTrade.direction === "Long"
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }`}
                  >
                    {selectedTrade.direction}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    R Multiple
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {selectedTrade.rMultiple >= 0 ? "+" : ""}
                    {selectedTrade.rMultiple}R
                  </p>
                </div>
              </div>

              {/* Price levels */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Price Levels
                </p>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-gray-200 p-3">
                    <p className="text-xs text-gray-500">Entry</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                      {selectedTrade.entry}
                    </p>
                  </div>
                  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3">
                    <p className="text-xs text-rose-600">Stop Loss</p>
                    <p className="mt-1 text-sm font-semibold text-rose-700">
                      {selectedTrade.stopLoss}
                    </p>
                  </div>
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                    <p className="text-xs text-emerald-600">Take Profit</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-700">
                      {selectedTrade.takeProfit}
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk reward */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Risk / Reward
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  1 : {selectedTrade.riskReward}
                </p>
              </div>

              {/* Narrative */}
              {selectedTrade.narrative && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Narrative
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                    {selectedTrade.narrative}
                  </p>
                </div>
              )}

              {/* Notes */}
              {selectedTrade.note && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Notes
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
                    {selectedTrade.note}
                  </p>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-2 border-t border-gray-200 p-5">
              <button
                onClick={() => setSelectedTrade(null)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selectedTrade.id)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Delete Trade
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TradeList;
