import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const slackWebhookUrl = Deno.env.get("SLACK_WEBHOOK_URL")!;

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: capsules, error } = await supabase
    .from("capsules")
    .select("*")
    .lte("unlock_date", new Date().toISOString().slice(0, 10))
    .eq("notified", false);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (!capsules || capsules.length === 0) {
    return new Response(JSON.stringify({ message: "No new unlocks" }), { status: 200 });
  }

  for (const capsule of capsules) {
    await fetch(slackWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `🔓 A time capsule just unlocked: "${capsule.message}"`,
      }),
    });

    await supabase.from("capsules").update({ notified: true }).eq("id", capsule.id);
  }

  return new Response(
    JSON.stringify({ message: `Notified ${capsules.length} capsule(s)` }),
    { status: 200 }
  );
});
