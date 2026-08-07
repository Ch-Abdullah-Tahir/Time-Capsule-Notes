"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase-client";

export default function TestConnection() {
  useEffect(() => {
    async function check() {
      const { data, error } = await supabase.from("capsules").select("*");
      console.log("data:", data);
      console.log("error:", error);
    }
    check();
  }, []);

  return <p>Check your browser console (F12)</p>;
}