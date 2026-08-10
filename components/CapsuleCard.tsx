"use client";

import { useState } from "react";
import { Capsule } from "@/types/capsule";

type Props = {
  capsule: Capsule;
  onDelete: (id: string) => void;
};

export default function CapsuleCard({ capsule, onDelete }: Props) {
  const [hovered, setHovered] = useState(false);
  const isUnlocked = new Date(capsule.unlock_date) <= new Date();

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(capsule.unlock_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="relative aspect-square" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div
        className={`w-full h-full rounded-lg border flex items-center justify-center transition ${
          isUnlocked ? "bg-[#241a0d] border-[#C9A45C]/50 text-[#E8B85C]" : "bg-[#1a140c] border-[#3A2E1A] text-[#8B6F3E]"
        }`}
      >
        {isUnlocked ? <UnlockIcon className="w-5 h-5" /> : <LockIcon className="w-5 h-5" />}
      </div>

      {hovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 rounded-md border border-[#4A3A22] bg-[#0d0a06] p-2 text-center text-[10px] text-[#D8CBA8] shadow-lg z-10">
          <p className="font-mono text-[#C9A45C]">{capsule.unlock_date}</p>
          {isUnlocked ? (
            <p className="mt-1 leading-snug">{capsule.message}</p>
          ) : (
            <p className="mt-1 text-[#8B8F99]">Opens in {daysLeft} day{daysLeft === 1 ? "" : "s"}</p>
          )}
        </div>
      )}

      <button
        onClick={() => onDelete(capsule.id)}
        className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0d0a06] border border-[#4A3A22] text-[#C97B6C] text-[10px] flex items-center justify-center transition ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Delete capsule"
      >
        ×
      </button>
    </div>
  );
}

function LockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="11" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function UnlockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="5" y="11" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 11V8a4 4 0 0 1 7.5-2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}