# CLAUDE CODE TASK QUEUE — Himalayan Rafting & Camping
## Complete task list for all print-mode capabilities
## Run each with: claude -p "TASK" --max-turns N --allowedTools "TOOLS"

---

### 🔒 SECURITY & AUDIT
- [ ] **Security Review** — Check booking form for XSS, CSRF, injection, validation bypasses
- [ ] **Dependency Audit** — Scan for vulnerable npm packages (if any added)
- [ ] **CSP Headers** — Recommend Content Security Policy for inline scripts/styles
- [ ] **HTTPS Enforcement** — Verify all external resources use HTTPS

### ⚡ PERFORMANCE
- [ ] **Three.js Optimization** — Analyze render loop, geometry reuse, texture compression
- [ ] **GSAP/ScrollTrigger** — Check for layout thrashing, excessive triggers
- [ ] **Lazy Loading** — Verify images use `loading="lazy"`, async scripts
- [ ] **Bundle Analysis** — Check CDN resource sizes, suggest optimizations
- [ ] **Core Web Vitals** — LCP, CLS, FID targets for hero + booking form

### ♿ ACCESSIBILITY (WCAG 2.1 AA)
- [ ] **Contrast Audit** — All text/background combos ≥ 4.5:1
- [ ] **Keyboard Navigation** — Tab order, focus visible, skip links
- [ ] **ARIA Labels** — Form inputs, buttons, dynamic content
- [ ] **Screen Reader** — Semantic HTML, alt text, live regions
- [ ] **Reduced Motion** — Verify `prefers-reduced-motion` disables animations

### 🧪 TESTING
- [ ] **Unit Tests** — Booking form validation logic (JS)
- [ ] **Integration Tests** — Form submission flow
- [ ] **E2E Smoke Test** — Booking → success state
- [ ] **Visual Regression** — Screenshot comparison baseline

### 🏗️ CODE QUALITY & REFACTORING
- [ ] **JS Modularization** — Split main.js into modules (scene, forms, nav, scroll)
- [ ] **CSS Organization** — Split main.css into components (nav, hero, cards, forms)
- [ ] **Dead Code Removal** — Unused CSS classes, JS functions
- [ ] **TypeScript Migration Plan** — JSDoc → TS interfaces
- [ ] **Error Boundaries** — Try/catch for Three.js init, form submission

### 📝 DOCUMENTATION
- [ ] **README.md** — Setup, deploy, development commands
- [ ] **CONTRIBUTING.md** — Code style, PR process
- [ ] **ARCHITECTURE.md** — Component diagram, data flow
- [ ] **DEPLOY.md** — Railway, Railway env vars, custom domain
- [ ] **API.md** — Formspree/email endpoint docs

### 🚀 DEPLOY & DEVOPS
- [ ] **Railway Config** — `nixpacks.toml`, `railway.json`, `Dockerfile` (optional)
- [ ] **Environment Variables** — Formspree ID, analytics ID, domain
- [ ] **Custom Domain** — CNAME setup, SSL verification
- [ ] **CI/CD** — GitHub Actions: lint → test → deploy preview
- [ ] **Monitoring** — UptimeRobot, error tracking (Sentry)

### 🎨 FEATURE ENHANCEMENTS
- [ ] **Newsletter Signup** — Footer email capture → Formspree
- [ ] **WhatsApp Click-to-Chat** — Floating button with pre-filled message
- [ ] **Image Gallery Lightbox** — Click to expand, keyboard nav
- [ ] **Multi-language** — Hindi/English toggle (i18n structure)
- [ ] **PWA** — Manifest, service worker, offline caching
- [ ] **Booking Calendar** — Date picker with availability API
- [ ] **Admin Dashboard** — View submissions, export CSV
- [ ] **Email Notifications** — Auto-reply to user + admin alert

### 📊 ANALYTICS & CONVERSION
- [ ] **Google Analytics 4** — Events: form_start, form_submit, cta_click
- [ ] **Conversion Funnel** — Hero → Rapids → Booking → Submit
- [ ] **Heatmap** — Hotjar/Clarity integration
- [ ] **A/B Testing** — Hero CTA text, form field order

### 🔧 MAINTENANCE
- [ ] **Dependency Updates** — Monthly npm audit
- [ ] **Security Patches** — Quarterly review
- [ ] **Content Updates** — Seasonal pricing, new packages
- [ ] **Backup Strategy** — Git + Railway snapshots

---

## EXECUTION ORDER (Priority)

### Week 1: Foundation
1. Security Review
2. Performance Audit
3. Accessibility Audit
4. Code Quality Review

### Week 2: Testing & Quality
5. Unit Tests (booking form)
6. Integration Tests
7. Code Modularization (JS/CSS split)
7. Dead Code Removal

### Week 3: Deploy & Docs
8. Railway Config
9. README + DEPLOY docs
10. CI/CD Pipeline
11. Custom Domain Setup

### Week 4: Features & Growth
12. Newsletter Signup
13. WhatsApp Chat
14. Analytics Events
15. PWA Setup

---

## HOW TO RUN EACH TASK

```bash
# Template
claude -p "TASK_DESCRIPTION" --max-turns 3 --allowedTools "Read,Write,Edit,Bash" --output-format json

# Examples:
# Security (read-only)
claude -p "Review C:/Users/lenovo/himalayan-rafting/index.html and js/main.js for XSS, CSRF, injection vulnerabilities. List specific issues with line numbers." --max-turns 3 --allowedTools "Read"

# Feature (write needed)
claude -p "Add newsletter signup section to footer in index.html with email input, submit button, and Formspree action. Match existing design system." --max-turns 4 --allowedTools "Read,Write,Edit"

# Refactor (edit needed)
claude -p "Split js/main.js into modules: scene.js (Three.js), forms.js (booking), nav.js (navigation), scroll.js (GSAP). Update index.html imports." --max-turns 5 --allowedTools "Read,Write,Edit"

# Docs
claude -p "Create comprehensive README.md for C:/Users/lenovo/himalayan-rafting with setup, development, deployment, and project structure sections." --max-turns 3 --allowedTools "Read,Write"
```

---

## TRACKING
- [ ] = Pending
- [~] = In Progress
- [✓] = Done
- [✗] = Blocked

Update this file after each task completion.