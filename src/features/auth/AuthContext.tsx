"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Workspace } from "@/types/movement";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  workspace: Workspace | null;
  isDemo: boolean;
  canMutate: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInDemo: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function resolveWorkspace(user: User | null): Workspace | null {
  if (!user) return null;
  const ws = user.user_metadata?.workspace as string | undefined;
  if (ws === "family" || ws === "demo") return ws;
  return null;
}

function toAuthEmail(userOrEmail: string): string {
  const value = userOrEmail.trim();
  if (!value) return value;
  if (value.includes("@")) return value;
  return `${value}@cajafamiliar.app`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = useCallback(
    async (userOrEmail: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: toAuthEmail(userOrEmail),
        password,
      });
      if (error) throw error;
    },
    [supabase],
  );

  const signInDemo = useCallback(async () => {
    const email = process.env.NEXT_PUBLIC_DEMO_EMAIL;
    const password = process.env.NEXT_PUBLIC_DEMO_PASSWORD;
    if (!email || !password) {
      throw new Error(
        "Credenciales demo no configuradas. Revisá NEXT_PUBLIC_DEMO_EMAIL y NEXT_PUBLIC_DEMO_PASSWORD.",
      );
    }
    await signIn(email, password);
  }, [signIn]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, [supabase]);

  const workspace = resolveWorkspace(user);
  const isDemo = workspace === "demo";
  const canMutate = workspace === "family";

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      workspace,
      isDemo,
      canMutate,
      loading,
      signIn,
      signInDemo,
      signOut,
    }),
    [
      user,
      session,
      workspace,
      isDemo,
      canMutate,
      loading,
      signIn,
      signInDemo,
      signOut,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return ctx;
}
