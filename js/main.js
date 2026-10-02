/* ====================================================
   HIMALAYAN RAFTING & CAMPING — main.js
   Three.js canyon · GSAP + ScrollTrigger · Lenis
   ==================================================== */

import * as THREE from 'three';

// ────────────────────────────────────────────────────
// CONFIG
// ────────────────────────────────────────────────────
const CONFIG = {
  canyon: {
    segments: 120,
    width: 60,
    height: 45,
    depth: 200,
    curveAmplitude: 12,
    rockColor: 0x2a4a5a,
    mistColor: 0x8ec8d8,
    waterColor: 0x1a6b8a,
    fogDensity: 0.012,
  },
  particles: {
    count: 600,
    spread: 100,
  },
  scroll: {
    heroPx: 500 * window.innerHeight,
  },
};

// ────────────────────────────────────────────────────
// STATE
// ────────────────────────────────────────────────────
const state = {
  scrollProgress: 0,
  scrollVelocity: 0,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  lenis: null,
};

// ────────────────────────────────────────────────────
// THREE.JS — HERO CANYON SCENE
// ────────────────────────────────────────────────────
class CanyonScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.clock = new THREE.Clock();
    this.mouse = { x: 0, y: 0 };
    this.targetScroll = 0;

    this.init();
    this.buildCanyon();
    this.buildWater();
    this.buildMist();
    this.buildParticles();
    this.buildSky();

    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => this.onMouse(e));

    this.animate();
  }

  init() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(
      new THREE.Color(CONFIG.canyon.mistColor),
      CONFIG.canyon.fogDensity
    );

    // Camera
    this.camera = new THREE.PerspectiveCamera(65, w / h, 0.5, 500);
    this.camera.position.set(0, 8, 60);
    this.camera.lookAt(0, 5, 0);
  }

  buildCanyon() {
    const { segments, width, height, depth, curveAmplitude } = CONFIG.canyon;

    // Canyon wall vertices — parametric river-carved canyon
    const wallGeometry = new THREE.BufferGeometry();
    const vertices = [];
    const uvs = [];
    const indices = [];

    const cols = segments;
    const rows = 20;

    for (let j = 0; j <= rows; j++) {
      const v = j / rows;
      for (let i = 0; i <= cols; i++) {
        const u = i / cols;

        // Path center curves
        const cx = Math.sin(u * Math.PI * 2.5) * curveAmplitude * 0.6;
        const cy = 12 + Math.sin(u * Math.PI * 3) * 4;
        const cz = -u * depth;

        // Canyon shape: narrow riverbed at bottom, wide canyon above
        const canyonWidth = width * (0.35 + v * 0.65);
        const canyonHeight = height * (v * v); // quadratic — narrow at river level
        const wallRoughness =
          Math.sin(i * 0.7) * Math.cos(j * 0.5) * 1.5 +
          Math.sin(i * 2.3) * Math.cos(j * 1.1) * 0.8;

        const x = cx + (u - 0.5) * canyonWidth + wallRoughness;
        const y = cy - canyonHeight + wallRoughness * 0.6;
        const z = cz;

        vertices.push(x, y, z);
        uvs.push(u, v);
      }
    }

    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const a = j * (cols + 1) + i;
        const b = a + cols + 1;
        indices.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }

    wallGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    wallGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    wallGeometry.setIndex(indices);
    wallGeometry.computeVertexNormals();

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: CONFIG.canyon.rockColor,
      roughness: 0.92,
      metalness: 0.05,
      flatShading: true,
      side: THREE.DoubleSide,
    });

    this.walls = new THREE.Mesh(wallGeometry, wallMaterial);
    this.scene.add(this.walls);
  }

  buildWater() {
    const waterGeo = new THREE.PlaneGeometry(8, CONFIG.canyon.depth * 1.1, 30, 200);
    const waterMat = new THREE.MeshStandardMaterial({
      color: CONFIG.canyon.waterColor,
      roughness: 0.2,
      metalness: 0.6,
      transparent: true,
      opacity: 0.75,
    });

    this.water = new THREE.Mesh(waterGeo, waterMat);
    this.water.rotation.x = -Math.PI / 2;
    this.water.position.y = 3;
    this.scene.add(this.water);
  }

  buildMist() {
    // Volumetric-style mist planes along the canyon
    this.mistGroup = new THREE.Group();

    for (let i = 0; i < 12; i++) {
      const mistGeo = new THREE.PlaneGeometry(50, 20, 1, 1);
      const mistMat = new THREE.MeshBasicMaterial({
        color: CONFIG.canyon.mistColor,
        transparent: true,
        opacity: 0.06,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mist = new THREE.Mesh(mistGeo, mistMat);
      mist.position.set(
        (Math.random() - 0.5) * 30,
        5 + Math.random() * 15,
        -i * (CONFIG.canyon.depth / 12)
      );
      this.mistGroup.add(mist);
    }

    this.scene.add(this.mistGroup);
  }

  buildParticles() {
    const { count, spread } = CONFIG.particles;
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = Math.random() * 25 + 1;
      positions[i * 3 + 2] = -Math.random() * CONFIG.canyon.depth;
      velocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: Math.random() * 0.015 + 0.005,
        z: (Math.random() - 0.5) * 0.01,
      });
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.25,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
      depthWrite: false,
    });

    this.particles = new THREE.Points(particleGeo, particleMat);
    this.particleVelocities = velocities;
    this.scene.add(this.particles);
  }

  buildSky() {
    // Gradient sky via large sphere
    const skyGeo = new THREE.SphereGeometry(200, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        uTopColor: { value: new THREE.Color(0x1a5a7a) },
        uBottomColor: { value: new THREE.Color(0x8ec8d8) },
        uOffset: { value: 20 },
        uExponent: { value: 0.6 },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPos;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uTopColor;
        uniform vec3 uBottomColor;
        uniform float uOffset;
        uniform float uExponent;
        varying vec3 vWorldPos;
        void main() {
          float h = normalize(vWorldPos).y;
          float t = max(0.0, h + uOffset);
          t = pow(t, uExponent);
          gl_FragColor = vec4(mix(uBottomColor, uTopColor, t), 1.0);
        }
      `,
      side: THREE.BackSide,
    });

    this.sky = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(this.sky);
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  onMouse(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  setProgress(p) {
    this.targetScroll = p;
  }

  animate() {
    if (state.reducedMotion) {
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(() => this.animate());
      return;
    }

    const dt = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();

    // Smooth scroll progress
    state.scrollProgress += (this.targetScroll - state.scrollProgress) * 0.05;
    const sp = state.scrollProgress;

    // Scroll velocity
    const vel = Math.abs(this.targetScroll - state.scrollProgress);
    state.scrollVelocity += (vel - state.scrollVelocity) * 0.1;

    // ── Camera path: fly through the canyon ──
    const pathT = sp;
    const cx = Math.sin(pathT * Math.PI * 2.5) * CONFIG.canyon.curveAmplitude * 0.6;
    const cy = 12 + Math.sin(pathT * Math.PI * 3) * 4;
    const cz = 55 - pathT * CONFIG.canyon.depth * 1.05;

    this.camera.position.x += (cx - this.camera.position.x) * 0.03;
    this.camera.position.y += (cy + 6 - this.camera.position.y) * 0.03;
    this.camera.position.z += (cz - this.camera.position.z) * 0.03;

    // Mouse sway
    this.camera.position.x += this.mouse.x * 1.5;
    this.camera.position.y += this.mouse.y * 0.8;
    this.camera.lookAt(cx, cy + 2, cz - 30);

    // ── Water animation ──
    const waterPositions = this.water.geometry.attributes.position.array;
    for (let i = 0; i < waterPositions.length; i += 3) {
      const x = waterPositions[i];
      const z = waterPositions[i + 2];
      waterPositions[i + 1] =
        Math.sin(x * 0.5 + elapsed * 2) * 0.15 +
        Math.cos(z * 0.3 + elapsed * 1.5) * 0.1 +
        state.scrollVelocity * 3;
    }
    this.water.geometry.attributes.position.needsUpdate = true;

    // ── Mist drift ──
    this.mistGroup.children.forEach((mist, idx) => {
      mist.position.x += Math.sin(elapsed * 0.3 + idx) * 0.005;
      mist.position.y += Math.cos(elapsed * 0.2 + idx) * 0.003;
      mist.material.opacity = 0.04 + state.scrollVelocity * 2;
    });

    // ── Particle update ──
    const pos = this.particles.geometry.attributes.position.array;
    for (let i = 0; i < CONFIG.particles.count; i++) {
      const v = this.particleVelocities[i];
      pos[i * 3] += v.x + Math.sin(elapsed + i) * 0.005;
      pos[i * 3 + 1] += v.y;
      pos[i * 3 + 2] += v.z;

      // Recycle particles
      if (pos[i * 3 + 1] > 25) pos[i * 3 + 1] = 1;
      if (pos[i * 3 + 2] > this.camera.position.z + 20) {
        pos[i * 3 + 2] = this.camera.position.z - CONFIG.canyon.depth;
      }
    }
    this.particles.geometry.attributes.position.needsUpdate = true;
    this.particles.material.opacity = 0.2 + state.scrollVelocity * 8;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }
}

// ────────────────────────────────────────────────────
// HERO OVERLAY — Fade out on scroll
// ────────────────────────────────────────────────────
function initHeroOverlay(scene) {
  const overlay = document.querySelector('.hero__overlay');
  if (!overlay) return;

  gsap.to(overlay, {
    opacity: 0,
    scale: 0.95,
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '40% top',
      scrub: 1.2,
    },
  });
}

// ────────────────────────────────────────────────────
// SCROLL ANIMATIONS
// ────────────────────────────────────────────────────
function initScrollAnimations() {
  if (state.reducedMotion) {
    // Just reveal everything immediately
    document.querySelectorAll('[data-reveal], .reveal-words').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  // ── Per-word reveals ──
  document.querySelectorAll('.reveal-words').forEach((el) => {
    const text = el.textContent;
    el.textContent = '';

    const words = text.split(/(\s+)/);
    words.forEach((word) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      el.appendChild(span);
    });

    const wordSpans = el.querySelectorAll('.word');

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        wordSpans.forEach((span, i) => {
          setTimeout(() => {
            span.classList.add('is-visible');
          }, i * 40);
        });
      },
    });
  });

  // ── Generic reveal ──
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => el.classList.add('is-visible'),
    });
  });

  // ── Parallax depth layers ──
  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const amount = parseFloat(el.dataset.parallax) || 0.05;
    gsap.to(el, {
      yPercent: -amount * 100 * 2,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });

  // ── Stats counter ──
  document.querySelectorAll('.stat__number').forEach((stat) => {
    const text = stat.textContent.trim();
    const match = text.match(/^(\d+[\d.]*)/);
    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = text.replace(match[1], '');
    const isFloat = text.includes('.');

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            stat.textContent = (isFloat ? obj.val.toFixed(1) : Math.round(obj.val)) + suffix;
          },
        });
      },
    });
  });
}

// ────────────────────────────────────────────────────
// BOOKING FORM
// ────────────────────────────────────────────────────
function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  const tabs = form.querySelectorAll('.form-tab');
  const panels = form.querySelectorAll('.form-panel');

  // Tab switching
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => {
        t.classList.remove('form-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('form-tab--active');
      tab.setAttribute('aria-selected', 'true');

      panels.forEach((p) => {
        p.classList.toggle('form-panel--active', p.id === `panel-${target}`);
        if (p.id !== `panel-${target}`) p.hidden = true;
        else p.hidden = false;
      });
    });
  });

  // Validation & submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const data = {
      fullName: form.querySelector('#full-name')?.value.trim(),
      email: form.querySelector('#email')?.value.trim(),
      phone: form.querySelector('#phone')?.value.trim(),
      date: form.querySelector('#date')?.value,
      groupSize: form.querySelector('#group-size')?.value,
      raftingRoute: form.querySelector('#rafting-route')?.value,
      raftingExperience: form.querySelector('#rafting-experience')?.value,
      campingType: form.querySelector('#camping-type')?.value,
      safariType: form.querySelector('#safari-type')?.value,
      message: form.querySelector('#message')?.value.trim(),
    };

    let valid = true;

    if (!data.fullName) {
      showError('full-name', 'error-name', 'Please enter your name');
      valid = false;
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showError('email', 'error-email', 'Please enter a valid email');
      valid = false;
    }
    if (!data.phone || data.phone.length < 10) {
      showError('phone', 'error-phone', 'Please enter a valid phone number');
      valid = false;
    }
    if (!data.date) {
      showError('date', 'error-date', 'Please select a preferred date');
      valid = false;
    }

    // Check that at least one activity is selected
    const activeTab = document.querySelector('.form-tab--active')?.dataset.tab;
    if (activeTab === 'rafting' && !data.raftingRoute) {
      valid = false;
      alert('Please select a rafting route.');
    }
    if (activeTab === 'camping' && !data.campingType) {
      valid = false;
      alert('Please select an accommodation type.');
    }
    if (activeTab === 'safari' && !data.safariType) {
      valid = false;
      alert('Please select a safari package.');
    }

    if (!valid) return;

    // Simulate submission
    const btn = form.querySelector('#submit-btn');
    btn.classList.add('is-loading');
    btn.disabled = true;

    await new Promise((r) => setTimeout(r, 1500));

    btn.classList.remove('is-loading');
    btn.disabled = false;

    // Show success
    form.style.display = 'none';
    const success = document.createElement('div');
    success.className = 'form-success is-visible';
    success.innerHTML = `
      <div class="form-success__icon">🏕️</div>
      <h3>Enquiry Sent!</h3>
      <p>We'll confirm availability within 2 hours. Check your email for confirmation.</p>
    `;
    form.parentElement.appendChild(success);
  });
}

function showError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (input) input.classList.add('has-error');
  if (error) error.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.form-input.has-error').forEach((el) => el.classList.remove('has-error'));
  document.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''));
}

// ────────────────────────────────────────────────────
// NAVIGATION
// ────────────────────────────────────────────────────
function initNavigation() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('nav-burger');
  const mobile = document.getElementById('nav-mobile');

  // Scroll-based nav styling
  ScrollTrigger.create({
    start: 100,
    onUpdate: (self) => {
      if (self.scroll() > 100) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    },
  });

  // Mobile toggle
  burger?.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', !isOpen);
    mobile?.classList.toggle('is-open');
    mobile?.setAttribute('aria-hidden', isOpen);
  });

  // Close mobile nav on link click
  mobile?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      burger.setAttribute('aria-expanded', 'false');
      mobile.classList.remove('is-open');
      mobile.setAttribute('aria-hidden', 'true');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// ────────────────────────────────────────────────────
// LENIS SMOOTH SCROLL
// ────────────────────────────────────────────────────
function initLenis(canyonScene) {
  if (state.reducedMotion) return;

  const lenis = new Lenis({
    duration: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.8,
    smoothTouch: false,
  });

  state.lenis = lenis;

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Feed scroll progress to canyon
  lenis.on('scroll', ({ scroll, limit }) => {
    canyonScene.setProgress(scroll / limit);
  });

  // Set min/max for hero section
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    pin: false,
    onUpdate: (self) => {
      state.scrollProgress = self.progress;
      canyonScene.setProgress(self.progress);
    },
  });
}

// ────────────────────────────────────────────────────
// SET MIN DATE FOR DATE INPUTS
// ────────────────────────────────────────────────────
function initDateInputs() {
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    if (!input.min) input.min = today;
  });
}

// ────────────────────────────────────────────────────
// BOOT
// ────────────────────────────────────────────────────
function init() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) {
    console.warn('Hero canvas not found — skipping WebGL scene.');
    return;
  }

  // 1. Build 3D scene
  const canyonScene = new CanyonScene(canvas);

  // 2. Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // 3. Smooth scroll
  initLenis(canyonScene);

  // 4. Hero overlay animation
  initHeroOverlay(canyonScene);

  // 5. Scroll-triggered reveals
  initScrollAnimations();

  // 6. Navigation
  initNavigation();

  // 7. Booking form
  initBookingForm();

  // 8. Date inputs
  initDateInputs();
}

// Wait for DOM + fonts
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
