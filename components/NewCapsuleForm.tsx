"use client";

import { useState } from "react";
import { Capsule } from "@/types/capsule";

type Props = {
  onAdd: (capsule: Capsule) => void;
};

export default function NewCapsuleForm({ onAdd }: Props) {
  const [message, setMessage] = useState("");
  const [unlockDate, setUnlockDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message || !unlockDate) return;

    onAdd({
      id: Date.now(),
      message,
      unlockDate,
    });

    setMessage("");
    setUnlockDate("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg rounded-2xl p-5 flex flex-col gap-4 border border-[#C9A45C]/40"
      style={{
        background: "linear-gradient(180deg, #F3E7C9 0%, #E7D3A1 100%)",
        boxShadow: "0 20px 40px -20px rgba(0,0,0,0.6)",
      }}
    >
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message to your future self..."
        rows={3}
        className="bg-[#FBF4E2] border border-[#C9A45C]/50 text-[#4A3728] placeholder:text-[#9C8A65] p-3 rounded-lg outline-none focus:border-[#8B6F3E] resize-none transition"
      />
      <div className="flex gap-3 items-center">
        <input
          type="date"
          value={unlockDate}
          onChange={(e) => setUnlockDate(e.target.value)}
          className="flex-1 bg-[#FBF4E2] border border-[#C9A45C]/50 text-[#4A3728] font-mono text-sm p-3 rounded-lg outline-none focus:border-[#8B6F3E] transition"
        />
        <button
          type="submit"
          className="relative w-16 h-16 rounded-full flex items-center justify-center text-[10px] font-bold tracking-wider text-[#F2E2C0] shrink-0 transition hover:scale-105"
          style={{
            background: "radial-gradient(circle at 35% 30%, #9c4a34, #6b2c1c 70%)",
            boxShadow:
              "0 4px 10px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(201,164,92,0.6), inset 0 2px 4px rgba(255,255,255,0.15)",
          }}
        >
          SEAL
        </button>
      </div>
    </form>
  );
}