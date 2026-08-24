"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  // Clicking the reset link puts a recovery session in the URL, but
  // supabase-js parses and loads it asynchronously — submitting before
  // that finishes is what caused "Auth session missing!". Gate the form
  // on actually seeing that session arrive.
  const [ready, setReady] = useState(false);
  const [linkInvalid, setLinkInvalid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Covers the case where the session is already loaded by the time
    // this runs (e.g. on a fast connection).
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    // Covers the normal case: the PASSWORD_RECOVERY event fires once
    // supabase-js finishes processing the token from the URL.
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) setReady(true);
    });

    // If neither happens within a few seconds, the link is expired/invalid.
    const timeout = setTimeout(() => {
      setReady((currentlyReady) => {
        if (!currentlyReady) setLinkInvalid(true);
        return currentlyReady;
      });
    }, 5000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSaving(true);
    // Clicking the reset link in the email already signs the user into a
    // temporary recovery session, so this just sets a new password on it.
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) { setError(error.message); return; }
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
          <h1 className="font-serif text-2xl text-center text-[#4A3728]">Choose a new password</h1>

          {linkInvalid ? (
            <p className="text-sm text-red-700 text-center">
              This reset link is invalid or has expired. Go back to the login page and request a new one.
            </p>
          ) : !ready ? (
            <p className="text-sm text-[#6B5B41] text-center">Validating your reset link...</p>
          ) : (
            <>
              {error && <p className="text-sm text-red-700 text-center">{error}</p>}

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password"
                className="bg-[#FBF4E2] border border-[#C9A45C]/50 text-[#4A3728] placeholder:text-[#9C8A65] p-3 rounded-lg outline-none focus:border-[#8B6F3E] transition"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="bg-[#FBF4E2] border border-[#C9A45C]/50 text-[#4A3728] placeholder:text-[#9C8A65] p-3 rounded-lg outline-none focus:border-[#8B6F3E] transition"
              />

              <button
                type="submit"
                disabled={saving}
                className="rounded-full py-3 font-bold tracking-wider text-[#F2E2C0] transition hover:scale-[1.02] disabled:opacity-50"
                style={{
                  background: "radial-gradient(circle at 35% 30%, #9c4a34, #6b2c1c 70%)",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(201,164,92,0.6)",
                }}
              >
                {saving ? "Saving..." : "SAVE NEW PASSWORD"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
