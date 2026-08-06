"use client";

import { useState, useEffect } from "react";
import { Capsule } from "@/types/capsule";
import NewCapsuleForm from "@/components/NewCapsuleForm";
import CapsuleCard from "@/components/CapsuleCard";

const MIN_CELLS = 8;

export default function Home() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);

  useEffect(() => {
    document.title = `Time Capsules (${capsules.length})`;
  }, [capsules]);

  function handleAdd(newCapsule: Capsule) {
    setCapsules([...capsules, newCapsule]);
  }

  function handleDelete(id: number) {
    setCapsules(capsules.filter((c) => c.id !== id));
  }

  const unlockedCount = capsules.filter(
    (c) => new Date(c.unlockDate) <= new Date()
  ).length;

  const placeholderCount = Math.max(0, MIN_CELLS - capsules.length);

  return (
    <div
      className="min-h-screen text-[#EDE3CC] relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% -10%, #171a24 0%, #0a0b10 55%, #05060a 100%)",
      }}
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

      <nav className="relative border-b border-[#2A2B30]/60 bg-black/20 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full border border-[#C9A45C] flex items-center justify-center text-[#C9A45C] text-xs">
              ⧗
            </span>
            <span className="font-serif text-lg tracking-wide text-[#EDE3CC]">Time Capsule Archive</span>
          </div>
          <div className="flex gap-2 font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded-full border border-[#3A3B42] text-[#9C9FA8]">
              {String(capsules.length).padStart(2, "0")} SEALED
            </span>
            <span className="px-2.5 py-1 rounded-full border border-[#7A5B22] text-[#E8B85C]">
              {String(unlockedCount).padStart(2, "0")} OPEN
            </span>
          </div>
        </div>
      </nav>

      <main className="relative max-w-3xl mx-auto px-6 py-14 flex flex-col items-center gap-10">
        <div className="relative text-center">
          <svg
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-64 h-24 opacity-40"
            viewBox="0 0 240 90"
            fill="none"
          >
            <g stroke="#C9A45C" strokeWidth="0.6">
              <line x1="20" y1="70" x2="60" y2="40" />
              <line x1="60" y1="40" x2="100" y2="55" />
              <line x1="100" y1="55" x2="150" y2="15" />
              <line x1="150" y1="15" x2="200" y2="30" />
            </g>
            <g fill="#EDE3CC">
              <circle cx="20" cy="70" r="1.4" />
              <circle cx="60" cy="40" r="1.6" />
              <circle cx="100" cy="55" r="1.2" />
              <circle cx="150" cy="15" r="1.8" />
              <circle cx="200" cy="30" r="1.3" />
            </g>
          </svg>

          <p className="relative font-mono text-xs text-[#C9A45C] tracking-[0.25em] mb-3">
            FOR YOUR FUTURE SELF
          </p>
          <h1 className="relative font-serif text-4xl leading-tight text-[#F2E7C9]">
            Seal a message.<br />Let time hold it.
          </h1>
        </div>

        <NewCapsuleForm onAdd={handleAdd} />

        <div className="w-full">
          <p className="text-center font-mono text-xs text-[#7A7D87] tracking-[0.25em] mb-5">
            — ARCHIVE —
          </p>

          <div
            className="rounded-2xl p-5 border border-[#4A3A22]"
            style={{
              background: "linear-gradient(180deg, #1c150c 0%, #120d07 100%)",
              boxShadow: "inset 0 0 0 1px rgba(201,164,92,0.15)",
            }}
          >
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {capsules.length === 0 ? (
                <>
                  <EmptySlot />
                  <EmptySlot open />
                  <div className="col-span-2 row-span-2 rounded-xl border border-[#C9A45C]/40 bg-[#241a0d] flex flex-col items-center justify-center text-center p-4 gap-1">
                    <span className="text-3xl">🧰</span>
                    <p className="font-serif text-sm text-[#F2E7C9] mt-1">The first page is blank.</p>
                    <p className="text-[11px] text-[#B8AC8E]">Let&apos;s begin your history.</p>
                    <p className="text-[10px] text-[#7A7D87] mt-1">Seal your first capsule above.</p>
                  </div>
                  <EmptySlot />
                  <EmptySlot open />
                  <EmptySlot />
                  <EmptySlot />
                </>
              ) : (
                <>
                  {capsules.map((capsule) => (
                    <CapsuleCard key={capsule.id} capsule={capsule} onDelete={handleDelete} />
                  ))}
                  {Array.from({ length: placeholderCount }).map((_, i) => (
                    <EmptySlot key={`ph-${i}`} />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function EmptySlot({ open = false }: { open?: boolean }) {
  return (
    <div className="aspect-square rounded-lg border border-dashed border-[#3A2E1A] flex items-center justify-center text-[#5C4A2A]">
      {open ? <UnlockIcon className="w-4 h-4 opacity-40" /> : <LockIcon className="w-4 h-4 opacity-40" />}
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