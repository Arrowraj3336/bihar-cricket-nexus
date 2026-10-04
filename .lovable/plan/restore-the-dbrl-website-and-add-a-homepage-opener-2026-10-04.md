# Restore the DBRL website and add a homepage opener

## What will change
- Restore the original DBRL homepage at `/` with its teams, matches, performers, notice board, gallery, organisers, and footer.
- Restore the existing public pages for team details, members, contact, gallery, and the season calendar; keep the admin panel at `/brl-admin-panel`.
- Remove the expired-hosting experience from the public flow without deleting the preserved source.
- Add a new three-second opening animation shown only when the homepage opens. It will use DBRL branding and a premium Indian cricket-broadcast feel: stadium-light sweeps, energetic crimson/gold motion, cricket-ball seam details, logo reveal, and a polished handoff into the homepage.
- Keep the animation responsive and respect reduced-motion preferences.
- Update page title and social description from the expired-hosting message back to DBRL.

## Technical details
- Add a focused homepage loader component with a fixed three-second lifecycle and exit transition.
- Mount it only in the homepage, not globally, so other pages and the admin panel never show it.
- Re-enable all preserved routes in the router and retain the existing scroll-to-top behavior.
- Validate the homepage handoff and key public routes on mobile and desktop.
