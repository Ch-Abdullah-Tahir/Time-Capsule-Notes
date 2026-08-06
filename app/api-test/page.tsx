"use client";

import { useState } from "react";

export default function ApiTest() {
  const [message, setMessage] = useState("");
  const [unlockDate, setUnlockDate] = useState("");
  const [log, setLog] = useState("");

  async function handleFetch() {
    const res = await fetch("/api/capsules");
    const data = await res.json();
    setLog(JSON.stringify(data, null, 2));
  }

  async function handlePost() {
    const res = await fetch("/api/capsules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message, unlockDate }),
    });
    const data = await res.json();
    setLog(JSON.stringify(data, null, 2));
  }

  return (
    <div className="p-6 flex flex-col gap-3 max-w-md">
      <h1 className="text-xl font-bold">API Test Page</h1>
      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="message" className="border p-2" />
      <input value={unlockDate} onChange={(e) => setUnlockDate(e.target.value)} placeholder="unlockDate" className="border p-2" />
      <button onClick={handlePost} className="bg-black text-white p-2">POST (add capsule)</button>
      <button onClick={handleFetch} className="bg-gray-700 text-white p-2">GET (fetch list)</button>
      <pre className="bg-gray-100 text-black p-3 text-xs whitespace-pre-wrap">{log}</pre>
    </div>
  );
}
