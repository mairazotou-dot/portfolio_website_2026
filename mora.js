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





















//header image sticky

const headerImage = document.getElementById("header_image");
const cardsImage  = document.getElementById("cards");

let ticking = false;

function updateHeader() {
  const headerHeight = headerImage.offsetHeight;

  
  const fixedBottom = window.innerHeight * 0.49 + headerHeight / 2;

  
  const cardsBottom = cardsImage.getBoundingClientRect().bottom;

  
  const offset = Math.min(0, cardsBottom - fixedBottom);

  headerImage.style.transform =
    `translate(-50%, calc(-50% + ${offset}px))`;

  ticking = false;
}

function requestUpdate() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateHeader);
  }
}

window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", requestUpdate);
headerImage.addEventListener("load", requestUpdate);
cardsImage.addEventListener("load", requestUpdate);

updateHeader();


//header2 image sticky


const SIEN_START_TOP_DESKTOP = 658; 
const SIEN_START_TOP_MOBILE  = 425; 
const SIEN_FIXED_TOP = 49;          
const SIEN_STOP_EDGE = "bottom";    
const SIEN_GAP       = 0;           

const mobileQuery = window.matchMedia("(max-width: 768px)");

const sienIcon  = document.getElementById("sien_icon");
const sienVideo = document.getElementById("sien_video");
let sienTicking = false;

function updateSien() {
  const vh = window.innerHeight;
  const h  = sienIcon.offsetHeight;

  
  const startTop = mobileQuery.matches ? SIEN_START_TOP_MOBILE : SIEN_START_TOP_DESKTOP;

  
  const startY = vh * (startTop / 100) - window.scrollY;

  
  const fixedY = vh * (SIEN_FIXED_TOP / 100);

  
  let y = Math.max(fixedY, startY);

  
  const rect = sienVideo.getBoundingClientRect();
  const edge = SIEN_STOP_EDGE === "top" ? rect.top : rect.bottom;
  y = Math.min(y, edge - h / 2 - SIEN_GAP);

  sienIcon.style.transform = `translate(-50%, calc(${y}px - 50%))`;
  sienTicking = false;
}

function requestSienUpdate() {
  if (!sienTicking) {
    sienTicking = true;
    requestAnimationFrame(updateSien);
  }
}

window.addEventListener("scroll", requestSienUpdate, { passive: true });
window.addEventListener("resize", requestSienUpdate);
sienIcon.addEventListener("load", requestSienUpdate);
sienVideo.addEventListener("loadedmetadata", requestSienUpdate);

updateSien();









































//reveals on scroll


const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });
revealItems.forEach(item => observer.observe(item));

