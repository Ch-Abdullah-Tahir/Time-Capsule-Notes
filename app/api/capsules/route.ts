import { NextResponse } from "next/server";
import { Capsule } from "@/types/capsule";

let capsules: Capsule[] = [];

export async function GET() {
  return NextResponse.json(capsules);
}

export async function POST(request: Request) {
  const body = await request.json();
  const newCapsule: Capsule = {
    id: Date.now(),
    message: body.message,
    unlockDate: body.unlockDate,
  };
  capsules.push(newCapsule);
  return NextResponse.json(newCapsule, { status: 201 });
}
