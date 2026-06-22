/**
 * AGREECULTURE TECH NIGERIA LTD - INTERACTIVE SCRIPTS
 * Features: Scroll Reveal & Copy-to-Clipboard Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initClipboardCopy();
    initParallaxGrid();
    initStaggeredReveals();
});

/**
 * Initializes scroll-triggered entrance animations using IntersectionObserver.
 * Falls back to direct visibility if IntersectionObserver is not supported or
 * if user prefers reduced motion.
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');
    
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        // Immediately reveal all elements
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -8% 0px', // trigger slightly before entering the screen fully
        threshold: 0.05 // trigger when 5% of the element is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing after reveal to prevent repetitive triggering
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Initializes Clipboard API triggers for copy buttons inside credentials section.
 * Handles tooltip animation and accessibility states.
 */
function initClipboardCopy() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            // Prevent default behavior if nested in links/forms
            e.preventDefault();
            e.stopPropagation();

            const textToCopy = button.getAttribute('data-copy');
            const tooltip = button.querySelector('.copy-tooltip');
            
            if (!textToCopy) return;

            try {
                // Clipboard API execution
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(textToCopy);
                } else {
                    // Fallback for older browsers / insecure contexts
                    const textArea = document.createElement('textarea');
                    textArea.value = textToCopy;
                    textArea.style.position = 'fixed'; // Avoid scrolling to bottom
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                }

                // Show success tooltip
                showCopyFeedback(button, tooltip, 'Copied!');
            } catch (err) {
                console.error('Failed to copy text: ', err);
                showCopyFeedback(button, tooltip, 'Failed');
            }
        });
    });
}

/**
 * Handles tooltip text lifecycle and styling during copy operation.
 * @param {HTMLButtonElement} button - The button element triggered
 * @param {HTMLSpanElement} tooltip - The tooltip tag to edit
 * @param {string} feedbackText - The text to display on success/failure
 */
function showCopyFeedback(button, tooltip, feedbackText) {
    if (!tooltip) return;

    // Save original text
    const originalText = tooltip.textContent || 'Copy';
    
    // Set feedback text and state
    tooltip.textContent = feedbackText;
    button.classList.add('copied');
    
    // Reset back to original text after timeout
    setTimeout(() => {
        tooltip.textContent = originalText;
        button.classList.remove('copied');
    }, 2000);
}

/**
 * Creates a subtle scroll-driven parallax background drift for the technical grid lines.
 */
function initParallaxGrid() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    window.addEventListener('scroll', () => {
        requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            const gridOverlay = document.querySelector('.grid-overlay');
            if (gridOverlay) {
                // Drift the grid slowly downward to create depth
                gridOverlay.style.transform = `translateY(${scrolled * 0.08}px)`;
            }
        });
    });
}

/**
 * Automatically assigns sequential layout entrance delays to child cards
 * and layout grid elements inside parent containers.
 */
function initStaggeredReveals() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Select container elements to stagger
    const containers = document.querySelectorAll('.credentials-grid, .products-container');
    
    containers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, index) => {
            // Apply stagger classes and incremental delays
            child.classList.add('reveal-child');
            child.style.transitionDelay = `${index * 0.08}s`;
        });
    });
}
