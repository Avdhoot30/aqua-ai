import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <h1 className="text-2xl font-bold">
          Authentication error
        </h1>

        <p className="mt-3 text-slate-400">
          Something went wrong while processing your authentication
          request.
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