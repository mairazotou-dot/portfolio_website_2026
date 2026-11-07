
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



// BOUNCING VIDEO 
const SPEED = 110;
const el = document.getElementById("bouncer");

if (el) {
  let x = 50, y = 50, dirX = 1, dirY = 1, lastTime = null;

  function move(now) {
    if (lastTime === null) lastTime = now;
    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;

    x += dirX * SPEED * dt;
    y += dirY * SPEED * dt;

    if (x <= 0)    { x = 0;    dirX = 1; }
    if (x >= maxX) { x = maxX; dirX = -1; }
    if (y <= 0)    { y = 0;    dirY = 1; }
    if (y >= maxY) { y = maxY; dirY = -1; }

    el.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(move);
  }

  const start = () => requestAnimationFrame(move);

  if (el.tagName === "VIDEO") {
    if (el.readyState >= 1) start();
    else el.addEventListener("loadedmetadata", start);
  } else {
    if (el.complete) start();
    else el.addEventListener("load", start);
  }
}