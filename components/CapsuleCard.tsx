import { Capsule } from "@/types/capsule";

export default function CapsuleCard({ capsule }: { capsule: Capsule }) {
  return (
    <div className="border rounded-lg p-3">
      <p className="text-sm text-gray-500">Unlocks: {capsule.unlockDate}</p>
      <p>🔒 Sealed until then</p>
    </div>
  );
}
