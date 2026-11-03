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

// OPEN 
contactWord.addEventListener("click", () => {
  popup.style.display = "block";
  contactWord.classList.add("active"); // Turns the button light blue
});

// CLOSE 
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
  contactWord.classList.remove("active"); // Returns the button to grey
});














//desktop structure

document.addEventListener("DOMContentLoaded", () => {
  const moodboard = document.getElementById("moodboard");
  let highestZIndex = 10;

  // Makes ANY element (folder or popup) draggable by mouse.
  function makeDraggable(item) {
    item.addEventListener("mousedown", (e) => {
      // Don't start a drag if the user is clicking the close button
      if (e.target.closest(".popup-close")) return;

      highestZIndex++;
      item.style.zIndex = highestZIndex;
      e.preventDefault();

      const startX = e.clientX;
      const startY = e.clientY;
      const originalLeft = item.offsetLeft;
      const originalTop = item.offsetTop;

      function onMouseMove(moveEvent) {
        item.style.left = `${originalLeft + (moveEvent.clientX - startX)}px`;
        item.style.top = `${originalTop + (moveEvent.clientY - startY)}px`;
      }
      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  }

  // Highlights the clicked folder and keeps it highlighted until something else is clicked
  function setActiveFolder(folder) {
    document.querySelectorAll(".mood-item").forEach((f) => f.classList.remove("is-active"));
    if (folder) folder.classList.add("is-active");
  }

  // True if the popup source is a video file (mp4, webm, mov)
  function isVideoSrc(src) {
    return /\.(mp4|webm|mov)(\?.*)?$/i.test(src);
  }

  // Builds and shows a popup for a folder. w/h are the real pixel size of the media.
  function openPopup(folder, popupSrc, isVideo, w, h) {
    const popup = document.createElement("div");
    popup.className = "popup-item draggable";
    popup.style.width = `${w * 0.5}px`;
    popup.style.height = `${h * 0.5}px`;

    // Position it next to the folder, keeping it on-screen
    const folderTop = folder.offsetTop;
    const folderLeft = folder.offsetLeft;
    const folderWidth = folder.offsetWidth;
    const spacing = 20;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let left = folderLeft + folderWidth + spacing;
    if (left + w > screenWidth) {
      left = folderLeft - w - spacing;
      if (left < 0) left = folderLeft + folderWidth / 2 - w / 2;
    }

    let top = folderTop;
    if (top + h > screenHeight) {
      top = Math.max(80, screenHeight - h - spacing);
    }

    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    highestZIndex++;
    popup.style.zIndex = highestZIndex;

    const mediaHTML = isVideo
      ? `<video src="${popupSrc}" autoplay muted loop playsinline></video>`
      : `<img src="${popupSrc}" alt="Popup asset">`;

    popup.innerHTML = `
      ${mediaHTML}
      <button class="popup-close" aria-label="Close">&times;</button>
    `;

    moodboard.appendChild(popup);
    makeDraggable(popup);
    setTimeout(() => popup.classList.add("loaded"), 10);

    // Remember this popup belongs to this folder, so double-clicking again doesn't duplicate it
    folder.openPopup = popup;

    // The X button: closes ONLY this popup
    popup.querySelector(".popup-close").addEventListener("click", (e) => {
      e.stopPropagation();
      popup.classList.remove("loaded");
      setTimeout(() => popup.remove(), 150);
      folder.openPopup = null;
    });
  }

  const folders = document.querySelectorAll(".mood-item");

  folders.forEach((folder) => {
    makeDraggable(folder);

    folder.addEventListener("mousedown", () => setActiveFolder(folder));

    folder.addEventListener("dblclick", (e) => {
      e.stopPropagation();

      // Instagram-style link folders: just open the link, skip popups entirely
      const linkUrl = folder.getAttribute("data-link-url");
      if (linkUrl) {
        window.open(linkUrl, "_blank", "noopener,noreferrer");
        return;
      }

      // If this folder's popup is already open, just bring it to the front instead of
      // stacking a second copy on top of it.
      if (folder.openPopup) {
        highestZIndex++;
        folder.openPopup.style.zIndex = highestZIndex;
        return;
      }

      // The folder icon can be an image or a video; both can carry data-popup-src
      const media = folder.querySelector("img, video");
      const popupSrc = media?.getAttribute("data-popup-src");
      if (!popupSrc) return;

      if (isVideoSrc(popupSrc)) {
        // Videos: read the real dimensions from the metadata before building the popup
        const probe = document.createElement("video");
        probe.preload = "metadata";
        probe.src = popupSrc;
        probe.onloadedmetadata = () => {
          openPopup(folder, popupSrc, true, probe.videoWidth, probe.videoHeight);
        };
      } else {
        // Images: same as before
        const tempImg = new Image();
        tempImg.src = popupSrc;
        tempImg.onload = () => {
          openPopup(folder, popupSrc, false, tempImg.naturalWidth, tempImg.naturalHeight);
        };
      }
    });
  });

  // Clicking empty desktop space removes the "active" glow from folders
  // (popups now only close via their own X button, not by clicking away)
  document.addEventListener("mousedown", (e) => {
    if (!e.target.closest(".mood-item")) {
      setActiveFolder(null);
    }
  });
});






















//reveals on scroll


const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });
revealItems.forEach(item => observer.observe(item));






