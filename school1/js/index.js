// Hamburger Menu logic
var hamburgerIcon = document.getElementById("hamburgerIcon");
var navItems = document.getElementById("navItems");
var header = document.querySelector(".mainHeader");
var coverDiv = document.querySelector(".coverDiv");
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
function updateHeaderTheme() {
   if (!header) return;

   var threshold = 50;
   if (coverDiv) {
      var headerHeight = header.offsetHeight || 0;
      threshold = Math.max(0, coverDiv.offsetHeight - headerHeight);
   }

   if (window.scrollY >= threshold) {
      header.classList.add("glass");
   } else {
      header.classList.remove("glass");
   }
}

window.addEventListener("scroll", updateHeaderTheme);
window.addEventListener("resize", updateHeaderTheme);
updateHeaderTheme();

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
