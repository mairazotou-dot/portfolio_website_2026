// CUSTOM CURSOR
window.addEventListener("load", function () {
    new cursoreffects.ghostCursor({
        image: "cursor.png"
    });
});





//CONTACT POP-UP

const contactWord = document.getElementById("wordcontact"); 
const popup = document.getElementById("contactcard");
const closeBtn = document.getElementById("closePopup");

// OPEN POPUP 
contactWord.addEventListener("click", () => {
  popup.style.display = "block";
  contactWord.classList.add("active"); // Turns the button light blue
});

// CLOSE POPUP 
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
  contactWord.classList.remove("active"); // Returns the button to grey
});






//reveals on scroll


const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });
revealItems.forEach(item => observer.observe(item));



//image grid 

const overlay = document.getElementById("overlay");
const overlayImg = document.getElementById("overlay-img");
const lens = document.getElementById("lens");

let zoom = 3; // magnification level

document.querySelectorAll(".imagegrid img").forEach(img => {
  img.addEventListener("click", () => {
    overlayImg.src = img.src;
    lens.style.backgroundImage = `url("${img.src}")`;
    overlay.classList.add("show");
  });
});

function closeOverlay() {
  overlay.classList.remove("show");
  lens.classList.remove("active");
}

// close only when clicking the backdrop, not the image
overlay.addEventListener("click", (e) => {
  if (e.target !== overlayImg) closeOverlay();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeOverlay();
});

// magnifier
function moveLens(e) {
  const r = overlayImg.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;

  lens.style.left = e.clientX + "px";
  lens.style.top = e.clientY + "px";
  lens.style.backgroundSize = `${r.width * zoom}px ${r.height * zoom}px`;
  lens.style.backgroundPosition =
    `${-(x * zoom - lens.offsetWidth / 2)}px ${-(y * zoom - lens.offsetHeight / 2)}px`;
  lens.classList.add("active");
}

overlayImg.addEventListener("pointermove", moveLens);
overlayImg.addEventListener("pointerdown", moveLens);
overlayImg.addEventListener("pointerleave", () => lens.classList.remove("active"));
overlayImg.addEventListener("pointerup", (e) => {
  if (e.pointerType === "touch") lens.classList.remove("active");
});

// scroll wheel changes magnification (2x to 8x)
overlayImg.addEventListener("wheel", (e) => {
  e.preventDefault();
  zoom = Math.min(8, Math.max(2, zoom + (e.deltaY < 0 ? 0.5 : -0.5)));
  moveLens(e);
}, { passive: false });












