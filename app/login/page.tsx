import Link from "next/link";
import { login } from "./actions";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-3xl font-bold">Welcome back</h1>

        <p className="mt-2 text-slate-400">Continue your hydration journey.</p>

        <form action={login} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm">Email</label>

            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Password</label>

            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-slate-950"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {"Don't have an account?"}
          <Link href="/signup" className="text-cyan-300 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
