
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
  contactWord.classList.add("active"); 
});

// CLOSE POPUP & REMOVE ACTIVE BLUE STATE
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
  contactWord.classList.remove("active"); 
});









// gallery scroll

const wrapper = document.querySelector('.gallery-wrapper');
const items = document.querySelectorAll('.gallery-item');


const tagBar = document.querySelector('.tag-bar-wrapper');
const tags = document.querySelectorAll('.tag-item');

function handleFocus() {
  const wrapperCenter = wrapper.scrollLeft + (wrapper.offsetWidth / 2);


  items.forEach((item, index) => {
    const itemCenter = item.offsetLeft + (item.offsetWidth / 2);


    const isCentered = Math.abs(wrapperCenter - itemCenter) < (item.offsetWidth / 2);
    const video = item.querySelector('video');
    const associatedTag = tags[index]; 

    if (isCentered) {
      if (!item.classList.contains('active')) {
        item.classList.add('active');
        if (video) video.play().catch(() => {});
      }


      if (associatedTag && !associatedTag.classList.contains('active-tag')) {
        tags.forEach(t => t.classList.remove('active-tag')); 
        associatedTag.classList.add('active-tag');

        const tagCenter = associatedTag.offsetLeft + (associatedTag.offsetWidth / 2);
        tagBar.scrollLeft = tagCenter - (window.innerWidth / 2);
      }
    } else {
      item.classList.remove('active');
      if (video) video.pause();
    }
  });
}


wrapper.addEventListener('scroll', handleFocus);


window.addEventListener('load', () => {

  const projectTwo = items[1]; 

  if (projectTwo) {

    const scrollPosition = projectTwo.offsetLeft - (wrapper.offsetWidth / 2) + (projectTwo.offsetWidth / 2);
    wrapper.scrollLeft = scrollPosition;
  }


  handleFocus();
});


items.forEach(item => {
  item.addEventListener('click', (event) => {

    if (item.classList.contains('active')) {
      const destination = item.getAttribute('data-link');
      if (destination) {
        window.location.href = destination;
      }
    } else {

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





