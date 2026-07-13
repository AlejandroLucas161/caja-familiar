"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Wallet } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { APP_NAME } from "@/lib/constants";
import { APP_SHELL_CLASS } from "@/lib/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const { signIn, signInDemo } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo iniciar sesión",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo() {
    setError(null);
    setDemoLoading(true);
    try {
      await signInDemo();
      router.replace("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo entrar al modo Demo",
      );
    } finally {
      setDemoLoading(false);
    }
  }

  return (
    <div
      className={cn(
        APP_SHELL_CLASS,
        "flex min-h-dvh flex-col justify-center px-4 py-10 md:px-8 md:py-14",
      )}
    >
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl border border-border bg-card">
          <Wallet
            className="size-8 text-foreground"
            strokeWidth={2}
            aria-hidden
          />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
        <p className="mt-2 text-base text-muted-foreground">
          Control simple del dinero familiar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base font-semibold">
            Usuario
          </Label>
          <Input
            id="email"
            type="text"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-14 rounded-xl text-lg"
            placeholder="Tu usuario"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-base font-semibold">
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 rounded-xl text-lg"
            placeholder="••••••••"
            required
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-base text-destructive"
          >
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={loading}
          className="h-14 w-full rounded-xl text-lg font-semibold"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-sm text-muted-foreground">o</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="secondary"
        disabled={demoLoading}
        onClick={handleDemo}
        className="h-14 w-full rounded-xl text-lg font-semibold"
      >
        {demoLoading ? "Entrando..." : "Entrar al modo Demo"}
      </Button>
    </div>
  );
}
