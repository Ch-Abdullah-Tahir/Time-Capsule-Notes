"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); return; }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); return; }
    }
    router.push("/");
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center text-[#EDE3CC]"
      style={{ background: "radial-gradient(ellipse at 50% -10%, #171a24 0%, #0a0b10 55%, #05060a 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(1.5px 1.5px at 20px 30px, #fff, transparent), radial-gradient(1px 1px at 90px 80px, #fff, transparent), radial-gradient(1.5px 1.5px at 150px 20px, #fff, transparent), radial-gradient(1px 1px at 210px 110px, #fff, transparent), radial-gradient(1.5px 1.5px at 260px 60px, #fff, transparent), radial-gradient(1px 1px at 40px 140px, #fff, transparent)",
          backgroundSize: "300px 200px",
          backgroundRepeat: "repeat",
        }}
      />

      <div className="relative flex flex-col items-center gap-6 px-6">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full border border-[#C9A45C] flex items-center justify-center text-[#C9A45C] text-xs">⧗</span>
          <span className="font-serif text-lg tracking-wide text-[#EDE3CC]">Time Capsule Archive</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4 border border-[#C9A45C]/40"
          style={{ background: "linear-gradient(180deg, #F3E7C9 0%, #E7D3A1 100%)", boxShadow: "0 20px 40px -20px rgba(0,0,0,0.6)" }}
        >
          <h1 className="font-serif text-2xl text-center text-[#4A3728]">
            {mode === "login" ? "Welcome back" : "Begin your archive"}
          </h1>

          {error && <p className="text-sm text-red-700 text-center">{error}</p>}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-[#FBF4E2] border border-[#C9A45C]/50 text-[#4A3728] placeholder:text-[#9C8A65] p-3 rounded-lg outline-none focus:border-[#8B6F3E] transition"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="bg-[#FBF4E2] border border-[#C9A45C]/50 text-[#4A3728] placeholder:text-[#9C8A65] p-3 rounded-lg outline-none focus:border-[#8B6F3E] transition"
          />

          <button
            type="submit"
            className="rounded-full py-3 font-bold tracking-wider text-[#F2E2C0] transition hover:scale-[1.02]"
            style={{
              background: "radial-gradient(circle at 35% 30%, #9c4a34, #6b2c1c 70%)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(201,164,92,0.6)",
            }}
          >
            {mode === "login" ? "LOG IN" : "SIGN UP"}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-xs text-[#6B5B41] hover:text-[#4A3728] transition"
          >
            {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}