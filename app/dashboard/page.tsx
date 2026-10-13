"use client";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import TradeList from "./components/TradeList";
import TradeStats from "./components/TradeStats";

type Trade = {
  id: string;
  result: "Win" | "Loss" | "Breakeven";
  rMultiple: number;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    const q = query(collection(db, "trades"), where("uid", "==", user.uid));
    const unSub = onSnapshot(q, (snap) => {
      setTrades(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    });
    return unSub;
  }, [user?.uid]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
        <TradeStats trades={trades} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Recent Trades</h2>
        <TradeList />
      </div>
    </div>
  );
};

export default Dashboard;
