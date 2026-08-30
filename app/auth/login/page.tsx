import Link from "next/link";
import { login } from "./actions";
import { LoginMessage } from "./login-message";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-8 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            Aqua<span className="text-cyan-400">AI</span>
          </Link>

          <h1 className="mt-8 text-3xl font-bold">Welcome back</h1>

          <p className="mt-2 text-slate-400">
            Sign in to continue your hydration journey.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur">
          <Suspense fallback={null}>
            <LoginMessage />
          </Suspense>

          <form action={login} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>

                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Sign in
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />

            <span className="text-xs text-slate-500">OR</span>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          <Link
            href="/auth/sign-up"
            className="block w-full rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-medium transition hover:bg-white/5"
          >
            Create an account
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          By continuing, you agree to AquaAI&apos;s terms and privacy policy.
        </p>
      </div>
    </main>
  );
}
