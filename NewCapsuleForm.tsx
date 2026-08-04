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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border rounded-lg">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a message to your future self..."
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={unlockDate}
        onChange={(e) => setUnlockDate(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-black text-white p-2 rounded">
        Seal Capsule
      </button>
    </form>
  );
}
