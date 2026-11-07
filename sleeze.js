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
  contactWord.classList.add("active"); 
});

// CLOSE POPUP 
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
  contactWord.classList.remove("active"); 
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

let zoom = 3; 

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


overlayImg.addEventListener("wheel", (e) => {
  e.preventDefault();
  zoom = Math.min(8, Math.max(2, zoom + (e.deltaY < 0 ? 0.5 : -0.5)));
  moveLens(e);
}, { passive: false });












(() => {
  
  const CONFIG = {
    galleryTop: 0.6,          
    startIndex: 1,            
    sideScale: 0.45,          
    gap: -40,                 
    blur: 5,                  
    neighbourOpacity: 0.9,    

    collapsedWidth: 0.9,        
    collapsedWidthMobile: 2, 
    collapsedMaxWidth: 1400,    
    collapsedHeight: 0.5,       
    enlargedSize: 1.2,          
    aspectRatio: 16 / 9,        

    sideOffset: -40,            
                              
                              
                              

    cooldown: 420,            
    wheelThreshold: 30,       
    touchThreshold: 40,       
    glideOnRelease: true,     
                              

    moveSpeed: 100,           
    enlargeSpeed: 110,        
    veilOpacity: 0.85         
  };

  


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

  if (counterTotal) counterTotal.textContent = N;      

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

  
  function endGlide() {
    skipTarget = null; clearTimeout(skipTimer);
    wheelBlockUntil = performance.now() + 350;       
  }
  function guardTo(y) {                              
    skipTarget = Math.max(0, Math.min(y, maxScroll()));
    clearTimeout(skipTimer);
    skipTimer = setTimeout(endGlide, 2000);          
  }
  function glideTo(y) {
    guardTo(y);
    scrollTo({ top: skipTarget, behavior: reduce ? 'auto' : 'smooth' });
  }
  function release(dir, e) {
    locked = false;
    if (!CONFIG.glideOnRelease) return;              
    if (e && e.cancelable) e.preventDefault();
    glideTo(dir > 0 ? secTop + section.offsetHeight : secTop - vh);
  }

  if (skipBtn) skipBtn.addEventListener('click', () => {
    collapse(); locked = false;
    glideTo(secTop + section.offsetHeight);          
  });

  
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    const t = id ? document.getElementById(id) : document.documentElement;
    if (!t || section.contains(t)) return;
    collapse(); locked = false;
    guardTo(id ? t.getBoundingClientRect().top + scrollY : 0);
  }, true);

  
  function collapse() { expTarget = 0; kick(); }

  
  function move(dir) {
    if (expTarget) { collapse(); cooldownUntil = performance.now() + CONFIG.cooldown; return true; }
    const n = idx + dir;
    if (n > LAST) return false;
    if (n < MIN) return secTop <= 1;                 
    idx = n; cooldownUntil = performance.now() + CONFIG.cooldown; kick();
    return true;
  }

  function capture(i) { locked = true; idx = cur = i; jump(secTop); kick(); }

  addEventListener('wheel', e => {
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;   
    const now = performance.now();
    if (skipTarget !== null || now < wheelBlockUntil) { e.preventDefault(); return; }
    if (!locked) return;
    const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
    const dt = now - lastWheel; lastWheel = now;
    const a = Math.abs(d);
    
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
    if (!move(dir)) release(dir, null);              
  }, { passive: false });

  
  addEventListener('scroll', () => {
    const y = scrollY;
    if (skipTarget !== null) {                       
      if (Math.abs(y - skipTarget) < 2) endGlide();
      prevY = y; return;
    }
    if (locked) { if (Math.abs(y - secTop) > 1) jump(secTop); }
    else if (prevY < secTop && y >= secTop) capture(START);      
    else if (prevY > secTop && y <= secTop) capture(LAST);       
    prevY = scrollY;
  }, { passive: true });

  
  items.forEach((el, i) => el.addEventListener('click', () => {
    if (i === idx) { expTarget = expTarget ? 0 : 1; kick(); }
    else if (!expTarget) { idx = i; cooldownUntil = performance.now() + CONFIG.cooldown; kick(); }
  }));
  veil.addEventListener('click', collapse);

  
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

  function syncVideos() {                            
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
      const w = Math.max(0, 1 - a);                  

      scale = lerp(scale, 1, exp * w);               
      y += exp * w * (vh * (0.5 - CONFIG.galleryTop));   
      opacity *= 1 - exp * (1 - w);

      el.style.transform = `translate3d(0,${y.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.filter = a < 0.01 ? 'none' : `blur(${(blur * Math.min(a, 1)).toFixed(2)}px)`;
      el.style.zIndex = 10 - Math.round(a * 4) + (a < 0.5 ? 5 : 0);
      el.style.pointerEvents = (exp > 0.1 && a > 0.5) ? 'none' : 'auto';
    });
    veil.style.opacity = (exp * CONFIG.veilOpacity).toFixed(3);
    veil.style.pointerEvents = exp > 0.05 ? 'auto' : 'none';

    if (idx !== shown) {                             
      shown = idx;
      if (counterCurrent) counterCurrent.textContent = idx + 1;
    }
    const now = Math.round(cur);
    if (now !== active) { active = now; syncVideos(); }
  }

  
  addEventListener('resize', () => {
   
    if (innerWidth === vw && Math.abs(innerHeight - vh) < 150 && 'ontouchstart' in window) { updateSecTop(); return; }
    measure();
  });
  addEventListener('load', () => { measure(); if (Math.abs(scrollY - secTop) < 2) locked = true; });
  if ('ResizeObserver' in window) new ResizeObserver(updateSecTop).observe(document.body);   
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { inView = en.isIntersecting; syncVideos(); }).observe(section);
  }
  measure();
  locked = Math.abs(scrollY - secTop) < 2;           
  render();
})();










