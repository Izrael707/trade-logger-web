"use client";

import { auth } from "@/lib/firebase";
import { toast } from "@/lib/helpers";
import { onAuthStateChanged, onIdTokenChanged, User } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type AuthContext = {
  user: User | null;
  loading: boolean;
};
const AuthContext = createContext<AuthContext>({ user: null, loading: true });

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isFirstRun = useRef(true);
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (loading) setLoading(false);
    });
    return unSub;
  }, []);
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
      }
      toast(!user ? "User signed out" : "User SIgned In", "info", 3000);
    });
    return unSub;
  }, []);
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
