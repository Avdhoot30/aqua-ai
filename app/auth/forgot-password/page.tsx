import Link from "next/link";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <Link
          href="/auth/login"
          className="text-sm text-cyan-400 hover:text-cyan-300"
        >
          ← Back to login
        </Link>

        <h1 className="mt-8 text-3xl font-bold">
          Reset your password
        </h1>

        <p className="mt-2 text-slate-400">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <form
          action={requestPasswordReset}
          className="mt-6 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Send reset link
          </button>
        </form>
      </div>
    </main>
  );
}