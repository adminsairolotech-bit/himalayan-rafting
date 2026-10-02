# COMMIT-SHEET — Himalayan Rafting & Camping

> Seven decisions before the first line of code. A generic answer ("modern, clean") means the decision hasn't been made — stop and make it.

## 1. Peak / Signature
**The ONE wow moment:** Hero = a WebGL river canyon you *fly through* as you scroll. The camera follows a raft's path — water displacement, canyon walls parallax, mist particles reacting to scroll velocity. At the bottom, the raft "lands" at the booking form. One continuous 500vh pinned canvas sequence, no cuts.

## 2. Color
**Primary:** `oklch(0.42 0.16 195)` — glacial teal pulled from Ganges headwater photography.  
**Tier:** committed (~45% of surface).  
**Why not the reflex:** Adventure travel defaults to either "sunset orange gradient" or "dark navy + neon cyan." Teal at this chroma sits in the river itself — it's the water color at 11am in October.  
**Background lightness target:** mean L ≈ 0.92 (warm off-white, `oklch(0.93 0.008 45)`). Not dark — the canyon *is* the dark element; the page breathes like a sunlit valley.

## 3. Type
**Display:** **Fraunces Variable** (soft wide serif, optical sizes) — carries the Himalayan expedition heritage, humanist warmth.  
**Text:** **DM Sans** (geometric humanist, excellent at small sizes on light backgrounds).  
**Axis:** high-contrast variable serif × neutral geometric sans.  
**Why not Inter:** Inter is the 2024–26 AI default. DM Sans has tighter apertures and a slight square curve that echoes river stones — legible at 14px on teal, not generic.

## 4. Grid break
**The one asymmetric move:** The "Rapids & Routes" section (S3) uses a **diagonal flow** — cards tilted −12° along a shared river-path SVG that cuts across the viewport from top-left to bottom-right. Text wraps the path via `shape-outside`. The grid doesn't just stagger; it *flows*.

## 5. Motion budget
**Three scroll-pattern families, max:**
1. **Hero canvas flight** — scroll-scrubbed camera path through 3D canyon (primary peak).
2. **Per-word heading reveals** — Fraunces display headings animate word-by-word on scroll enter (stagger 40ms, ease-out).
3. **Depth parallax layers** — canyon walls, mist, distant peaks at different Z depths in hero + campground gallery (S5).

*Nothing else scroll-triggered.* Buttons, cards, modals use standard 120–180ms transform/opacity.

## 6. Reflex check
**a) Generic adventure-travel AI:** Full-bleed hero video + "Book Now" CTA + 3-column feature grid + testimonial carousel + footer map. Colors: burnt orange / deep navy / cream. Font: Inter or Poppins.  
**b) Generic AI avoiding (a):** Brutalist dark mode, monospace everything, terminal-style booking form, neon accent lines.  
**c) Our deviation:** Daylit glacial teal + Fraunces warmth + a *single* 3D hero that *is* the product (the river), not a background for copy. Booking is the natural landing point of the flight, not a sticky button. Camping feels like a campsite — tents, firelight, starfield — not a card grid.

## 7. House tells broken
**1. Near-black background →** Warm off-white (L 0.93) — the canyon walls provide the darkness; the page stays sunlit.  
**2. Mono service labels in corners →** Zero chrome labels. The only UI type on the hero is the river-name ribbon ("Ganga • Shivpuri • Brahmapuri") set in Fraunces Display, tracking +0.08em, baked into the WebGL scene. No corner badges, no "PREMIUM" tags.