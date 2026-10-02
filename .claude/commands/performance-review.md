# Performance Review

Analyze and optimize performance for the Himalayan Rafting project.

## Checklist

1. **Three.js Render Loop**
   - Geometry reuse (not recreated per frame)
   - Texture compression (KTX2/Basis)
   - Level of detail (LOD) for distant objects
   - Frustum culling enabled

2. **GSAP + ScrollTrigger**
   - Minimize layout thrashing
   - Use `will-change` sparingly
   - Batch DOM reads/writes
   - `scrub` vs `scrub: true` performance

3. **Core Web Vitals**
   - LCP < 2.5s (hero image/hero canvas)
   - CLS < 0.1 (stable layout)
   - FID < 100ms (interactive elements)
   - INP < 200ms (all interactions)

3. **Resource Optimization**
   - CDN caching headers
   - Font subsetting (Fraunces + DM Sans)
   - Image lazy loading + WebP/AVIF
   - Font `font-display: swap`

4. **JavaScript**
   - Code splitting (dynamic imports)
   - Tree shaking unused code
   - Debounce scroll handlers
   - Web Workers for heavy computation

5. **Network**
   - HTTP/2 push for critical resources
   - Preconnect to fonts.googleapis.com
   - Service worker for offline

## Run Command
```
/performance-review
```