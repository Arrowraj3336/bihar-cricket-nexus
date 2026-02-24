import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-password",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  const providedPassword = req.headers.get("x-admin-password");

  if (!providedPassword || providedPassword !== adminPassword) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  try {
    // Gallery: upload image
    if (action === "upload-gallery" && req.method === "POST") {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const altText = formData.get("alt_text") as string || "";
      const showOnHomepage = formData.get("show_on_homepage") === "true";

      if (!file) {
        return new Response(JSON.stringify({ error: "No file provided" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("gallery_images").insert({
        image_url: urlData.publicUrl,
        alt_text: altText,
        show_on_homepage: showOnHomepage,
      });

      if (dbError) throw dbError;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Gallery: delete image
    if (action === "delete-gallery" && req.method === "POST") {
      const { id, image_url } = await req.json();
      
      // Extract filename from URL
      const parts = image_url.split("/gallery/");
      if (parts[1]) {
        await supabase.storage.from("gallery").remove([decodeURIComponent(parts[1])]);
      }

      const { error } = await supabase.from("gallery_images").delete().eq("id", id);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Points table: upsert
    if (action === "upsert-points" && req.method === "POST") {
      const body = await req.json();
      const { error } = await supabase.from("points_table").upsert(
        { team_name: body.team_name, played: body.played, won: body.won, lost: body.lost, points: body.points, updated_at: new Date().toISOString() },
        { onConflict: "team_name" }
      );
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Upcoming matches: add
    if (action === "add-match" && req.method === "POST") {
      const body = await req.json();
      const { error } = await supabase.from("upcoming_matches").insert({
        team1: body.team1,
        team2: body.team2,
        match_date: body.match_date,
        match_time: body.match_time,
        location: "Nagendrajha Stadium",
      });
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Upcoming matches: delete
    if (action === "delete-match" && req.method === "POST") {
      const { id } = await req.json();
      const { error } = await supabase.from("upcoming_matches").delete().eq("id", id);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Top performers: upsert (one per category)
    if (action === "upsert-performer" && req.method === "POST") {
      const body = await req.json();
      
      await supabase.from("top_performers").delete().eq("category", body.category);
      
      const { error } = await supabase.from("top_performers").insert({
        category: body.category,
        name: body.name,
        team: body.team,
        runs: body.runs || 0,
        wickets: body.wickets || 0,
        matches_played: body.matches_played || 0,
        matches_won: body.matches_won || 0,
        photo_url: body.photo_url || null,
        stat_value: body.stat_value || 0,
        stat_label: body.stat_label || "Runs",
      });
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Upload performer photo
    if (action === "upload-performer-photo" && req.method === "POST") {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
        return new Response(JSON.stringify({ error: "No file provided" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const fileName = `performers/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error: uploadError } = await supabase.storage
        .from("gallery")
        .upload(fileName, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(fileName);

      return new Response(JSON.stringify({ success: true, url: urlData.publicUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // News: add
    if (action === "add-news" && req.method === "POST") {
      const body = await req.json();
      const { error } = await supabase.from("news").insert({
        title: body.title,
        content: body.content,
        category: body.category || "general",
        is_pinned: body.is_pinned || false,
      });
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Scoreboard: add
    if (action === "add-scoreboard" && req.method === "POST") {
      const body = await req.json();
      const { error } = await supabase.from("scoreboard_updates").insert({
        message: body.message,
      });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Scoreboard: delete
    if (action === "delete-scoreboard" && req.method === "POST") {
      const { id } = await req.json();
      const { error } = await supabase.from("scoreboard_updates").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // News: delete
    if (action === "delete-news" && req.method === "POST") {
      const { id } = await req.json();
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Analytics: get visitor stats
    if (action === "get-analytics" && req.method === "POST") {
      // Get all visitor logs
      const { data: logs, error } = await supabase
        .from("visitor_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1000);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true, data: logs || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
