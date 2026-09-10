# Cinematic Cricket Stadium Homepage

## Goal
Replace the current flat cricket-ball page with a full-screen, uninterrupted 3D stadium sequence that ends on a stadium display reading only **Hosting Plan Expired**.

## Experience
- Open inside a realistic cricket stadium with a full pitch, grass field, floodlights, seating, and stumps at both ends.
- Launch a textured cricket ball from behind the camera and follow it smoothly down the pitch at a cinematic distance.
- Strike the far wicket in a convincing run-out moment, with bails separating and a short impact response.
- Continue the same camera movement upward after impact and settle on the stadium’s large display.
- Show only **Hosting Plan Expired** on that display—no description, contact button, menu, or overlay.
- Replay the complete sequence seamlessly so later visitors and returning viewers see the intended animation.

## Visual Direction
- Broadcast-style realism rather than the current decorative flat effect.
- Physically lit materials, visible texture variation, contact shadows, stadium floodlights, and atmospheric depth.
- Smooth easing throughout; no cuts between the ball chase, wicket impact, and display reveal.
- Responsive framing for phone, tablet, and desktop while keeping the ball, wicket, and final title readable.

## Technical Details
- Use React Three Fiber and Three.js versions compatible with the existing React 18 app.
- Use local, license-safe realistic textures/assets where available; procedurally build only scene geometry that does not require a sourced model.
- Implement the sequence as a time-based state machine using frame-independent motion.
- Build the ball, detachable bails, pitch, stadium bowl, screen, lighting, shadows, and camera rail as focused components.
- Respect reduced-motion settings with a stable final stadium-screen view.
- Keep the admin page and hidden existing pages unchanged.

## Validation
- Verify the scene visibly renders instead of showing a blank/flat frame.
- Capture early chase, wicket impact, and final display states.
- Test desktop and mobile framing, animation continuity, asset loading, and browser console errors.
