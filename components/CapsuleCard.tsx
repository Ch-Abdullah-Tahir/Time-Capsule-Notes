import { Capsule } from "@/types/capsule";

type Props = {
  capsule: Capsule;
  onDelete: (id: string) => void;
};

export default function CapsuleCard({ capsule, onDelete }: Props) {
  const isUnlocked = new Date(capsule.unlock_date) <= new Date();

  return (
    <div className="border border-[#2A2E38] bg-[#15181F] rounded-lg p-3 flex justify-between items-start">
      <div>
        <p className="text-xs text-[#8B8F99]">Unlocks: {capsule.unlock_date}</p>
        {isUnlocked ? (
          <p className="text-[#EDEAE3] mt-1">{capsule.message}</p>
        ) : (
          <p className="text-[#5A5F6B] italic mt-1">Sealed until then</p>
        )}
      </div>
      <button onClick={() => onDelete(capsule.id)} className="text-xs text-red-400">
        Delete
      </button>
    </div>
  );
}