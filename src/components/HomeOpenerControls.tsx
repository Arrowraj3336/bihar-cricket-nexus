import { useEffect, useRef, useState } from "react";
import { DefaultChatTransport, readUIMessageStream } from "ai";
import { RotateCcw, Sparkles, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import cricketBall from "@/assets/home-opener/cricket-ball.png";

const HomeOpenerControls = ({ onReplay }: { onReplay: () => void }) => {
  const [open, setOpen] = useState(false);
  const [team, setTeam] = useState("");
  const [mood, setMood] = useState("Cinematic");
  const [preferences, setPreferences] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const controller = useRef<AbortController>();
  useEffect(() => () => controller.current?.abort(), []);

  async function suggest(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    const abort = new AbortController();
    controller.current = abort;
    setBusy(true);
    setError("");
    setOutput("");
    try {
      const transport = new DefaultChatTransport({
        api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/opener-suggestions`,
        headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
        prepareSendMessagesRequest: () => ({ body: { team, mood, preferences } }),
        fetch: async (url, options) => {
          const response = await fetch(url, options);
          if (!response.ok) {
            const detail = await response.json().catch(() => null);
            throw new Error(detail?.error || "AI suggestions are temporarily unavailable.");
          }
          return response;
        },
      });
      const stream = await transport.sendMessages({
        trigger: "submit-message", chatId: "opener-suggestions", messageId: undefined, messages: [], abortSignal: abort.signal,
      });
      let finalText = "";
      for await (const message of readUIMessageStream({ stream, terminateOnError: true })) {
        finalText = message.parts.filter((part) => part.type === "text").map((part) => part.text).join("");
        setOutput(finalText);
      }
      if (!finalText.trim()) throw new Error("No suggestions were returned for this request.");
    } catch (failure) {
      if (!abort.signal.aborted) setError(failure instanceof Error ? failure.message : "AI suggestions are unavailable.");
    } finally {
      setBusy(false);
      controller.current = undefined;
    }
  }

  return (
    <>
      <div className="fixed bottom-5 left-4 z-40 flex gap-2">
        <Button variant="outline" size="sm" onClick={onReplay} title="Replay homepage animation" aria-label="Replay homepage animation">
          <RotateCcw /> Replay intro
        </Button>
        <Button size="icon" className="h-9 w-9" onClick={() => setOpen(true)} title="AI opener ideas" aria-label="AI opener ideas"><Sparkles /></Button>
      </div>
      <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) controller.current?.abort(); }}>
        <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-lg">
          <DialogHeader>
            <img src={cricketBall} alt="Red leather cricket ball" className="mb-2 h-20 w-20 self-center object-contain sm:self-start" />
            <DialogTitle className="tracking-normal">Your cricket opener</DialogTitle>
            <DialogDescription>Personalized concepts · AI-powered</DialogDescription>
          </DialogHeader>
          <form onSubmit={suggest} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="opener-team">Favourite team <span className="text-muted-foreground">(optional)</span></Label><Input id="opener-team" maxLength={80} value={team} onChange={(e) => setTeam(e.target.value)} placeholder="Your team" disabled={busy} /></div>
            <div className="space-y-2"><Label htmlFor="opener-mood">Match-day mood</Label><Select value={mood} onValueChange={setMood} disabled={busy}><SelectTrigger id="opener-mood"><SelectValue /></SelectTrigger><SelectContent>{["Cinematic", "Match-day energy", "Minimal"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="opener-preferences">Personal touches <span className="text-muted-foreground">(optional)</span></Label><Textarea id="opener-preferences" maxLength={400} value={preferences} onChange={(e) => setPreferences(e.target.value)} placeholder="A seam close-up, a softer fog reveal…" disabled={busy} /></div>
            <div className="flex flex-wrap gap-2">
              {busy ? <Button type="button" onClick={() => controller.current?.abort()}><Square /> Stop</Button> : <Button type="submit"><Sparkles /> Suggest variations</Button>}
              <Button type="button" variant="outline" onClick={() => { setOpen(false); controller.current?.abort(); onReplay(); }}><RotateCcw /> Replay original</Button>
            </div>
          </form>
          {busy && !output && <p role="status" className="text-sm text-muted-foreground">Creating your cricket concepts…</p>}
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          {output && <div aria-live="polite" className="border-t pt-4"><h3 className="mb-3 text-base">Opener concepts</h3><p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{output}</p><p className="mt-3 text-xs text-muted-foreground">Creative suggestions only. The original animation stays unchanged.</p></div>}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HomeOpenerControls;