'use client'; // Add this at the very top of your file

import Link from "next/link";
import { useEffect, useState } from "react"; // Added hooks
import { ArrowRight, Droplets, Sparkles, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Droplets,
    title: "Track effortlessly",
    description: "Log water with one tap and see your progress throughout the day.",
  },
  {
    icon: Sparkles,
    title: "AI-powered coaching",
    description: "Get personalized hydration insights based on your habits and activity.",
  },
  {
    icon: BarChart3,
    title: "Understand your habits",
    description: "See daily, weekly and monthly trends instead of guessing.",
  },
];

export default function HomePage() {
  // 1. Create a state variable initialized with a static placeholder year
  const [year, setYear] = useState("2026");

  // 2. Update it on the client side after mounting
  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <header className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-xl bg-cyan-400 p-2 text-slate-950">
                <Droplets className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">AquaAI</span>
            </Link>

            <nav className="hidden items-center gap-8 md:flex">
              <Link href="#features" className="text-sm text-slate-300 transition hover:text-white">
                Features
              </Link>
              <Link href="/pricing" className="text-sm text-slate-300 transition hover:text-white">
                Pricing
              </Link>
              <Link href="/login" className="text-sm text-slate-300 transition hover:text-white">
                Login
              </Link>
              <Link href="/signup" className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200">
                Get started
              </Link>
            </nav>
          </header>

          <div className="mx-auto max-w-4xl py-24 text-center lg:py-32">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
              <Sparkles className="h-4 w-4" />
              AI-powered hydration tracking
            </div>

            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Hydration that
              <span className="block text-cyan-300">adapts to you.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Track your water, understand your habits and get personalized hydration guidance powered by AI.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
                Start tracking
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/pricing" className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-semibold transition hover:bg-white/10">
                View pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Why AquaAI
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              More than a water counter.
            </h2>
            <p className="mt-4 text-slate-400">
              A personalized hydration system designed around your daily habits.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                  <div className="mb-5 inline-flex rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-slate-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-slate-500">
          {/* 3. Render the dynamic state variable safely here */}
          © {year} AquaAI. Built for better hydration habits.
        </div>
      </footer>
    </main>
  );
}
