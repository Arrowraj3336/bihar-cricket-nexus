import { beforeEach, describe, expect, it, vi } from "vitest";

describe("homepage opener visit protection", () => {
  beforeEach(() => { sessionStorage.clear(); vi.resetModules(); });
  it("ignores the old permanent session flag", async () => {
    sessionStorage.setItem("dbrl-ball-opener-seen", "1");
    const opener = await import("@/lib/home-opener");
    expect(opener.hasPlayedHomeOpener()).toBe(false);
  });
  it("suppresses automatic replay within this document", async () => {
    const opener = await import("@/lib/home-opener");
    opener.markHomeOpenerPlayed();
    expect(opener.hasPlayedHomeOpener()).toBe(true);
  });
  it("allows a fresh document opening", async () => {
    sessionStorage.setItem("dbrl-ball-opener-document", "old-document");
    const opener = await import("@/lib/home-opener");
    expect(opener.hasPlayedHomeOpener()).toBe(false);
  });
});