"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";

type Message = { role: "user" | "assistant"; text: string };

export default function CapsuleAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Please log in first." }]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, userId: user.id }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply || "Sorry, something went wrong." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#C9A45C] text-[#0B0D12] flex items-center justify-center text-xl shadow-lg z-50"
        aria-label="Open capsule assistant"
      >
        {open ? "×" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-80 max-h-[70vh] flex flex-col rounded-xl border border-[#4A3A22] bg-[#120d07] shadow-2xl z-50">
          <div className="p-3 border-b border-[#3A2E1A]">
            <p className="font-serif text-sm text-[#F2E7C9]">Vault assistant</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {messages.length === 0 && (
              <p className="text-xs text-[#7A7D87]">
                Ask about your capsules, or ask me to help you write one — e.g. "How many are sealed?" or "Help me write a message to my future self."
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm rounded-lg px-3 py-2 max-w-[85%] ${
                  m.role === "user"
                    ? "self-end bg-[#C9A45C] text-[#0B0D12]"
                    : "self-start bg-[#1c150c] text-[#EDE3CC] border border-[#3A2E1A]"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && <p className="text-xs text-[#7A7D87]">Thinking...</p>}
          </div>
          <div className="p-3 border-t border-[#3A2E1A] flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask something..."
              className="flex-1 bg-[#0B0D12] border border-[#3A2E1A] text-[#EDE3CC] text-sm p-2 rounded outline-none focus:border-[#C9A45C]"
            />
            <button onClick={handleSend} className="bg-[#C9A45C] text-[#0B0D12] text-sm px-3 rounded font-medium">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}