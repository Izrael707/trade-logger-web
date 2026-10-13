/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { toast } from "@/lib/helpers";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState, SubmitEvent } from "react";
import Swal from "sweetalert2";

const initialFormData = {
  pair: "",
  session: "",
  narrative: "",
  note: "",
  direction: "Long",
  entry: "",
  stopLoss: "",
  takeProfit: "",
  riskReward: "",
  result: "Win", // Win | Loss | Breakeven
  rMultiple: "",
};

const SESSIONS = ["Asia", "London", "NY", "NY PM", "London Close"];

const NewTrade = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialFormData);
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await Swal.fire({
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      confirmButtonText: "Yes, Save",
      cancelButtonText: "Cancel",
      text: "Are you sure you want to save this trade?",
    });
    if (!result.isConfirmed) return;

    setSaving(true);
    try {
      await addDoc(collection(db, "trades"), {
        ...formData,
        // coerce numeric strings → numbers
        entry: Number(formData.entry),
        stopLoss: Number(formData.stopLoss),
        takeProfit: Number(formData.takeProfit),
        riskReward: Number(formData.riskReward),
        rMultiple: Number(formData.rMultiple),
        uid: user?.uid,
        createdAt: serverTimestamp(),
      });
      toast("New trade logged successfully!", "success", 5000);
      setFormData(initialFormData);
      router.replace("/dashboard");
    } catch (error: any) {
      toast(error.message, "error", 5000);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-semibold text-gray-900">Log a new trade</h2>
        <p className="text-sm text-gray-500">
          Record your setup, execution, and outcome for later review.
        </p>
      </div>

      {/* Row: Pair + Direction */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="pair" className="text-sm font-medium text-gray-700">
            Pair
          </label>
          <input
            type="text"
            id="pair"
            name="pair"
            required
            placeholder="e.g. EURUSD"
            onChange={handleChange}
            value={formData.pair}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="direction"
            className="text-sm font-medium text-gray-700"
          >
            Direction
          </label>
          <select
            id="direction"
            name="direction"
            onChange={handleChange}
            value={formData.direction}
            className={inputClass}
          >
            <option value="Long">Long</option>
            <option value="Short">Short</option>
          </select>
        </div>
      </div>

      {/* Session */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="session" className="text-sm font-medium text-gray-700">
          Session / Killzone
        </label>
        <select
          id="session"
          name="session"
          required
          onChange={handleChange}
          value={formData.session}
          className={inputClass}
        >
          <option value="" disabled>
            Select a session…
          </option>
          {SESSIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Row: Entry + SL + TP */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="entry" className="text-sm font-medium text-gray-700">
            Entry
          </label>
          <input
            type="number"
            step="any"
            id="entry"
            name="entry"
            required
            placeholder="1.0850"
            onChange={handleChange}
            value={formData.entry}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="stopLoss"
            className="text-sm font-medium text-gray-700"
          >
            Stop Loss
          </label>
          <input
            type="number"
            step="any"
            id="stopLoss"
            name="stopLoss"
            required
            placeholder="1.0835"
            onChange={handleChange}
            value={formData.stopLoss}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="takeProfit"
            className="text-sm font-medium text-gray-700"
          >
            Take Profit
          </label>
          <input
            type="number"
            step="any"
            id="takeProfit"
            name="takeProfit"
            required
            placeholder="1.0900"
            onChange={handleChange}
            value={formData.takeProfit}
            className={inputClass}
          />
        </div>
      </div>

      {/* Row: R:R + Result + R-multiple */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="riskReward"
            className="text-sm font-medium text-gray-700"
          >
            Planned R:R
          </label>
          <input
            type="number"
            step="any"
            id="riskReward"
            name="riskReward"
            placeholder="2.5"
            onChange={handleChange}
            value={formData.riskReward}
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="result" className="text-sm font-medium text-gray-700">
            Result
          </label>
          <select
            id="result"
            name="result"
            onChange={handleChange}
            value={formData.result}
            className={inputClass}
          >
            <option value="Win">Win</option>
            <option value="Loss">Loss</option>
            <option value="Breakeven">Breakeven</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="rMultiple"
            className="text-sm font-medium text-gray-700"
          >
            R-Multiple
          </label>
          <input
            type="number"
            step="any"
            id="rMultiple"
            name="rMultiple"
            required
            placeholder="e.g. 2 or -1"
            onChange={handleChange}
            value={formData.rMultiple}
            className={inputClass}
          />
        </div>
      </div>

      {/* Narrative */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="narrative"
          className="text-sm font-medium text-gray-700"
        >
          Narrative
        </label>
        <textarea
          id="narrative"
          name="narrative"
          required
          rows={4}
          placeholder="State your bias and expectation…"
          onChange={handleChange}
          value={formData.narrative}
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="note" className="text-sm font-medium text-gray-700">
          Extra notes
          <span className="ml-2 text-xs font-normal text-gray-400">
            (optional)
          </span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder="Why did you take this trade?"
          onChange={handleChange}
          value={formData.note}
          className={`${inputClass} resize-y`}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Log Trade"}
        </button>
      </div>
    </form>
  );
};

export default NewTrade;
