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








// image grid
const overlay = document.getElementById("overlay");
const overlayImg = document.getElementById("overlay-img");

function openOverlay(src) {
  overlayImg.src = src;
  overlay.classList.add("show");
}

function closeOverlay() {
  overlay.classList.remove("show");
}

// click a grid image: open it enlarged
document.querySelectorAll(".imagegrid img").forEach(img => {
  img.addEventListener("click", () => openOverlay(img.src));
});

// click the enlarged image, the backdrop, or press Escape: close
overlay.addEventListener("click", closeOverlay);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeOverlay();
});