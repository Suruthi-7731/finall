// Hamburger Menu logic
var hamburgerIcon = document.getElementById("hamburgerIcon");
var navItems = document.getElementById("navItems");
var header = document.querySelector(".mainHeader");
var hamburgerControl = false;

function showMenu() {
   if (!hamburgerControl) {
      hamburgerIcon.firstElementChild.className = "fa-solid fa-times";
      navItems.style.width = "100%";
      hamburgerControl = true;
   } else {
      hamburgerIcon.firstElementChild.className = "fa-solid fa-bars";
      navItems.style.width = "0%";
      hamburgerControl = false;
   }
}

// Close menu when a navigation link is clicked
var navLinks = document.querySelectorAll(".navItems span a");
navLinks.forEach(function(link) {
   link.addEventListener("click", function() {
      if (hamburgerControl) {
         showMenu();
      }
   });
});

// Glass Header effect on scroll
window.addEventListener("scroll", () => {
   if (window.scrollY > 50) {
      header.classList.add("glass");
   } else {
      header.classList.remove("glass");
   }
});

// Reveal About Section logic
const aboutBox = document.querySelector(".reveal-box");
function revealAbout() {
   if (!aboutBox) return;
   const boxTop = aboutBox.getBoundingClientRect().top;
   const windowHeight = window.innerHeight;
   if (boxTop < windowHeight - 120) {
      aboutBox.classList.add("active");
   }
}

window.addEventListener("scroll", revealAbout);
revealAbout();

// Initialize Lenis Smooth Scroll
if (typeof Lenis !== 'undefined') {
   const lenis = new Lenis({
      duration: 0.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 2.5,
      lerp: 0.2, // Higher lerp = faster response
   });

   function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
   }
   requestAnimationFrame(raf);
}

