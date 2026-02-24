import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminApi } from "@/lib/admin-api";
import { TEAM_NAMES } from "@/lib/teams-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Lock, Upload, Trophy, Calendar, Star, Trash2, Image, X,
  BarChart3, Users, MapPin, Smartphone, Monitor, Tablet,
  Newspaper, Pin, TrendingUp, Eye, Globe, Shield,
} from "lucide-react";
import { CricketBall, CricketBat, CricketStumps } from "@/components/CricketDecorations";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, ResponsiveContainer } from "recharts";

const AdminPanel = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) setAuthenticated(true);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        <CricketBall className="absolute top-20 right-20 w-40 h-40 text-primary opacity-[0.04]" />
        <CricketBat className="absolute bottom-20 left-10 w-10 h-32 text-accent opacity-[0.06] -rotate-12" />
        <CricketStumps className="absolute top-1/3 left-20 w-12 h-20 text-primary opacity-[0.04]" />

        <form onSubmit={handleLogin} className="relative bg-gradient-card border border-border rounded-2xl p-8 w-full max-w-sm space-y-5 shadow-card">
          <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary rounded-t-2xl absolute top-0 left-0 right-0" />
          <div className="flex flex-col items-center gap-2 pt-2">
            <div className="w-14 h-14 rounded-xl bg-gradient-accent flex items-center justify-center shadow-glow">
              <Shield size={24} className="text-primary-foreground" />
            </div>
            <h1 className="font-heading text-2xl font-bold">BRL Admin</h1>
            <p className="text-xs text-muted-foreground font-display">Bihar Rural League Management</p>
          </div>
          <div>
            <Label htmlFor="password" className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Admin Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" required className="mt-1" />
          </div>
          <Button type="submit" className="w-full bg-gradient-accent shadow-glow font-heading uppercase tracking-wider">Enter Dashboard</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <CricketBall className="fixed top-20 right-10 w-60 h-60 text-primary opacity-[0.02] pointer-events-none" />
      <CricketBat className="fixed bottom-20 left-5 w-8 h-28 text-accent opacity-[0.03] pointer-events-none rotate-12" />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-5xl flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
              <Shield size={16} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold leading-none">BRL Admin</h1>
              <p className="text-[10px] text-muted-foreground font-display">Management Dashboard</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => { setAuthenticated(false); setPassword(""); }} className="font-display text-xs">
            Logout
          </Button>
        </div>
      </div>

      <div className="container py-6 space-y-6 max-w-5xl">
        <AnalyticsDashboard password={password} toast={toast} />
        <NewsManager password={password} toast={toast} />
        <GalleryManager password={password} toast={toast} />
        <PointsTableManager password={password} toast={toast} />
        <MatchesManager password={password} toast={toast} />
        <PerformersManager password={password} toast={toast} />
      </div>
    </div>
  );
};

// ── Section Wrapper ──
const AdminSection = ({ icon: Icon, title, subtitle, children, accentColor = "text-primary" }: {
  icon: any; title: string; subtitle: string; children: React.ReactNode; accentColor?: string;
}) => (
  <section className="relative rounded-2xl overflow-hidden border border-border shadow-card">
    <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />
    <div className="p-5 md:p-6 space-y-4 bg-gradient-card">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center border border-border/50">
          <Icon size={18} className={accentColor} />
        </div>
        <div>
          <h2 className="font-heading text-lg font-bold leading-tight">{title}</h2>
          <p className="text-[11px] text-muted-foreground font-display">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  </section>
);

// ── Analytics Dashboard ──
const CHART_COLORS = [
  "hsl(0, 85%, 30%)", "hsl(350, 70%, 25%)", "hsl(45, 100%, 42%)",
  "hsl(25, 100%, 50%)", "hsl(140, 60%, 35%)", "hsl(200, 70%, 45%)",
  "hsl(280, 60%, 45%)", "hsl(30, 80%, 55%)",
];

