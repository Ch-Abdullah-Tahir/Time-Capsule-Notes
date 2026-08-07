"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Capsule } from "@/types/capsule";
import { supabase } from "@/lib/supabase-client";
import NewCapsuleForm from "@/components/NewCapsuleForm";
import CapsuleCard from "@/components/CapsuleCard";

export default function Home() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadCapsules() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("capsules")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      setCapsules(data || []);
      setLoading(false);
    }

    loadCapsules();
  }, [router]);

  useEffect(() => {
    document.title = `Time Capsules (${capsules.length})`;
  }, [capsules]);

  async function handleAdd(message: string, unlockDate: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("capsules")
      .insert({ message, unlock_date: unlockDate, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }
    setCapsules([data, ...capsules]);
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from("capsules").delete().eq("id", id);
    if (error) {
      console.error(error);
      return;
    }
    setCapsules(capsules.filter((c) => c.id !== id));
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0D12] text-[#EDEAE3]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0B0D12] text-[#EDEAE3] max-w-md mx-auto p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Time Capsule Notes</h1>
        <button onClick={handleLogout} className="text-xs text-[#8B8F99]">Log out</button>
      </div>
      <NewCapsuleForm onAdd={handleAdd} />
      <div className="flex flex-col gap-3">
        {capsules.map((capsule) => (
          <CapsuleCard key={capsule.id} capsule={capsule} onDelete={handleDelete} />
        ))}
      </div>
    </main>
  );
}