/**
 * Refined Video Carousel (Stories Style)
 * Handles sequential autoplay, horizontal scrolling, and progress tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.stories-scroll');
    const cards = document.querySelectorAll('.story-card');
    const videos = document.querySelectorAll('.story-video');
    const unmuteBtns = document.querySelectorAll('.unmute-btn');
    const track = document.getElementById('stories-track');
    if (!scrollContainer || !cards.length) return;

    let activeIndex = -1;
    let isDesktop = window.innerWidth >= 1025;

    // --- Custom Book Cursor ---
    const bookCursor = document.createElement('div');
    bookCursor.innerHTML = '📖';
    bookCursor.style.cssText = `
        position: fixed;
        width: 25px;
        height: 25px;
        font-size: 16px;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        transform: translate(-50%, -50%) rotate(0deg);
        filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
    `;
    document.body.appendChild(bookCursor);
    bookCursor.style.display = 'none';

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let isHovering = false;

    // Mouse move handler for smooth cursor following
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor animation
    function animateCursor() {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        bookCursor.style.left = currentX + 'px';
        bookCursor.style.top = currentY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Show/hide cursor based on mouse position
    document.addEventListener('mouseenter', () => {
        bookCursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        bookCursor.style.opacity = '0';
    });

    // --- Mouse-based animations with book cursor ---
    cards.forEach((card, index) => {
        // Add initial animation class
        card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.cursor = 'pointer';
        
        // Mouse enter animations
        card.addEventListener('mouseenter', (e) => {
            isHovering = true;
            
            // Animate book cursor
            bookCursor.style.transform = 'translate(-50%, -50%) rotate(15deg) scale(1.1)';
            bookCursor.style.fontSize = '18px';
            
            // Scale up the card
            card.style.transform = 'scale(1.05) translateY(-5px)';
            card.style.zIndex = '10';
            
            // Add glow effect
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(251, 191, 36, 0.4)';
            
            // Brighten the video
            const video = card.querySelector('video');
            if (video) {
                video.style.filter = 'brightness(1.1) saturate(1.2)';
                video.style.transition = 'filter 0.3s ease';
            }
            
            // Animate the unmute button
            const unmuteBtn = card.querySelector('.unmute-btn');
            if (unmuteBtn) {
                unmuteBtn.style.transform = 'scale(1.1)';
                unmuteBtn.style.opacity = '1';
            }
            
            // Play video on hover (desktop)
            if (isDesktop) {
                pauseAllVideos();
                playVideo(video);
            }
        });

        // Mouse leave animations
        card.addEventListener('mouseleave', (e) => {
            isHovering = false;
            
            // Reset book cursor
            bookCursor.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
            bookCursor.style.fontSize = '16px';
            
            // Reset scale and position
            card.style.transform = 'scale(1) translateY(0)';
            card.style.zIndex = '1';
            
            // Reset glow
            card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            
            // Reset video brightness
            const video = card.querySelector('video');
            if (video) {
                video.style.filter = 'brightness(1) saturate(1)';
                if (isDesktop) {
                    video.pause();
                }
            }
            
            // Reset unmute button
            const unmuteBtn = card.querySelector('.unmute-btn');
            if (unmuteBtn) {
                unmuteBtn.style.transform = 'scale(1)';
                unmuteBtn.style.opacity = '0.8';
            }
        });

        // Mouse move parallax effect with book rotation
        card.addEventListener('mousemove', (e) => {
            if (!isDesktop) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            // Subtle tilt effect
            const rotateX = deltaY * 2;
            const rotateY = deltaX * 2;
            
            card.style.transform = `scale(1.05) translateY(-5px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
            
            // Rotate book based on mouse position
            const bookRotation = deltaX * 10 - 5; // -5 to 5 degrees
            bookCursor.style.transform = `translate(-50%, -50%) rotate(${bookRotation}deg) scale(1.1)`;
        });

        // Click animation with book
        card.addEventListener('click', (e) => {
            // Book opening animation
            bookCursor.innerHTML = '📕';
            bookCursor.style.transform = 'translate(-50%, -50%) rotate(180deg) scale(1.3)';
            
            card.style.animation = 'pulse 0.4s ease-out';
            
            setTimeout(() => {
                card.style.animation = '';
                bookCursor.innerHTML = '📖';
                bookCursor.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
            }, 400);
        });

        // Book flip animation on hover
        card.addEventListener('mouseenter', () => {
            let flipCount = 0;
            const flipInterval = setInterval(() => {
                if (!isHovering || flipCount >= 2) {
                    clearInterval(flipInterval);
                    return;
                }
                
                bookCursor.innerHTML = flipCount % 2 === 0 ? '📕' : '📖';
                flipCount++;
            }, 200);
        });
    });

    // --- Desktop-specific hover functionality ---
    if (isDesktop) {
        cards.forEach((card, index) => {
            // Enable drag scrolling for desktop
            let isDown = false;
            let startX;
            let scrollLeft;

            card.addEventListener('mousedown', (e) => {
                isDown = true;
                bookCursor.style.transform = 'translate(-50%, -50%) rotate(45deg) scale(1.2)';
                startX = e.pageX - scrollContainer.offsetLeft;
                scrollLeft = scrollContainer.scrollLeft;
                e.preventDefault();
            });

            card.addEventListener('mouseleave', () => {
                isDown = false;
                if (!isHovering) {
                    bookCursor.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
                }
            });

            card.addEventListener('mouseup', () => {
                isDown = false;
                if (!isHovering) {
                    bookCursor.style.transform = 'translate(-50%, -50%) rotate(0deg) scale(1)';
                }
            });

            card.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - scrollContainer.offsetLeft;
                const walk = (x - startX) * 2;
                scrollContainer.scrollLeft = scrollLeft - walk;
                
                // Animate book while dragging
                bookCursor.style.transform = `translate(-50%, -50%) rotate(${45 + Math.sin(Date.now() * 0.01) * 10}deg) scale(1.2)`;
            });
        });
    }

    // --- Add CSS animations ---
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.08); }
            100% { transform: scale(1); }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes bookBounce {
            0%, 100% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
            25% { transform: translate(-50%, -50%) rotate(-10deg) scale(1.1); }
            75% { transform: translate(-50%, -50%) rotate(10deg) scale(1.1); }
        }
        
        .story-card {
            animation: slideIn 0.6s ease-out;
            animation-fill-mode: both;
            cursor: pointer !important;
        }
        
        .story-card:nth-child(1) { animation-delay: 0.1s; }
        .story-card:nth-child(2) { animation-delay: 0.2s; }
        .story-card:nth-child(3) { animation-delay: 0.3s; }
        .story-card:nth-child(4) { animation-delay: 0.4s; }
        .story-card:nth-child(5) { animation-delay: 0.5s; }
        .story-card:nth-child(6) { animation-delay: 0.6s; }
        .story-card:nth-child(7) { animation-delay: 0.7s; }
        
        .unmute-btn {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer !important;
        }
        
        .story-video {
            transition: filter 0.3s ease;
        }
        
        /* Keep default cursor visible on carousel elements */
        .stories-container,
        .stories-scroll,
        .story-card,
        .unmute-btn {
            cursor: auto !important;
        }
    `;
    document.head.appendChild(style);

    // --- Autoplay Logic ---

    const observerOptions = {
        root: scrollContainer,
        threshold: isDesktop ? 0.5 : 0.7 // Lower threshold for desktop
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const index = parseInt(entry.target.getAttribute('data-index'));
            const video = entry.target.querySelector('video');

            if (entry.isIntersecting) {
                // Determine the most visible card if multiple are intersecting
                // For simplicity, we'll just track the latest one that hit threshold
                if (activeIndex !== index) {
                    pauseAllVideos();
                    activeIndex = index;
                    if (!isDesktop) {
                        playVideo(video);
                    }
                }
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));

    function playVideo(video) {
        if (!video) return;
        // Ensure video is muted for autoplay
        video.muted = true;
        video.play().catch(e => console.log("Autoplay blocked:", e));
    }

    function pauseAllVideos() {
        videos.forEach(v => v.pause());
    }

// --- Unmute Logic ---

unmuteBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const video = videos[index];
        video.muted = !video.muted;
        btn.textContent = video.muted ? "UNMUTE 🔊" : "MUTE 🔇";
        
        // Book animation on mute/unmute
        bookCursor.innerHTML = video.muted ? '📖' : '📗';
        bookCursor.style.animation = 'bookBounce 0.5s ease-out';
        
        setTimeout(() => {
            bookCursor.innerHTML = '📖';
            bookCursor.style.animation = '';
        }, 500);
            btn.textContent = video.muted ? "UNMUTE 🔊" : "MUTE 🔇";
            
            // Book animation on mute/unmute
            bookCursor.innerHTML = video.muted ? '📖' : '📗';
            bookCursor.style.animation = 'bookBounce 0.5s ease-out';
            
            setTimeout(() => {
                bookCursor.innerHTML = '📖';
                bookCursor.style.animation = '';
            }, 500);
        });
    });

    // --- Progress Tracking ---

    scrollContainer.addEventListener('scroll', () => {
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const currentScroll = scrollContainer.scrollLeft;
        const percentage = (currentScroll / maxScroll) * 100;
        track.style.width = percentage + '%';
    });

    // Smooth horizontal wheel scroll while pointer is over testimonials.
    scrollContainer.addEventListener('wheel', (e) => {
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        if (delta === 0) return;
        e.preventDefault();
        scrollContainer.scrollBy({
            left: delta * 0.9,
            behavior: 'smooth'
        });
    }, { passive: false });

    // --- Handle window resize ---
    window.addEventListener('resize', () => {
        isDesktop = window.innerWidth >= 1025;
    });

    // Initial play if visible on page load
    // (IntersectionObserver handles this automatically)
});
