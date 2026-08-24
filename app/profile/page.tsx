"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";

type Profile = {
  display_name: string | null;
  email_notifications: boolean;
};

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setEmail(user.email ?? "");

      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, email_notifications")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setDisplayName(data.display_name ?? "");
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleSave() {
    setSaving(true);
    setSavedMsg("");
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        email_notifications: profile?.email_notifications ?? true,
      })
      .eq("id", user.id);

    setSaving(false);
    setSavedMsg(error ? "Could not save. Try again." : "Saved.");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b10] text-[#EDE3CC]">
        <p className="font-serif">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-[#EDE3CC]"
      style={{ background: "radial-gradient(ellipse at 50% -10%, #171a24 0%, #0a0b10 55%, #05060a 100%)" }}
    >
      <nav className="border-b border-[#2A2B30]/60 bg-black/20 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => router.push("/")} className="text-xs text-[#9C9FA8] hover:text-[#EDE3CC] transition">
            ← Back to archive
          </button>
        </div>
      </nav>

      <main className="max-w-md mx-auto px-6 py-14 flex flex-col gap-6">
        <h1 className="font-serif text-3xl text-[#F2E7C9]">Your profile</h1>

        <div
          className="rounded-2xl p-6 border border-[#4A3A22] flex flex-col gap-5"
          style={{ background: "linear-gradient(180deg, #1c150c 0%, #120d07 100%)" }}
        >
          <div>
            <label className="text-xs text-[#9C9FA8] block mb-1">Email</label>
            <p className="text-sm text-[#EDE3CC]">{email}</p>
          </div>

          <div>
            <label className="text-xs text-[#9C9FA8] block mb-1">Display name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-[#0B0D12] border border-[#3A2E1A] text-[#EDE3CC] text-sm p-2 rounded outline-none focus:border-[#C9A45C]"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-[#EDE3CC]">
            <input
              type="checkbox"
              checked={profile?.email_notifications ?? true}
              onChange={(e) =>
                setProfile((p) => ({ ...(p ?? { display_name: displayName }), email_notifications: e.target.checked }))
              }
            />
            Email me when a capsule unlocks
          </label>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#C9A45C] text-[#0B0D12] text-sm font-medium py-2 rounded-full disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>

          {savedMsg && <p className="text-xs text-[#9C9FA8]">{savedMsg}</p>}
        </div>
      </main>
    </div>
  );
}
