import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminApi } from "@/lib/admin-api";
import { TEAM_NAMES } from "@/lib/teams-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Lock, Upload, Trophy, Calendar, Star, Trash2, Image, X } from "lucide-react";

const AdminPanel = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      setAuthenticated(true);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-card border border-border rounded-2xl p-8 w-full max-w-sm space-y-4 shadow-card">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Lock size={24} className="text-primary" />
            <h1 className="font-heading text-2xl font-bold">Admin Panel</h1>
          </div>
          <div>
            <Label htmlFor="password">Admin Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>
          <Button type="submit" className="w-full">Enter</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 space-y-8 max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold">Admin Panel</h1>
          <Button variant="outline" size="sm" onClick={() => { setAuthenticated(false); setPassword(""); }}>Logout</Button>
        </div>

        <GalleryManager password={password} toast={toast} />
        <PointsTableManager password={password} toast={toast} />
        <MatchesManager password={password} toast={toast} />
        <PerformersManager password={password} toast={toast} />
      </div>
    </div>
  );
};

// ── Gallery Manager ──
const GalleryManager = ({ password, toast }: { password: string; toast: any }) => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);

  const loadImages = async () => {
    const { data } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
    if (data) setImages(data);
  };

  useEffect(() => { loadImages(); }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return;
    setLoading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("alt_text", files[i].name.replace(/\.[^.]+$/, ""));
        formData.append("show_on_homepage", showOnHomepage ? "true" : "false");
        await adminApi("upload-gallery", password, formData);
      }
      toast({ title: "Uploaded!", description: `${files.length} image(s) uploaded successfully.` });
      setFiles(null);
      loadImages();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, image_url: string) => {
    try {
      await adminApi("delete-gallery", password, { id, image_url });
      toast({ title: "Deleted!" });
      loadImages();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Image size={20} className="text-primary" />
        <h2 className="font-heading text-xl font-bold">Gallery Photos</h2>
      </div>

      <form onSubmit={handleUpload} className="space-y-3">
        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
          <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Select images to upload</p>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="max-w-xs mx-auto"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="homepage"
            checked={showOnHomepage}
            onChange={(e) => setShowOnHomepage(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="homepage" className="text-sm">Show on homepage (max 7 shown)</Label>
        </div>
        <Button type="submit" disabled={loading || !files}>
          {loading ? "Uploading..." : "Submit"}
        </Button>
      </form>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden">
              <img src={img.image_url} alt={img.alt_text} className="w-full h-24 object-cover" />
              <button
                onClick={() => handleDelete(img.id, img.image_url)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
              {img.show_on_homepage && (
                <span className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[8px] px-1 rounded">Homepage</span>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// ── Points Table Manager ──
const PointsTableManager = ({ password, toast }: { password: string; toast: any }) => {
  const [team, setTeam] = useState("");
  const [played, setPlayed] = useState("");
  const [won, setWon] = useState("");
  const [lost, setLost] = useState("");
  const [points, setPoints] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;
    setLoading(true);
    try {
      await adminApi("upsert-points", password, {
        team_name: team,
        played: parseInt(played) || 0,
        won: parseInt(won) || 0,
        lost: parseInt(lost) || 0,
        points: parseInt(points) || 0,
      });
      toast({ title: "Updated!", description: `${team} points updated.` });
      setPlayed(""); setWon(""); setLost(""); setPoints(""); setTeam("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Trophy size={20} className="text-accent" />
        <h2 className="font-heading text-xl font-bold">Points Table</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="col-span-2 sm:col-span-3">
          <Label>Team</Label>
          <Select value={team} onValueChange={setTeam}>
            <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
            <SelectContent>
              {TEAM_NAMES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Played</Label>
          <Input type="number" value={played} onChange={(e) => setPlayed(e.target.value)} placeholder="0" />
        </div>
        <div>
          <Label>Won</Label>
          <Input type="number" value={won} onChange={(e) => setWon(e.target.value)} placeholder="0" />
        </div>
        <div>
          <Label>Lost</Label>
          <Input type="number" value={lost} onChange={(e) => setLost(e.target.value)} placeholder="0" />
        </div>
        <div>
          <Label>Points</Label>
          <Input type="number" value={points} onChange={(e) => setPoints(e.target.value)} placeholder="0" />
        </div>
        <div className="col-span-2 sm:col-span-3">
          <Button type="submit" disabled={loading || !team} className="w-full">
            {loading ? "Updating..." : "Submit"}
          </Button>
        </div>
      </form>
    </section>
  );
};

// ── Matches Manager ──
const MatchesManager = ({ password, toast }: { password: string; toast: any }) => {
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);

  const loadMatches = async () => {
    const { data } = await supabase.from("upcoming_matches").select("*").order("match_date", { ascending: true });
    if (data) setMatches(data);
  };

  useEffect(() => { loadMatches(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team1 || !team2 || !matchDate || !matchTime) return;
    setLoading(true);
    try {
      await adminApi("add-match", password, {
        team1, team2, match_date: matchDate, match_time: matchTime,
      });
      toast({ title: "Match added!" });
      setTeam1(""); setTeam2(""); setMatchDate(""); setMatchTime("");
      loadMatches();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await adminApi("delete-match", password, { id });
      toast({ title: "Match removed!" });
      loadMatches();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Calendar size={20} className="text-accent" />
        <h2 className="font-heading text-xl font-bold">Upcoming Matches</h2>
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3">
        <div>
          <Label>Team 1</Label>
          <Select value={team1} onValueChange={setTeam1}>
            <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
            <SelectContent>
              {TEAM_NAMES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Team 2</Label>
          <Select value={team2} onValueChange={setTeam2}>
            <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
            <SelectContent>
              {TEAM_NAMES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} />
        </div>
        <div>
          <Label>Time</Label>
          <Input type="time" value={matchTime} onChange={(e) => setMatchTime(e.target.value)} />
        </div>
        <div className="col-span-2 text-xs text-muted-foreground">
          📍 Location: Nagendrajha Stadium (auto-added)
        </div>
        <div className="col-span-2">
          <Button type="submit" disabled={loading || !team1 || !team2 || !matchDate || !matchTime} className="w-full">
            {loading ? "Adding..." : "Submit"}
          </Button>
        </div>
      </form>

      {matches.length > 0 && (
        <div className="space-y-2 mt-4">
          <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">Current Matches</h3>
          {matches.map((m) => (
            <div key={m.id} className="flex items-center justify-between bg-secondary/50 rounded-xl px-4 py-3 border border-border/50">
              <div className="text-sm">
                <span className="font-semibold">{m.team1}</span>
                <span className="text-muted-foreground mx-2">vs</span>
                <span className="font-semibold">{m.team2}</span>
                <span className="text-muted-foreground ml-2 text-xs">
                  {m.match_date} • {m.match_time}
                </span>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleRemove(m.id)}>
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

// ── Performers Manager ──
const PerformersManager = ({ password, toast }: { password: string; toast: any }) => {
  const [category, setCategory] = useState<string>("orange");
  const [name, setName] = useState("");
  const [team, setTeam] = useState("");
  const [runs, setRuns] = useState("");
  const [wickets, setWickets] = useState("");
  const [matchesPlayed, setMatchesPlayed] = useState("");
  const [matchesWon, setMatchesWon] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !team) return;
    setLoading(true);
    try {
      let photoUrl = null;
      if (photo) {
        const formData = new FormData();
        formData.append("file", photo);
        const uploadRes = await adminApi("upload-performer-photo", password, formData);
        photoUrl = uploadRes.url;
      }

      const statValue = category === "purple" ? parseInt(wickets) || 0 : parseInt(runs) || 0;
      const statLabel = category === "purple" ? "Wickets" : category === "mvp" ? "Points" : "Runs";

      await adminApi("upsert-performer", password, {
        category, name, team,
        runs: parseInt(runs) || 0,
        wickets: parseInt(wickets) || 0,
        matches_played: parseInt(matchesPlayed) || 0,
        matches_won: parseInt(matchesWon) || 0,
        photo_url: photoUrl,
        stat_value: statValue,
        stat_label: statLabel,
      });
      toast({ title: "Updated!", description: `${category} cap performer updated.` });
      setName(""); setTeam(""); setRuns(""); setWickets(""); setMatchesPlayed(""); setMatchesWon(""); setPhoto(null);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Star size={20} className="text-accent" />
        <h2 className="font-heading text-xl font-bold">Top Performers</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="orange">Orange Cap (Most Runs)</SelectItem>
              <SelectItem value="purple">Purple Cap (Most Wickets)</SelectItem>
              <SelectItem value="mvp">Most Valuable Player</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Player name" />
          </div>
          <div>
            <Label>Team</Label>
            <Select value={team} onValueChange={setTeam}>
              <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
              <SelectContent>
                {TEAM_NAMES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Runs</Label>
            <Input type="number" value={runs} onChange={(e) => setRuns(e.target.value)} placeholder="0" />
          </div>
          <div>
            <Label>Wickets</Label>
            <Input type="number" value={wickets} onChange={(e) => setWickets(e.target.value)} placeholder="0" />
          </div>
          <div>
            <Label>Match Played</Label>
            <Input type="number" value={matchesPlayed} onChange={(e) => setMatchesPlayed(e.target.value)} placeholder="0" />
          </div>
          <div>
            <Label>Match Won</Label>
            <Input type="number" value={matchesWon} onChange={(e) => setMatchesWon(e.target.value)} placeholder="0" />
          </div>
        </div>
        <div>
          <Label>Player Photo</Label>
          <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
        </div>
        <Button type="submit" disabled={loading || !name || !team} className="w-full">
          {loading ? "Updating..." : "Submit (Replaces Current)"}
        </Button>
      </form>
    </section>
  );
};

export default AdminPanel;
