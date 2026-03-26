document.addEventListener('DOMContentLoaded', () => {
  // --- ONLY TESTIMONIAL SMOOTH SCROLLING FOR DESKTOP ---
  // Remove general Lenis smooth scrolling, keep only for testimonials
  
  // --- REVEAL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-box, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-section-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- MAGNETIC ELEMENTS ---
  const magneticTargets = document.querySelectorAll('.magnetic-target');

  magneticTargets.forEach(target => {
    target.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = target.getBoundingClientRect();

      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      const strength = 20; // Adjust strength of "magnetic" pull

      target.style.transform = `translate(${x / width * strength}px, ${y / height * strength}px)`;
    });

    target.addEventListener('mouseleave', () => {
      target.style.transform = `translate(0px, 0px)`;
    });
  });

  // --- PARALLAX BACKGROUND ---
  const parallaxElements = document.querySelectorAll('.parallax');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = el.dataset.speed || 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
});

