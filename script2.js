
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

// OPEN POPUP & ADD ACTIVE BLUE STATE
contactWord.addEventListener("click", () => {
  popup.style.display = "block";
  contactWord.classList.add("active"); // Turns the button light blue
});

// CLOSE POPUP & REMOVE ACTIVE BLUE STATE
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
  contactWord.classList.remove("active"); // Returns the button to grey
});









// gallery scroll
const wrapper = document.querySelector('.gallery-wrapper');
const items = document.querySelectorAll('.gallery-item');

// NEW: Grab the top bar elements
const tagBar = document.querySelector('.tag-bar-wrapper');
const tags = document.querySelectorAll('.tag-item');

function handleFocus() {
  const wrapperCenter = wrapper.scrollLeft + (wrapper.offsetWidth / 2);

  // CHANGED: Added 'index' here to find the matching tag for each project
  items.forEach((item, index) => {
    const itemCenter = item.offsetLeft + (item.offsetWidth / 2);

    // CHANGED: Restored your preferred precise checking window (item.offsetWidth / 2)
    const isCentered = Math.abs(wrapperCenter - itemCenter) < (item.offsetWidth / 2);
    const video = item.querySelector('video');
    const associatedTag = tags[index]; // Finds the tag matching this project index

    if (isCentered) {
      if (!item.classList.contains('active')) {
        item.classList.add('active');
        if (video) video.play().catch(() => {});
      }

      // NEW: Activate and center the matching top tag (Make it Bold & Crisp)
      if (associatedTag && !associatedTag.classList.contains('active-tag')) {
        tags.forEach(t => t.classList.remove('active-tag')); // Clear old active tags
        associatedTag.classList.add('active-tag');

        // Smoothly slide the tag row to keep the active tag dead-center
        const tagCenter = associatedTag.offsetLeft + (associatedTag.offsetWidth / 2);
        tagBar.scrollLeft = tagCenter - (window.innerWidth / 2);
      }
    } else {
      item.classList.remove('active');
      if (video) video.pause();
    }
  });
}

// Watch scroll events to update focus states instantly
wrapper.addEventListener('scroll', handleFocus);

// Automatically center Project Two immediately when the page loads
window.addEventListener('load', () => {
  // Grab the second item (index 1)
  const projectTwo = items[1]; 

  if (projectTwo) {
    // Calculate the exact scroll position to center it
    const scrollPosition = projectTwo.offsetLeft - (wrapper.offsetWidth / 2) + (projectTwo.offsetWidth / 2);
    wrapper.scrollLeft = scrollPosition;
  }

  // Run the focus check to trigger blur effects and play the video
  handleFocus();
});

// Listen to clicks on the entire card (image, video, or caption text)
items.forEach(item => {
  item.addEventListener('click', (event) => {
    // UIX Safeguard: Only allow the link to fire if the thumbnail is in the active center position
    if (item.classList.contains('active')) {
      const destination = item.getAttribute('data-link');
      if (destination) {
        window.location.href = destination;
      }
    } else {
      // If a user clicks a blurry side item, smoothly scroll it into the center
      event.preventDefault();
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
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