//stop video on hover


// pause on hover (desktop only, so a tap on a phone can't leave a video stuck paused)
if (window.matchMedia("(hover: hover)").matches) {
  ["front", "signvid"].forEach(id => {
    const video = document.getElementById(id);
    if (!video) return;
    video.addEventListener("mouseenter", () => video.pause());
    video.addEventListener("mouseleave", () => video.play());
  });
}







//events gallery

const gallery = document.getElementById("events_gallery");
const slides = gallery.querySelectorAll(".mySlides");
const thumbs = gallery.querySelectorAll(".demo");
const row = gallery.querySelector(".row");
const caption = document.getElementById("caption");
let slideIndex = 0;

function showSlide(n) {
  // stay within the first and last slide
  slideIndex = Math.max(0, Math.min(slides.length - 1, n));

  slides.forEach((slide, i) => {
    const show = i === slideIndex;
    slide.style.display = show ? "block" : "none";

    // only the visible video plays
    const video = slide.querySelector("video");
    if (video) {
      video.muted = true;
      video.loop = true;
      if (show) video.play().catch(() => {});
      else video.pause();
    }
  });

  thumbs.forEach((thumb, i) => thumb.classList.toggle("active", i === slideIndex));

  const current = thumbs[slideIndex];
  caption.textContent = current.alt || current.title || "";

  // keep the current thumbnail centered in the row
  // (this moves only the thumbnail row, never the page)
  const col = current.parentElement;
  const offset = col.getBoundingClientRect().left - row.getBoundingClientRect().left;
  row.scrollTo({
    left: row.scrollLeft + offset - (row.clientWidth - col.offsetWidth) / 2,
    behavior: "smooth"
  });
}

// Buttons
gallery.querySelector(".prev").addEventListener("click", () => showSlide(slideIndex - 1));
gallery.querySelector(".next").addEventListener("click", () => showSlide(slideIndex + 1));

// Click a thumbnail
thumbs.forEach((thumb, i) => thumb.addEventListener("click", () => showSlide(i)));

// Keyboard arrows (only while the gallery is on screen)
let onScreen = false;
new IntersectionObserver((entries) => {
  onScreen = entries[0].isIntersecting;
}, { threshold: 0.4 }).observe(gallery);

document.addEventListener("keydown", (e) => {
  if (!onScreen) return;
  if (e.key === "ArrowRight") { e.preventDefault(); showSlide(slideIndex + 1); }
  if (e.key === "ArrowLeft")  { e.preventDefault(); showSlide(slideIndex - 1); }
});

// Trackpad: swipe left/right over the gallery
let waiting = false;
gallery.addEventListener("wheel", (e) => {
  if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // normal page scrolling still works
  e.preventDefault();
  if (waiting || Math.abs(e.deltaX) < 12) return;
  showSlide(slideIndex + (e.deltaX > 0 ? 1 : -1));
  waiting = true;
  setTimeout(() => (waiting = false), 380); // one slide per swipe
}, { passive: false });

showSlide(0);