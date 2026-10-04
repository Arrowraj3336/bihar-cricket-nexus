# Project Architecture Rules

- Keep the homepage opening animation mounted inside the homepage only, never globally, because it must not appear on public subpages or the admin panel.
- Keep retired hosting-expiry source preserved but outside the active router, because the public DBRL site is active again.