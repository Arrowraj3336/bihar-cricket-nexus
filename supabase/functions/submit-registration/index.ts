import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, dob, phone, email, documentType, documentNumber, playerType, address } = await req.json();

    if (!name || !dob || !phone || !email || !documentType || !documentNumber || !playerType || !address) {
      throw new Error("All fields are required");
    }

    // Store in database
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabaseAdmin.from("registrations").insert({
      name,
      dob,
      phone,
      email,
      document_type: documentType,
      document_number: documentNumber,
      player_type: playerType,
      address,
    });

    if (dbError) throw dbError;

    // Send email notification via Lovable AI Gateway (as a workaround to notify)
    // For now, we'll use a simple fetch to send email via a free service
    // Actually, let's just store in DB and the admin can check the Cloud dashboard
    
    console.log(`New registration from ${name} (${email}) - ${playerType}`);

    return new Response(
      JSON.stringify({ success: true, message: "Registration submitted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
