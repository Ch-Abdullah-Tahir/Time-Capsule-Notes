import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SYSTEM_PROMPT = `You are the Vault Assistant for a Time Capsule app. You help users in two ways:
1. Answer questions about their own sealed/unlocked capsules, using the get_capsules tool.
2. Help them write meaningful, reflective messages to their future self — thoughtful prompts, gentle encouragement, no tool needed for this.

Never reveal or discuss any other user's data. Only use get_capsules for the current user.`;

const tools = [
  {
    type: "function",
    function: {
      name: "get_capsules",
      description: "Fetches the current user's own time capsules, including message, unlock date, and whether they're notified.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
];

export async function POST(request: Request) {
  const { message, userId } = await request.json();

  if (!message || !userId) {
    return NextResponse.json({ error: "Missing message or userId" }, { status: 400 });
  }

  const messages: any[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: message },
  ];

  const first = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      tools,
    }),
  });

  const firstData = await first.json();

  if (!first.ok || !firstData.choices) {
    console.error("Groq error (first call):", JSON.stringify(firstData, null, 2));
    return NextResponse.json(
      { error: "Groq request failed", details: firstData },
      { status: 500 }
    );
  }

  const choice = firstData.choices[0].message;

  if (choice.tool_calls) {
    const { data: capsules, error: dbError } = await supabaseAdmin
      .from("capsules")
      .select("*")
      .eq("user_id", userId);

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json({ error: "Database lookup failed", details: dbError }, { status: 500 });
    }

    messages.push(choice);
    messages.push({
      role: "tool",
      tool_call_id: choice.tool_calls[0].id,
      content: JSON.stringify(capsules ?? []),
    });

    const second = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages }),
    });

    const secondData = await second.json();

    if (!second.ok || !secondData.choices) {
      console.error("Groq error (second call):", JSON.stringify(secondData, null, 2));
      return NextResponse.json(
        { error: "Groq request failed", details: secondData },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply: secondData.choices[0].message.content });
  }

  return NextResponse.json({ reply: choice.content });
}