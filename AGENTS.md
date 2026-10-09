# Project Architecture Rules

- Keep the homepage opening animation mounted inside the homepage only, never globally, because it must not appear on public subpages or the admin panel.
- Scope automatic opener replay protection to the current document within the session and allow explicit replay, because fresh homepage openings must animate while internal return navigation must not; decode photographic assets before starting its clock.
- Keep opener suggestion prompts and model calls in a streaming Cloud function, because visitor preferences must never expose AI credentials in the browser.
- Keep retired hosting-expiry source preserved but outside the active router, because the public DBRL site is active again.
- Run opener movement, impact fog, and reveal on one compositor animation clock with an opaque curtain until fog coverage, because independent fade timers can flash the homepage and oversized layered images cause stutter.