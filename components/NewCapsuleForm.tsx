"use client";

import { useState } from "react";

type Props = {
  onAdd: (message: string, unlockDate: string) => void;
};

export default function NewCapsuleForm({ onAdd }: Props) {
  const [message, setMessage] = useState("");
  const [unlockDate, setUnlockDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message || !unlockDate) return;
    onAdd(message, unlockDate);
    setMessage("");
    setUnlockDate("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border border-[#2A2E38] bg-[#15181F] rounded-lg">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message to your future self..."
        className="bg-[#0B0D12] border border-[#2A2E38] text-[#EDEAE3] p-2 rounded"
      />
      <input
        type="date"
        value={unlockDate}
        onChange={(e) => setUnlockDate(e.target.value)}
        className="bg-[#0B0D12] border border-[#2A2E38] text-[#EDEAE3] p-2 rounded"
      />
      <button type="submit" className="bg-[#A6875B] text-[#0B0D12] p-2 rounded font-medium">
        Seal Capsule
      </button>
    </form>
  );
}