"use client";

import { useState, useEffect } from "react";
import { Capsule } from "@/types/capsule";
import NewCapsuleForm from "@/components/NewCapsuleForm";
import CapsuleCard from "@/components/CapsuleCard";

export default function Home() {
  const [capsules, setCapsules] = useState<Capsule[]>([]);

  useEffect(() => {
    document.title = `Time Capsules (${capsules.length})`;
  }, [capsules]);

  function handleAdd(newCapsule: Capsule) {
    setCapsules([...capsules, newCapsule]);
  }

  return (
    <main className="max-w-md mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Time Capsule Notes</h1>
      <NewCapsuleForm onAdd={handleAdd} />
      <div className="flex flex-col gap-3">
        {capsules.map((capsule) => (
          <CapsuleCard key={capsule.id} capsule={capsule} />
        ))}
      </div>
    </main>
  );
}
