"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const Authlayout = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);
  if (loading || user) return null;
  return <div className="bg-mauve-900 text-white">{children}</div>;
};
export default Authlayout;
