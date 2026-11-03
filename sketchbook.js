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







//message

const form = document.getElementById("msg-form");
const status = document.getElementById("msg-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "sending...";

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form)))
    });
    const data = await res.json();

    if (data.success) {
      status.textContent = "Message sent. Thank you!";
      form.reset();
    } else {
      status.textContent = "something went wrong, please try again.";
    }
  } catch (err) {
    status.textContent = "network error,  please try again.";
  }
});









