"use client";

type Trade = {
  result: "Win" | "Loss" | "Breakeven";
  rMultiple: number;
};

const StatCard = ({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: "green" | "red" | "indigo" | "amber";
}) => {
  const accentMap = {
    green: "text-emerald-600",
    red: "text-rose-600",
    indigo: "text-indigo-600",
    amber: "text-amber-600",
  };
  const color = accent ? accentMap[accent] : "text-gray-900";

  return (
    <div className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className={`text-2xl font-semibold ${color}`}>{value}</p>
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  );
};

const TradeStats = ({ trades }: { trades: Trade[] }) => {
  const total = trades.length;

  const wins = trades.filter((t) => t.result === "Win").length;
  const losses = trades.filter((t) => t.result === "Loss").length;
  const breakevens = trades.filter((t) => t.result === "Breakeven").length;

  const winRate = total ? (wins / total) * 100 : 0;

  const totalR = trades.reduce((sum, t) => sum + (t.rMultiple || 0), 0);

  const avgR = total ? totalR / total : 0;

  const bestR = total ? Math.max(...trades.map((t) => t.rMultiple || 0)) : 0;
  const worstR = total ? Math.min(...trades.map((t) => t.rMultiple || 0)) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Win Rate"
        value={`${winRate.toFixed(1)}%`}
        hint={`${wins}W · ${losses}L · ${breakevens}BE`}
        accent={winRate >= 50 ? "green" : "red"}
      />
      <StatCard
        label="Total R"
        value={`${totalR >= 0 ? "+" : ""}${totalR.toFixed(2)}R`}
        hint={`Avg ${avgR.toFixed(2)}R per trade`}
        accent={totalR >= 0 ? "green" : "red"}
      />
      <StatCard
        label="Best / Worst"
        value={`${bestR >= 0 ? "+" : ""}${bestR}R / ${worstR}R`}
        hint={`${total} trade${total === 1 ? "" : "s"} logged`}
        accent="indigo"
      />
    </div>
  );
};

export default TradeStats;
