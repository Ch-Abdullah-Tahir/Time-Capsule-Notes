import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const brevoSmtpLogin = Deno.env.get("BREVO_SMTP_LOGIN")!;
  const brevoSmtpKey = Deno.env.get("BREVO_SMTP_KEY")!;
  const senderAddress = Deno.env.get("SENDER_EMAIL")!; // capsulesarchive@gmail.com, verified in Brevo

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Capsules unlock on Pacific Time, not the server's UTC clock or any
  // individual viewer's timezone, so "unlock day" is the same calendar
  // day for everyone. "America/Los_Angeles" (not a hardcoded UTC-8
  // offset) automatically accounts for the PST/PDT switch.
  const todayPacific = new Date().toLocaleDateString("en-CA", { timeZone: "America/Los_Angeles" });

  const { data: capsules, error } = await supabase
    .from("capsules")
    .select("*")
    .lte("unlock_date", todayPacific)
    .eq("notified", false);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (!capsules || capsules.length === 0) {
    return new Response(JSON.stringify({ message: "No new unlocks" }), { status: 200 });
  }

  const client = new SMTPClient({
    connection: {
      hostname: "smtp-relay.brevo.com",
      port: 465,
      tls: true, // implicit TLS — denomailer@1.6.0's STARTTLS-on-587 handling failed ("invalid cmd")
      auth: { username: brevoSmtpLogin, password: brevoSmtpKey },
    },
  });

  let sent = 0;

  for (const capsule of capsules) {
    // auth.users isn't queryable with a plain select — use the admin API
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(capsule.user_id);
    if (userError || !userData?.user?.email) {
      console.error("Could not resolve email for user", capsule.user_id, userError);
      continue;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, email_notifications")
      .eq("id", capsule.user_id)
      .single();

    if (profile?.email_notifications === false) {
      // Respect the opt-out, but still mark notified so this row
      // doesn't get re-checked on every future run.
      await supabase.from("capsules").update({ notified: true }).eq("id", capsule.id);
      continue;
    }

    await client.send({
      from: `Time Capsule Archive <${senderAddress}>`,
      to: userData.user.email,
      subject: "🔓 A time capsule just unlocked",
      html: `<p>Hi ${profile?.display_name || "there"},</p>
             <p>One of your sealed capsules just unlocked:</p>
             <blockquote>${capsule.message}</blockquote>
             <p>— Time Capsule Archive</p>`,
    });

    await supabase.from("capsules").update({ notified: true }).eq("id", capsule.id);
    sent++;
  }

  await client.close();

  return new Response(JSON.stringify({ message: `Notified ${sent} user(s)` }), { status: 200 });
});
