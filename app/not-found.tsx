import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <p className="text-sm font-medium text-cyan-300">
          404
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Page not found
        </h1>

        <p className="mt-3 text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
        >
          Back to AquaAI
        </Link>
      </div>
    </main>
  );
}