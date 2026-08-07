"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
//useState for email, password, error — same pattern as your NewCapsuleForm: memory boxes that update as you type.
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
      if (error) {
        setError(error.message);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }
    }

    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0D12] text-[#EDEAE3]">
      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4 p-6 rounded-lg border border-[#2A2E38] bg-[#15181F]">
        <h1 className="font-serif text-2xl text-center">{mode === "login" ? "Log in" : "Sign up"}</h1>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="bg-[#0B0D12] border border-[#2A2E38] p-3 rounded-md outline-none focus:border-[#A6875B]"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="bg-[#0B0D12] border border-[#2A2E38] p-3 rounded-md outline-none focus:border-[#A6875B]"
        />

        <button type="submit" className="bg-[#A6875B] text-[#0B0D12] p-3 rounded-md font-medium hover:bg-[#F0A94E] transition">
          {mode === "login" ? "Log In" : "Sign Up"}
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="text-xs text-[#8B8F99] hover:text-[#EDEAE3]"
        >
          {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </form>
    </div>
  );
}