const AnalyticsDashboard = ({ password, toast }: { password: string; toast: any }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminApi("get-analytics", password);
        if (res.data) setLogs(res.data);
      } catch (err: any) {
        toast({ title: "Analytics Error", description: err.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [password]);

  const stats = useMemo(() => {
    if (!logs.length) return null;

    const today = new Date().toDateString();
    const todayCount = logs.filter((l) => new Date(l.created_at).toDateString() === today).length;

    // State distribution
    const stateMap: Record<string, number> = {};
    logs.forEach((l) => { stateMap[l.state || "Unknown"] = (stateMap[l.state || "Unknown"] || 0) + 1; });
    const stateData = Object.entries(stateMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }));

    // Device distribution
    const deviceMap: Record<string, number> = {};
    logs.forEach((l) => { deviceMap[l.device_type || "unknown"] = (deviceMap[l.device_type || "unknown"] || 0) + 1; });
    const deviceData = Object.entries(deviceMap).map(([name, value]) => ({ name, value }));

    // Daily visits (last 7 days)
    const dailyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dailyMap[key] = 0;
    }
    logs.forEach((l) => {
      const d = new Date(l.created_at);
      const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (key in dailyMap) dailyMap[key]++;
    });
    const dailyData = Object.entries(dailyMap).map(([name, visits]) => ({ name, visits }));

    // Country distribution
    const countryMap: Record<string, number> = {};
    logs.forEach((l) => { countryMap[l.country || "Unknown"] = (countryMap[l.country || "Unknown"] || 0) + 1; });
    const countryData = Object.entries(countryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));

    return { total: logs.length, today: todayCount, stateData, deviceData, dailyData, countryData };
  }, [logs]);

  const chartConfig = {
    visits: { label: "Visits", color: "hsl(0, 85%, 30%)" },
    value: { label: "Visitors", color: "hsl(350, 70%, 25%)" },
  };

  return (
    <AdminSection icon={BarChart3} title="Visitor Analytics" subtitle="Real-time visitor tracking & insights" accentColor="text-cricket-gold">
      {loading ? (
        <div className="text-center py-10 text-muted-foreground font-display text-sm">Loading analytics...</div>
      ) : !stats ? (
        <div className="text-center py-10 text-muted-foreground font-display text-sm">No visitor data yet. Data will appear as users visit your site.</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Visitors", value: stats.total, icon: Users, color: "text-primary" },
              { label: "Today", value: stats.today, icon: Eye, color: "text-cricket-gold" },
              { label: "States", value: stats.stateData.length, icon: MapPin, color: "text-cricket-green" },
              { label: "Countries", value: stats.countryData.length, icon: Globe, color: "text-accent" },
            ].map((s) => (
              <div key={s.label} className="bg-secondary/50 rounded-xl border border-border/50 p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-background flex items-center justify-center border border-border/50">
                  <s.icon size={16} className={s.color} />
                </div>
                <div>
                  <p className="font-heading text-xl font-bold leading-none">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground font-display mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Daily Visits Line Chart */}
            <div className="bg-secondary/30 rounded-xl border border-border/50 p-4">
              <h3 className="font-heading text-sm font-bold mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-primary" /> Daily Visits (7 Days)
              </h3>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <LineChart data={stats.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 10%, 88%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="visits" stroke="hsl(0, 85%, 30%)" strokeWidth={2} dot={{ fill: "hsl(0, 85%, 30%)", r: 3 }} />
                </LineChart>
              </ChartContainer>
            </div>

            {/* State Distribution Bar Chart */}
            <div className="bg-secondary/30 rounded-xl border border-border/50 p-4">
              <h3 className="font-heading text-sm font-bold mb-3 flex items-center gap-2">
                <MapPin size={14} className="text-cricket-green" /> Visitors by State
              </h3>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart data={stats.stateData} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="hsl(350, 70%, 25%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </div>

            {/* Device Distribution Pie */}
            <div className="bg-secondary/30 rounded-xl border border-border/50 p-4">
              <h3 className="font-heading text-sm font-bold mb-3 flex items-center gap-2">
                <Smartphone size={14} className="text-accent" /> Device Types
              </h3>
              <div className="h-[200px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={stats.deviceData} cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {stats.deviceData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Country Distribution */}
            <div className="bg-secondary/30 rounded-xl border border-border/50 p-4">
              <h3 className="font-heading text-sm font-bold mb-3 flex items-center gap-2">
                <Globe size={14} className="text-cricket-gold" /> Top Countries
              </h3>
              <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart data={stats.countryData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {stats.countryData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </>
      )}
    </AdminSection>
  );
};

// ── News Manager ──
const NewsManager = ({ password, toast }: { password: string; toast: any }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [isPinned, setIsPinned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState<any[]>([]);

  const loadNews = async () => {
    const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
    if (data) setNewsList(data);
  };

  useEffect(() => { loadNews(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setLoading(true);
    try {
      await adminApi("add-news", password, { title, content, category, is_pinned: isPinned });
      toast({ title: "News added!" });
      setTitle(""); setContent(""); setCategory("general"); setIsPinned(false);
      loadNews();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await adminApi("delete-news", password, { id });
      toast({ title: "News removed!" });
      loadNews();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <AdminSection icon={Newspaper} title="News & Notifications" subtitle="Manage scoreboard news ticker & announcements" accentColor="text-cricket-orange">
      <form onSubmit={handleAdd} className="space-y-3">
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Headline</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="News headline" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Content</Label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="News details..."
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[80px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="match">Match Update</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="result">Result</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 pb-2 cursor-pointer">
              <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="rounded" />
              <Pin size={14} className="text-primary" />
              <span className="text-sm font-display">Pin this news</span>
            </label>
          </div>
        </div>
        <Button type="submit" disabled={loading || !title || !content} className="w-full bg-gradient-accent shadow-glow font-heading uppercase tracking-wider text-sm">
          {loading ? "Publishing..." : "Publish News"}
        </Button>
      </form>

      {newsList.length > 0 && (
        <div className="space-y-2 mt-4">
          <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Newspaper size={12} /> Published News
          </h3>
          {newsList.map((n) => (
            <div key={n.id} className="flex items-start justify-between gap-3 bg-secondary/50 rounded-xl px-4 py-3 border border-border/50">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {n.is_pinned && <Pin size={10} className="text-primary shrink-0" />}
                  <span className="font-heading text-sm font-bold truncate">{n.title}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{n.content}</p>
                <span className="text-[10px] text-muted-foreground font-display">{n.category} • {new Date(n.created_at).toLocaleDateString()}</span>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(n.id)} className="shrink-0">
                <Trash2 size={14} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </AdminSection>
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
      toast({ title: "Uploaded!", description: `${files.length} image(s) uploaded.` });
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
    <AdminSection icon={Image} title="Gallery Photos" subtitle="Upload & manage tournament photos" accentColor="text-primary">
      <form onSubmit={handleUpload} className="space-y-3">
        <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-secondary/20">
          <Upload size={28} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-xs text-muted-foreground mb-2 font-display">Drop or select images to upload</p>
          <Input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} className="max-w-xs mx-auto" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={showOnHomepage} onChange={(e) => setShowOnHomepage(e.target.checked)} className="rounded" />
          <span className="text-sm font-display">Show on homepage (max 7)</span>
        </label>
        <Button type="submit" disabled={loading || !files} className="w-full bg-gradient-accent shadow-glow font-heading uppercase tracking-wider text-sm">
          {loading ? "Uploading..." : "Upload Photos"}
        </Button>
      </form>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-4">
          {images.map((img) => (
            <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border/50">
              <img src={img.image_url} alt={img.alt_text} className="w-full h-20 object-cover" />
              <button onClick={() => handleDelete(img.id, img.image_url)} className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={10} />
              </button>
              {img.show_on_homepage && (
                <span className="absolute bottom-0.5 left-0.5 bg-primary text-primary-foreground text-[7px] px-1 rounded font-display">HP</span>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminSection>
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
        team_name: team, played: parseInt(played) || 0, won: parseInt(won) || 0,
        lost: parseInt(lost) || 0, points: parseInt(points) || 0,
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
    <AdminSection icon={Trophy} title="Points Table" subtitle="Update team standings & points" accentColor="text-cricket-gold">
      <form onSubmit={handleSubmit} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="col-span-2 sm:col-span-3">
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Team</Label>
          <Select value={team} onValueChange={setTeam}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select team" /></SelectTrigger>
            <SelectContent>{TEAM_NAMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        {[
          { label: "Played", value: played, set: setPlayed },
          { label: "Won", value: won, set: setWon },
          { label: "Lost", value: lost, set: setLost },
          { label: "Points", value: points, set: setPoints },
        ].map((f) => (
          <div key={f.label}>
            <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</Label>
            <Input type="number" value={f.value} onChange={(e) => f.set(e.target.value)} placeholder="0" className="mt-1" />
          </div>
        ))}
        <div className="col-span-2 sm:col-span-3">
          <Button type="submit" disabled={loading || !team} className="w-full bg-gradient-accent shadow-glow font-heading uppercase tracking-wider text-sm">
            {loading ? "Updating..." : "Update Points"}
          </Button>
        </div>
      </form>
    </AdminSection>
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
      await adminApi("add-match", password, { team1, team2, match_date: matchDate, match_time: matchTime });
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
    <AdminSection icon={Calendar} title="Upcoming Matches" subtitle="Schedule & manage match fixtures" accentColor="text-accent">
      <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Team 1</Label>
          <Select value={team1} onValueChange={setTeam1}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select team" /></SelectTrigger>
            <SelectContent>{TEAM_NAMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Team 2</Label>
          <Select value={team2} onValueChange={setTeam2}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Select team" /></SelectTrigger>
            <SelectContent>{TEAM_NAMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Date</Label>
          <Input type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Time</Label>
          <Input type="time" value={matchTime} onChange={(e) => setMatchTime(e.target.value)} className="mt-1" />
        </div>
        <div className="col-span-2 text-[10px] text-muted-foreground font-display flex items-center gap-1">
          <MapPin size={10} /> Venue: Nagendrajha Stadium (auto)
        </div>
        <div className="col-span-2">
          <Button type="submit" disabled={loading || !team1 || !team2 || !matchDate || !matchTime} className="w-full bg-gradient-accent shadow-glow font-heading uppercase tracking-wider text-sm">
            {loading ? "Adding..." : "Add Match"}
          </Button>
        </div>
      </form>

      {matches.length > 0 && (
        <div className="space-y-2 mt-4">
          <h3 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
            <Calendar size={12} /> Scheduled Matches
          </h3>
          {matches.map((m) => (
            <div key={m.id} className="flex items-center justify-between bg-secondary/50 rounded-xl px-4 py-2.5 border border-border/50">
              <div className="text-sm font-display">
                <span className="font-semibold">{m.team1}</span>
                <span className="text-muted-foreground mx-1.5 text-xs">vs</span>
                <span className="font-semibold">{m.team2}</span>
                <span className="text-muted-foreground ml-2 text-[10px]">{m.match_date} • {m.match_time}</span>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleRemove(m.id)}>
                <Trash2 size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </AdminSection>
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
        runs: parseInt(runs) || 0, wickets: parseInt(wickets) || 0,
        matches_played: parseInt(matchesPlayed) || 0, matches_won: parseInt(matchesWon) || 0,
        photo_url: photoUrl, stat_value: statValue, stat_label: statLabel,
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
    <AdminSection icon={Star} title="Top Performers" subtitle="Manage Orange Cap, Purple Cap & MVP" accentColor="text-cricket-orange">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="orange">🟠 Orange Cap (Most Runs)</SelectItem>
              <SelectItem value="purple">🟣 Purple Cap (Most Wickets)</SelectItem>
              <SelectItem value="mvp">⭐ Most Valuable Player</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Player name" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Team</Label>
            <Select value={team} onValueChange={setTeam}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select team" /></SelectTrigger>
              <SelectContent>{TEAM_NAMES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Runs</Label>
            <Input type="number" value={runs} onChange={(e) => setRuns(e.target.value)} placeholder="0" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Wickets</Label>
            <Input type="number" value={wickets} onChange={(e) => setWickets(e.target.value)} placeholder="0" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Match Played</Label>
            <Input type="number" value={matchesPlayed} onChange={(e) => setMatchesPlayed(e.target.value)} placeholder="0" className="mt-1" />
          </div>
          <div>
            <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Match Won</Label>
            <Input type="number" value={matchesWon} onChange={(e) => setMatchesWon(e.target.value)} placeholder="0" className="mt-1" />
          </div>
        </div>
        <div>
          <Label className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Player Photo</Label>
          <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="mt-1" />
        </div>
        <Button type="submit" disabled={loading || !name || !team} className="w-full bg-gradient-accent shadow-glow font-heading uppercase tracking-wider text-sm">
          {loading ? "Updating..." : "Update Performer"}
        </Button>
      </form>
    </AdminSection>
  );
};

export default AdminPanel;
