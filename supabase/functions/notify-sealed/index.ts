import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

Deno.serve(async (req) => {
  const payload = await req.json();
  const capsule = payload.record; // Database Webhooks send { type, table, record, ... }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const brevoSmtpLogin = Deno.env.get("BREVO_SMTP_LOGIN")!;
  const brevoSmtpKey = Deno.env.get("BREVO_SMTP_KEY")!;
  const senderAddress = Deno.env.get("SENDER_EMAIL")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: userData } = await supabase.auth.admin.getUserById(capsule.user_id);
  const email = userData?.user?.email;
  if (!email) return new Response("no matching user", { status: 200 });

  const client = new SMTPClient({
    connection: {
      hostname: "smtp-relay.brevo.com",
      port: 465,
      tls: true, // implicit TLS — denomailer@1.6.0's STARTTLS-on-587 handling failed ("invalid cmd")
      auth: { username: brevoSmtpLogin, password: brevoSmtpKey },
    },
  });

  await client.send({
    from: `Time Capsule Archive <${senderAddress}>`,
    to: email,
    subject: "🔒 Your capsule is sealed",
    html: `<p>Your capsule was sealed and will open on <strong>${capsule.unlock_date}</strong>.</p>`,
  });

  await client.close();

  return new Response("ok", { status: 200 });
});
