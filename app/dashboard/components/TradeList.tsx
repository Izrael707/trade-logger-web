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
    <div className="grid gap-4">
      {trades.map((t) => (
        <div
          key={t.id}
          className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">{t.pair}</h3>
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

            <button
              onClick={() => handleDelete(t.id)}
              className="rounded-md p-2 text-gray-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 focus:opacity-100"
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
  );
};

export default TradeList;
