# Project Architecture Rules

- Keep the homepage opening animation mounted inside the homepage only, never globally, because it must not appear on public subpages or the admin panel.
- Use session-scoped replay protection and preload the opener's photographic assets before its animation clock starts, because return navigation must not replay it and slow image delivery must not break the sequence.
- Keep retired hosting-expiry source preserved but outside the active router, because the public DBRL site is active again.