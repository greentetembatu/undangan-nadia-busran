document.addEventListener('DOMContentLoaded', () => {
    // --- Parallax for Main Sections Background ---
    const mainSections = document.querySelectorAll('.main-section');

    function applySectionParallax() {
        mainSections.forEach(section => {
            const speed = 0.05; // Adjust this value for more or less parallax effect
            const offset = window.pageYOffset;
            const yPos = -(offset * speed);
            section.style.backgroundPositionY = `${yPos}px`;
        });
    }

    // Call parallax on scroll if main content is visible
    window.addEventListener('scroll', () => {
        if (!document.getElementById('landingOverlay').classList.contains('hidden')) {
            return; // Don't apply parallax if overlay is still visible
        }
        applySectionParallax();
    });

    // Initial call to set background position
    applySectionParallax();


    // --- Parallax for Gallery Images (Horizontal Scroll) ---
    const galleryWrapper = document.querySelector('.parallax-gallery-wrapper');
    const galleryItems = document.querySelectorAll('.parallax-item');

    if (galleryWrapper && galleryItems.length > 0) {
        galleryWrapper.addEventListener('scroll', () => {
            const scrollLeft = galleryWrapper.scrollLeft;

            galleryItems.forEach(item => {
                const speed = parseFloat(item.dataset.parallaxSpeed) || 0.2; // Get speed from data-parallax-speed
                const xPos = scrollLeft * speed;
                item.style.transform = `translateX(${-xPos}px)`;
            });
        });
    }
});