(() => {
  /* ======================================================================
     tune the gallery
     ====================================================================== */
  const CONFIG = {
    galleryTop: 0.6,          // vertical position of the active item's centre (0.4 = 40% from the top)
    startIndex: 1,            // item the roulette opens on (0 = first, 1 = second ...)
    sideScale: 0.45,          // size of the blurry top/bottom items relative to the active one (0.1 - 1)
    gap: -40,                 // px of space between the active item and its neighbours
    blur: 5,                  // px of blur on the neighbours
    neighbourOpacity: 0.9,    // opacity of the neighbours (0 - 1)

    collapsedWidth: 0.9,        // active item max width as a share of screen width (desktop)
    collapsedWidthMobile: 2, // same, for screens under 700px wide
    collapsedMaxWidth: 1400,    // active item max width in px
    collapsedHeight: 0.5,       // active item max height as a share of screen height
    enlargedSize: 1.2,          // size of an enlarged item as a share of the screen (0.7 = 70%)
    aspectRatio: 16 / 9,        // shape of every item's box (media is contained inside it)

    sideOffset: -40,            // side text (counter + skip button) position:
                              //   0   = perfectly centred between the screen edge and the gallery
                              //   +px = both move toward the screen edges (e.g. 20)
                              //   -px = both move toward the gallery (e.g. -20)

    cooldown: 420,            // ms between steps. Higher = slower, lower = faster
    wheelThreshold: 30,       // how hard a mouse/trackpad scroll must be to trigger a step
    touchThreshold: 40,       // px of swipe needed on touch screens
    glideOnRelease: true,     // true = after the last (or first) item, one scroll glides smoothly past the gallery
                              // false = the page just starts scrolling normally

    moveSpeed: 100,           // roulette animation: higher = slower and smoother (ms)
    enlargeSpeed: 110,        // enlarge/shrink animation: higher = slower (ms)
    veilOpacity: 0.85         // darkness behind an enlarged item (0 - 1)
  };

  /* ======================================================================
     code - no need to edit below this line
     ====================================================================== */
  const section = document.getElementById('gallery');
  const veil    = section.querySelector('.gallery__veil');
  const items   = [...section.querySelectorAll('.g-item')];
  const sides   = [...section.querySelectorAll('.side')];
  const counterCurrent = section.querySelector('[data-current]');
  const counterTotal   = section.querySelector('[data-total]');
  const skipBtn        = section.querySelector('.skip');
  const N = items.length, LAST = N - 1, MIN = 0;
  const START = Math.min(CONFIG.startIndex, LAST);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (counterTotal) counterTotal.textContent = N;      // total updates automatically when you add items

  let vw, vh, W, H, s0, secTop;
  let idx = START, cur = START, exp = 0, expTarget = 0, active = -1, shown = -1, raf = 0, last = 0;
  let locked = false, prevY = scrollY, cooldownUntil = 0;
  let lastWheel = 0, prevAbs = 0, accum = 0, needNew = false;
  let skipTarget = null, skipTimer = 0, wheelBlockUntil = 0, inView = true;

  const lerp = (a, b, t) => a + (b - a) * t;
  const jump = y => scrollTo({ top: y, behavior: 'instant' });
  const maxScroll = () => document.documentElement.scrollHeight - innerHeight;
  const updateSecTop = () => {
    secTop = section.getBoundingClientRect().top + scrollY;
    if (locked) jump(secTop);
  };

  /* ---------- Layout ---------- */
  function measure() {
    vw = innerWidth; vh = innerHeight;
    W = Math.min(vw * CONFIG.enlargedSize, vh * CONFIG.enlargedSize * CONFIG.aspectRatio);
    H = W / CONFIG.aspectRatio;
    const cw = Math.min(vw * (vw < 700 ? CONFIG.collapsedWidthMobile : CONFIG.collapsedWidth), CONFIG.collapsedMaxWidth);
    s0 = Math.min(cw / W, vh * CONFIG.collapsedHeight / H);
    const top = (CONFIG.galleryTop * 100) + '%';
    items.forEach(el => {
      el.style.top = top;
      el.style.width = W + 'px'; el.style.height = H + 'px';
      el.style.marginLeft = (-W / 2) + 'px'; el.style.marginTop = (-H / 2) + 'px';
    });
    // Left/right areas run from the screen edge to the gallery edge, and the text is centred in each,
    // so it is equally far from the screen edge and from the gallery. CONFIG.sideOffset shifts it.
    const free = Math.max(0, (vw - W * s0) / 2);
    sides.forEach(el => {
      const isRight = el.classList.contains('side--right');
      const shift = isRight ? CONFIG.sideOffset : -CONFIG.sideOffset;
      el.style.top = top;
      el.style.width = free + 'px';
      el.style.maxWidth = 'none';
      el.style.padding = '0';
      el.style.textAlign = 'center';
      el.style.transform = `translate(${shift}px, -50%)`;
      if (isRight) { el.style.left = ''; el.style.right = '0px'; }
      else { el.style.right = ''; el.style.left = '0px'; }
    });
    updateSecTop();
    kick();
  }

  /* ---------- Gliding past the gallery (skip button, anchor links, release) ---------- */
  function endGlide() {
    skipTarget = null; clearTimeout(skipTimer);
    wheelBlockUntil = performance.now() + 350;       // swallow trackpad inertia after arriving
  }
  function guardTo(y) {                              // stops the gallery re-capturing on the way to y
    skipTarget = Math.max(0, Math.min(y, maxScroll()));
    clearTimeout(skipTimer);
    skipTimer = setTimeout(endGlide, 2000);          // safety reset
  }
  function glideTo(y) {
    guardTo(y);
    scrollTo({ top: skipTarget, behavior: reduce ? 'auto' : 'smooth' });
  }
  function release(dir, e) {
    locked = false;
    if (!CONFIG.glideOnRelease) return;              // let the page scroll normally
    if (e && e.cancelable) e.preventDefault();
    glideTo(dir > 0 ? secTop + section.offsetHeight : secTop - vh);
  }

  if (skipBtn) skipBtn.addEventListener('click', () => {
    collapse(); locked = false;
    glideTo(secTop + section.offsetHeight);          // bottom edge of the gallery = start of the next section
  });

  // Links like <a href="#contact"> in your own navigation: let them scroll, don't fight them
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const t = id ? document.getElementById(id) : document.documentElement;
    if (!t || section.contains(t)) return;
    collapse(); locked = false;
    guardTo(id ? t.getBoundingClientRect().top + scrollY : 0);
  }, true);

  /* ---------- Stepping through the roulette ---------- */
  function collapse() { expTarget = 0; kick(); }

  // Returns true if the move was handled, false if the gallery should release the scroll.
  function move(dir) {
    if (expTarget) { collapse(); cooldownUntil = performance.now() + CONFIG.cooldown; return true; }
    const n = idx + dir;
    if (n > LAST) return false;
    if (n < MIN) return secTop <= 1;                 // nothing above the gallery: just absorb
    idx = n; cooldownUntil = performance.now() + CONFIG.cooldown; kick();
    return true;
  }

  function capture(i) { locked = true; idx = cur = i; jump(secTop); kick(); }

  addEventListener('wheel', e => {
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;   // pinch-zoom / sideways scroll
    const now = performance.now();
    if (skipTarget !== null || now < wheelBlockUntil) { e.preventDefault(); return; }
    if (!locked) return;
    const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
    const dt = now - lastWheel; lastWheel = now;
    const a = Math.abs(d);
    // a new gesture starts after a pause, or when the wheel clearly accelerates (not trackpad inertia)
    if (dt > 100 || a > prevAbs * 1.3 + 1) needNew = false;
    prevAbs = a;
    accum = (dt > 200 || Math.sign(d) !== Math.sign(accum)) ? d : accum + d;
    if (needNew || now < cooldownUntil || Math.abs(accum) < CONFIG.wheelThreshold) { e.preventDefault(); return; }
    const dir = Math.sign(accum); accum = 0; needNew = true;
    if (move(dir)) e.preventDefault(); else release(dir, e);
  }, { passive: false });

  addEventListener('keydown', e => {
    if (e.key === 'Escape') { collapse(); return; }
    if (!locked || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(e.target.tagName)) return;
    const dir = { ArrowDown: 1, PageDown: 1, ' ': 1, ArrowUp: -1, PageUp: -1 }[e.key];
    if (!dir) return;
    if (performance.now() < cooldownUntil) { e.preventDefault(); return; }
    if (move(dir)) e.preventDefault(); else release(dir, e);
  });

  let ty = 0;
  addEventListener('touchstart', e => { ty = e.touches[0].clientY; }, { passive: true });
  addEventListener('touchmove', e => {
    if (!locked) return;
    const y = e.touches[0].clientY, d = ty - y;
    if (e.cancelable) e.preventDefault();
    if (Math.abs(d) < CONFIG.touchThreshold || performance.now() < cooldownUntil) return;
    ty = y;
    const dir = Math.sign(d);
    if (!move(dir)) release(dir, null);              // touch is already cancelled, so always glide
  }, { passive: false });

  // Keeps the page pinned while locked, and re-captures when you scroll back into the gallery
  addEventListener('scroll', () => {
    const y = scrollY;
    if (skipTarget !== null) {                       // gliding past the gallery: don't re-capture on the way
      if (Math.abs(y - skipTarget) < 2) endGlide();
      prevY = y; return;
    }
    if (locked) { if (Math.abs(y - secTop) > 1) jump(secTop); }
    else if (prevY < secTop && y >= secTop) capture(START);      // arrived from above
    else if (prevY > secTop && y <= secTop) capture(LAST);       // arrived from below
    prevY = scrollY;
  }, { passive: true });

  /* ---------- Click to enlarge / shrink ---------- */
  items.forEach((el, i) => el.addEventListener('click', () => {
    if (i === idx) { expTarget = expTarget ? 0 : 1; kick(); }
    else if (!expTarget) { idx = i; cooldownUntil = performance.now() + CONFIG.cooldown; kick(); }
  }));
  veil.addEventListener('click', collapse);

  /* ---------- Animation ---------- */
  function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }

  function frame(now) {
    const dt = Math.min(now - last, 50); last = now;
    cur = lerp(cur, idx, reduce ? 1 : 1 - Math.exp(-dt / CONFIG.moveSpeed));
    exp = lerp(exp, expTarget, reduce ? 1 : 1 - Math.exp(-dt / CONFIG.enlargeSpeed));
    if (Math.abs(cur - idx) < 0.0005) cur = idx;
    if (Math.abs(exp - expTarget) < 0.001) exp = expTarget;
    render();
    raf = (cur !== idx || exp !== expTarget) ? requestAnimationFrame(frame) : 0;
  }

  function syncVideos() {                            // play only the active video, and only while visible
    items.forEach((el, i) => {
      const v = el.querySelector('video');
      if (!v) return;
      if (inView && i === active) v.play().catch(() => {}); else v.pause();
    });
  }

  function render() {
    const { sideScale, gap, blur, neighbourOpacity } = CONFIG;
    const h = H * s0;
    const stepY = h / 2 + (h * sideScale) / 2 + gap;
    items.forEach((el, i) => {
      const o = i - cur, a = Math.abs(o), sign = Math.sign(o);
      if (a >= 2) { el.style.visibility = 'hidden'; return; }
      el.style.visibility = 'visible';

      let scale = s0 * (1 - (1 - sideScale) * Math.min(a, 1));
      let y = sign * (Math.min(a, 1) * stepY + Math.max(a - 1, 0) * stepY * 0.6);
      let opacity = a <= 1 ? 1 - (1 - neighbourOpacity) * a : neighbourOpacity * (2 - a);
      const w = Math.max(0, 1 - a);                  // how "active" this item is

      scale = lerp(scale, 1, exp * w);               // enlarge the active item, fade the rest
      y += exp * w * (vh * (0.5 - CONFIG.galleryTop));   // moves to screen centre
      opacity *= 1 - exp * (1 - w);

      el.style.transform = `translate3d(0,${y.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = a < 0.01 ? 'none' : `blur(${(blur * Math.min(a, 1)).toFixed(2)}px)`;
      el.style.zIndex = 10 - Math.round(a * 4) + (a < 0.5 ? 5 : 0);
      el.style.pointerEvents = (exp > 0.1 && a > 0.5) ? 'none' : 'auto';
    });
    veil.style.opacity = (exp * CONFIG.veilOpacity).toFixed(3);
    veil.style.pointerEvents = exp > 0.05 ? 'auto' : 'none';

    if (idx !== shown) {                             // counter changes the moment a step starts
      shown = idx;
      if (counterCurrent) counterCurrent.textContent = idx + 1;
    }
    const now = Math.round(cur);
    if (now !== active) { active = now; syncVideos(); }
  }

  /* ---------- Setup ---------- */
  addEventListener('resize', () => {
    // On phones the address bar showing/hiding fires resize; ignore that so items don't jitter
    if (innerWidth === vw && Math.abs(innerHeight - vh) < 150 && 'ontouchstart' in window) { updateSecTop(); return; }
    measure();
  });
  addEventListener('load', () => { measure(); if (Math.abs(scrollY - secTop) < 2) locked = true; });
  if ('ResizeObserver' in window) new ResizeObserver(updateSecTop).observe(document.body);   // content above changed
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { inView = en.isIntersecting; syncVideos(); }).observe(section);
  }
  measure();
  locked = Math.abs(scrollY - secTop) < 2;           // gallery is first on the page: capture immediately
  render();
})();










