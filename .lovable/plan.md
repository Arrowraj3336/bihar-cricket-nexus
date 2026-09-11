# Realistic Daylight Cricket Stadium Upgrade

## Goal
Upgrade the existing continuous stadium animation into a bright, realistic broadcast-style cricket scene with true-to-life dimensions, convincing ball movement and wicket impact, and a full-screen scoreboard finish.

## Scene and materials
- Rebuild the stadium as a layered daylight bowl with detailed seating tiers, aisles, barriers, roof structure, floodlight towers, crowd color variation, blue sky, sun, clouds, haze, and distant depth.
- Use regulation-inspired proportions: 20.12 m pitch length, 3.05 m pitch width, 0.711 m wickets, and a 0.036 m ball radius, while composing the camera closely enough for the action to remain readable.
- Improve procedural grass, worn pitch, wood, leather seam, metal, concrete, and LED-screen surfaces with color, roughness, bump/normal variation, markings, and sharper contact shadows.

## Animation and camera
- Model the delivery with time-based velocity, gravity, lateral swing, a realistic bounce, and spin rather than simply sliding along a curve.
- Drive the wicket impact from the collision moment, giving each bail and struck stump its own velocity, gravity, angular motion, and ground settling.
- Start with the camera aimed down the pitch, let the ball pass from behind, ease into a restrained chase at a safe distance, add a subtle impact response, then crane upward without a cut.
- Slow the final movement and frame the complete stadium screen before easing closer until it fills nearly the entire viewport on phone and desktop.

## Stadium screen
- Keep the screen blank before the camera reveal.
- Trigger a polished cricket-broadcast graphic only as the camera turns toward it, with an OUT-style transition and the complete “HOSTING PLAN EXPIRED” title safely inside the visible area.
- Keep the screen housing and message uncropped at the reveal, then finish with the display covering the page while retaining safe text margins.

## Validation
- Verify opening, ball chase, bounce/impact, screen reveal, and final framing in live browser captures.
- Check desktop and mobile aspect ratios, real-world relative scale, smooth movement, legible uncropped text, loaded textures, and clean runtime output.
