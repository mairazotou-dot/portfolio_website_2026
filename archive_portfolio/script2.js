

// ====== POPUPS ======
function setupPopup(openEl, popupEl, closeEl) {
  if (!openEl || !popupEl || !closeEl) return;
  openEl.addEventListener("click", () => { popupEl.style.display = "block"; });
  closeEl.addEventListener("click", () => { popupEl.style.display = "none"; });
}

setupPopup(
  document.getElementById("wordcontact"),
  document.getElementById("contactcard"),
  document.getElementById("closePopup")
);

setupPopup(
  document.getElementById("experience"),
  document.getElementById("exp"),
  document.getElementById("closebutton")
);

// ====== BOUNCING IMAGE ======
const SPEED = 180;
const img = document.getElementById("bouncer");

if (img) {
  let x = 50, y = 50, dirX = 1, dirY = 1, lastTime = null;

  function move(now) {
    if (lastTime === null) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    const maxX = window.innerWidth - img.offsetWidth;
    const maxY = window.innerHeight - img.offsetHeight;

    x += dirX * SPEED * dt;
    y += dirY * SPEED * dt;

    if (x <= 0)    { x = 0;    dirX = 1; }
    if (x >= maxX) { x = maxX; dirX = -1; }
    if (y <= 0)    { y = 0;    dirY = 1; }
    if (y >= maxY) { y = maxY; dirY = -1; }

    img.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(move);
  }

  if (img.complete) requestAnimationFrame(move);
  else img.addEventListener("load", () => requestAnimationFrame(move));
}