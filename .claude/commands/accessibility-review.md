# Accessibility Review (WCAG 2.1 AA)

Comprehensive accessibility audit for the Himalayan Rafting project.

## Checklist

### 1. Perceivable
- [ ] **Text Contrast** — All text ≥ 4.5:1 (large text ≥ 3:1)
- [ ] **Non-text Contrast** — UI components, graphics ≥ 3:1
- [ ] **Text Resize** — 200% zoom without loss of content/function
- [ ] **Images of Text** — Avoid; use actual text
- [ ] **Alt Text** — All images have meaningful alt
- [ ] **Media Alternatives** — Captions for video, transcripts for audio

### 2. Operable
- [ ] **Keyboard Navigation** — All functionality via keyboard
- [ ] **Focus Visible** — Clear focus indicators on all interactive elements
- [ ] **Focus Order** — Logical tab sequence
- [ ] **Skip Links** — "Skip to main content" link
- [ ] **No Keyboard Traps** — Modal dialogs trap focus properly
- [ ] **Timing** — No time limits or extendable
- [ ] **Motion** — `prefers-reduced-motion` respected
- [ ] **Pointer** — Touch targets ≥ 44x44 CSS pixels

### 3. Understandable
- [ ] **Language** — `lang="en"` on html, changes marked
- [ ] **Consistent Navigation** — Same order across pages
- [ ] **Consistent Identification** — Same labels for same functions
- [ ] **Error Identification** — Clear error messages
- [ ] **Error Suggestion** — Helpful correction hints
- [ ] **Error Prevention** — Confirm/review for important actions

### 4. Robust
- [ ] **Valid HTML** — No parsing errors
- [ ] **ARIA** — Proper roles, states, properties
- [ ] **Status Messages** — Live regions for dynamic updates
- [ ] **Form Labels** — Explicit `<label for="">` or `aria-label`

### Project-Specific
- [ ] Hero canvas — `aria-hidden="true"`, text overlay accessible
- [ ] Booking form — Labels, errors, ARIA live for errors
- [ ] Gallery — Keyboard navigation, focus management
- [ ] Mobile menu — ARIA expanded, focus trap
- [ ] Reduced motion — All animations disabled

## Run Command
```
/accessibility-review
```