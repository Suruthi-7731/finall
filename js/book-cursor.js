/**
 * Default Cursor System
 * Removes custom cursors and restores default browser cursor
 */

// Initialize immediately to remove custom cursors
(function() {
    // Function to remove all custom cursor styles and elements
    function removeCustomCursors() {
        // Remove any custom cursor elements
        const customCursors = document.querySelectorAll('.pencil-cursor, .book-cursor, .custom-cursor');
        customCursors.forEach(cursor => cursor.remove());
        
        // Remove cursor hiding styles
        const cursorStyles = document.querySelectorAll('#hide-default-cursor, #pencil-cursor-styles, #book-cursor-styles, #restore-default-cursor');
        cursorStyles.forEach(style => style.remove());
        
        // Remove cursor-hide.css link if present
        const cursorHideLinks = document.querySelectorAll('link[href*="cursor-hide.css"]');
        cursorHideLinks.forEach(link => link.remove());
        
        // Add style to restore default cursor
        const restoreStyle = document.createElement('style');
        restoreStyle.id = 'restore-default-cursor';
        restoreStyle.textContent = `
            * {
                cursor: auto !important;
            }
            
            *:hover {
                cursor: auto !important;
            }
            
            *:active {
                cursor: auto !important;
            }
            
            *:focus {
                cursor: auto !important;
            }
            
            a {
                cursor: pointer !important;
            }
            
            button {
                cursor: pointer !important;
            }
            
            input, textarea {
                cursor: text !important;
            }
            
            select {
                cursor: pointer !important;
            }
            
            [style*="cursor"] {
                cursor: auto !important;
            }
        `;
        
        // Add to head
        if (document.head) {
            document.head.appendChild(restoreStyle);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.head.appendChild(restoreStyle);
            });
        }
    }
    
    // Remove custom cursors immediately
    removeCustomCursors();
    
    // Also remove when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', removeCustomCursors);
    
    // Remove on page navigation
    window.addEventListener('popstate', removeCustomCursors);
    
    // Remove periodically to catch any dynamically added cursors
    setInterval(removeCustomCursors, 1000);
    
    console.log('Custom cursors removed - default cursor restored');

    // Handle focus events (when window gains focus)
    window.addEventListener('focus', () => {
        hideDefaultCursor();
        isInitialized = false;
        setupInteractiveElements();
    });

    // Also check every second to ensure cursor is working
    setInterval(() => {
        if (!document.querySelector('.pencil-cursor')) {
            // Cursor was removed, recreate it
            const newCursor = document.createElement('div');
            newCursor.className = 'pencil-cursor';
            newCursor.innerHTML = '✏️';
            newCursor.style.cssText = `
                position: fixed;
                width: 45px;
                height: 45px;
                font-size: 35px;
                pointer-events: none;
                z-index: 99999;
                transition: transform 0.15s ease-out, opacity 0.3s ease, filter 0.3s ease;
                opacity: 1;
                transform: translate(-50%, -50%) rotate(-45deg);
                filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
                text-shadow: 0 0 10px ${theme.primary}40;
                left: 0px;
                top: 0px;
            `;
            if (document.body) {
                document.body.appendChild(newCursor);
                pencilCursor = newCursor;
                animateCursor();
            }
        } else {
            // Ensure cursor is visible
            const existingCursor = document.querySelector('.pencil-cursor');
            if (existingCursor && existingCursor.style.opacity === '0') {
                existingCursor.style.opacity = '1';
            }
        }
        hideDefaultCursor();
    }, 1000);

    // Console log for debugging
    console.log(`Pencil cursor initialized with ${theme.name} theme: ${theme.primary}, ${theme.secondary}`);

    // Cleanup function for page unload
    window.addEventListener('beforeunload', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        clearTimeout(navigationTimeout);
        clearTimeout(observerTimeout);
    });
    console.log('Custom cursors removed - default cursor restored');
})();
