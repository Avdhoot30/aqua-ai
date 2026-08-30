import Link from "next/link";

export default function PasswordResetSentPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-xl">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-cyan-400/10 text-2xl">
          ✉️
        </div>

        <h1 className="mt-6 text-2xl font-bold">
          Check your email
        </h1>

        <p className="mt-3 text-slate-400">
          If an account exists for that email address, we&apos;ve
          sent a password reset link.
        </p>

        <Link
          href="/auth/login"
          className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
        >
          Back to login
        </Link>
      </div>
    </main>
  );
}