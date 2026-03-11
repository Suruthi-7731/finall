document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();
    
    // Initialize smooth scroll
    initSmoothScroll();
});



function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add a small delay to ensure all elements are loaded
setTimeout(() => {
    document.body.style.visibility = 'visible';
    document.body.style.opacity = '1';
}, 100);

function initAnimations() {
    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
        // Make all reveal elements visible immediately
        document.querySelectorAll('.reveal, .reveal-box').forEach(el => {
            el.classList.add('active');
        });
        return;
    }

    const revealElements = document.querySelectorAll('.reveal, .reveal-box');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.12
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                // Add active class to trigger CSS transitions
                el.classList.add('active');

                // If element has data-delay attribute, apply an inline transition delay
                const delay = el.dataset.delay || (el.classList.contains('delay-100') ? 0.1 : el.classList.contains('delay-200') ? 0.2 : el.classList.contains('delay-300') ? 0.3 : el.classList.contains('delay-400') ? 0.4 : el.classList.contains('delay-500') ? 0.5 : 0);
                if (delay) {
                    el.style.transitionDelay = delay + 's';
                }

                // Unobserve after revealing to improve performance
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        // Hide initially is handled by CSS (.reveal)
        observer.observe(el);
    });

    // Small hover animation for interactive cards
    document.querySelectorAll('.hover-premium, .hover-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('is-hover');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('is-hover');
        });
    });
}
