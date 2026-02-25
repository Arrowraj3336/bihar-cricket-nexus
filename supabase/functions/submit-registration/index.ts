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
    const body = await req.json();
    const { name, dob, phone, email, documentType, documentNumber, playerType, address } = body;

    // --- Server-side validation ---
    const errors: string[] = [];

    if (!name || typeof name !== "string" || name.trim().length === 0) errors.push("Name is required");
    else if (name.trim().length > 100) errors.push("Name must be under 100 characters");

    if (!dob || typeof dob !== "string") errors.push("Date of birth is required");
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) errors.push("Invalid date format (YYYY-MM-DD)");

    if (!phone || typeof phone !== "string") errors.push("Phone is required");
    else if (!/^[\d+\-\s]{7,15}$/.test(phone.trim())) errors.push("Invalid phone number");

    if (!email || typeof email !== "string") errors.push("Email is required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || email.trim().length > 255) errors.push("Invalid email");

    const allowedDocTypes = ["Aadhar Card", "Birth Certificate"];
    if (!documentType || !allowedDocTypes.includes(documentType)) errors.push("Invalid document type");

    if (!documentNumber || typeof documentNumber !== "string" || documentNumber.trim().length === 0) errors.push("Document number is required");
    else if (documentNumber.trim().length > 50) errors.push("Document number too long");

    const allowedPlayerTypes = ["Batter", "Bowler", "All Rounder", "Wicket Keeper"];
    if (!playerType || !allowedPlayerTypes.includes(playerType)) errors.push("Invalid player type");

    if (!address || typeof address !== "string" || address.trim().length === 0) errors.push("Address is required");
    else if (address.trim().length > 500) errors.push("Address must be under 500 characters");

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ error: errors.join("; ") }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize inputs
    const sanitize = (s: string) => s.trim().replace(/[<>]/g, "");

    // Store in database
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabaseAdmin.from("registrations").insert({
      name: sanitize(name),
      dob,
      phone: sanitize(phone),
      email: sanitize(email),
      document_type: documentType,
      document_number: sanitize(documentNumber),
      player_type: playerType,
      address: sanitize(address),
    });

    if (dbError) throw dbError;

    console.log(`New registration from ${sanitize(name)} - ${playerType}`);

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
