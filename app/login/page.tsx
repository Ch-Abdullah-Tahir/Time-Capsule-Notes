"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [error, setError] = useState("");
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) { setError(error.message); return; }
      setResetSent(true);
      return;
    }

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); return; }
      // Supabase doesn't return an error when the email is already
      // registered (this stops the signup form being used to discover
      // which emails exist) — it silently "succeeds" without sending
      // anything. An empty identities array is the tell.
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setError("An account with this email already exists. Try logging in instead.");
        return;
      }
      // With "Confirm email" on, a genuinely new signUp succeeds but
      // returns no session until the user clicks the link in their inbox
      // — show that instead of silently doing nothing.
      if (!data.session) {
        setConfirmationSent(true);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); return; }
    }
    router.push("/");
  }

  async function handleGoogleSignIn() {
    setError("");
    // No redirectTo passed — this falls back to the Site URL configured
    // in Supabase's Auth settings, which is already correct for both
    // local dev and production, so there's nothing to keep in sync here.
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) setError(error.message);
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

        {confirmationSent ? (
          <div
            className="w-full max-w-sm rounded-2xl p-6 flex flex-col items-center gap-3 text-center border border-[#C9A45C]/40"
            style={{ background: "linear-gradient(180deg, #F3E7C9 0%, #E7D3A1 100%)", boxShadow: "0 20px 40px -20px rgba(0,0,0,0.6)" }}
          >
            <span className="text-3xl">✉️</span>
            <h1 className="font-serif text-2xl text-[#4A3728]">Check your email</h1>
            <p className="text-sm text-[#6B5B41]">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account — you&apos;ll land right back here, signed in.
            </p>
            <button
              type="button"
              onClick={() => { setConfirmationSent(false); setMode("login"); }}
              className="text-xs text-[#6B5B41] hover:text-[#4A3728] transition mt-1"
            >
              Back to log in
            </button>
          </div>
        ) : resetSent ? (
          <div
            className="w-full max-w-sm rounded-2xl p-6 flex flex-col items-center gap-3 text-center border border-[#C9A45C]/40"
            style={{ background: "linear-gradient(180deg, #F3E7C9 0%, #E7D3A1 100%)", boxShadow: "0 20px 40px -20px rgba(0,0,0,0.6)" }}
          >
            <span className="text-3xl">🔑</span>
            <h1 className="font-serif text-2xl text-[#4A3728]">Check your email</h1>
            <p className="text-sm text-[#6B5B41]">
              We sent a password reset link to <strong>{email}</strong>. Click it to choose a new password.
            </p>
            <button
              type="button"
              onClick={() => { setResetSent(false); setMode("login"); }}
              className="text-xs text-[#6B5B41] hover:text-[#4A3728] transition mt-1"
            >
              Back to log in
            </button>
          </div>
        ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4 border border-[#C9A45C]/40"
          style={{ background: "linear-gradient(180deg, #F3E7C9 0%, #E7D3A1 100%)", boxShadow: "0 20px 40px -20px rgba(0,0,0,0.6)" }}
        >
          <h1 className="font-serif text-2xl text-center text-[#4A3728]">
            {mode === "login" ? "Welcome back" : mode === "signup" ? "Begin your archive" : "Reset your password"}
          </h1>

          {error && <p className="text-sm text-red-700 text-center">{error}</p>}

          {mode !== "forgot" && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="flex items-center justify-center gap-2 bg-white border border-[#C9A45C]/40 text-[#3C3C3C] text-sm font-medium py-2.5 rounded-lg hover:bg-[#FBF4E2] transition"
              >
                <GoogleIcon className="w-4 h-4" />
                Continue with Google
              </button>

              <div className="flex items-center gap-3 text-[10px] text-[#8B6F3E] tracking-wider">
                <div className="flex-1 h-px bg-[#C9A45C]/30" />
                OR
                <div className="flex-1 h-px bg-[#C9A45C]/30" />
              </div>
            </>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-[#FBF4E2] border border-[#C9A45C]/50 text-[#4A3728] placeholder:text-[#9C8A65] p-3 rounded-lg outline-none focus:border-[#8B6F3E] transition"
          />
          {mode !== "forgot" && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="bg-[#FBF4E2] border border-[#C9A45C]/50 text-[#4A3728] placeholder:text-[#9C8A65] p-3 rounded-lg outline-none focus:border-[#8B6F3E] transition"
            />
          )}

          {mode === "login" && (
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="text-xs text-[#6B5B41] hover:text-[#4A3728] transition text-right -mt-2"
            >
              Forgot password?
            </button>
          )}

          <button
            type="submit"
            className="rounded-full py-3 font-bold tracking-wider text-[#F2E2C0] transition hover:scale-[1.02]"
            style={{
              background: "radial-gradient(circle at 35% 30%, #9c4a34, #6b2c1c 70%)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(201,164,92,0.6)",
            }}
          >
            {mode === "login" ? "LOG IN" : mode === "signup" ? "SIGN UP" : "SEND RESET LINK"}
          </button>

          {mode === "forgot" ? (
            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-xs text-[#6B5B41] hover:text-[#4A3728] transition"
            >
              Back to log in
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-xs text-[#6B5B41] hover:text-[#4A3728] transition"
            >
              {mode === "login" ? "Need an account? Sign up" : "Already have an account? Log in"}
            </button>
          )}
        </form>
        )}
      </div>
    </div>
  );
}

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.63v3.02h3.89c2.27-2.09 3.57-5.17 3.57-8.84Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.89-3.02c-1.08.73-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.11C3.26 21.3 7.31 24 12 24Z" />
      <path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.28a12 12 0 0 0 0 10.8l4.01-3.11Z" />
      <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.28 6.6l4.01 3.11C6.23 6.86 8.88 4.75 12 4.75Z" />
    </svg>
  );
}