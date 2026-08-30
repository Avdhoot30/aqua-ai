import Link from "next/link";
import { updatePassword } from "./actions";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-2xl font-bold"
          >
            Aqua<span className="text-cyan-400">AI</span>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-3xl font-bold">
            Set a new password
          </h1>

          <p className="mt-2 text-slate-400">
            Choose a new password for your account.
          </p>

          <form
            action={updatePassword}
            className="mt-6 space-y-5"
          >
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                New password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                minLength={8}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium"
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                minLength={8}
                required
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950"
            >
              Update password
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}