
(function () {
    // Get all sections and controls
    const sections = document.querySelectorAll('.section');
    const controls = document.querySelectorAll('.control');

    // Define the order of sections
    const sectionOrder = ['home', 'about', 'projects', 'contact'];

    // Create navigation progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'navigation-progress';
    progressBar.innerHTML = '<div class="navigation-progress-bar"></div>';
    document.body.appendChild(progressBar);

    // Create section transition overlay
    const sectionOverlay = document.createElement('div');
    sectionOverlay.className = 'section-overlay';
    document.body.appendChild(sectionOverlay);

    // Function to update progress bar
    function updateProgressBar(currentSectionId) {
        const currentIndex = sectionOrder.indexOf(currentSectionId);
        const progress = ((currentIndex + 1) / sectionOrder.length) * 100;
        const progressBarElement = document.querySelector('.navigation-progress-bar');
        progressBarElement.style.width = `${progress}%`;
    }

    // Function to show transition overlay
    function showTransitionOverlay() {
        sectionOverlay.classList.add('active');
        setTimeout(() => {
            sectionOverlay.classList.remove('active');
        }, 300);
    }

    // Function to navigate to a specific section
    function navigateToSection(sectionId) {
        // Show transition overlay
        showTransitionOverlay();

        // Remove active classes
        document.querySelector('.active-btn').classList.remove('active-btn');
        document.querySelector('.active').classList.remove('active');

        // Add active classes to the target section and control
        document.getElementById(sectionId).classList.add('active');
        document.querySelector(`[data-id="${sectionId}"]`).classList.add('active-btn');

        // Update progress bar
        updateProgressBar(sectionId);

        // Remove bottom indicator
        removeBottomIndicator();

        // If navigating to home, show indicator after a delay (desktop only)
        if (sectionId === 'home' && !isMobileDevice()) {
            setTimeout(() => {
                addBottomIndicator();
            }, 2000); // Show after 2 seconds
        }

        // If navigating to about, check if we should show indicator (desktop only)
        if (sectionId === 'about' && !isMobileDevice()) {
            setTimeout(() => {
                const aboutSection = document.getElementById('about');
                const sectionRect = aboutSection.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // If about section content is taller than viewport, show indicator
                if (sectionRect.height > windowHeight) {
                    addBottomIndicator();
                }
            }, 500);
        }

        // Add entrance animation to the new section
        const newSection = document.getElementById(sectionId);
        newSection.style.animation = 'none';
        setTimeout(() => {
            newSection.style.animation = 'appear 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 10);
    }

    // Function to get next section
    function getNextSection(currentSectionId) {
        const currentIndex = sectionOrder.indexOf(currentSectionId);
        const nextIndex = (currentIndex + 1) % sectionOrder.length;
        return sectionOrder[nextIndex];
    }

    // Function to get previous section
    function getPreviousSection(currentSectionId) {
        const currentIndex = sectionOrder.indexOf(currentSectionId);
        const prevIndex = currentIndex === 0 ? sectionOrder.length - 1 : currentIndex - 1;
        return sectionOrder[prevIndex];
    }

    // Function to add bottom indicator
    function addBottomIndicator() {
        if (document.querySelector('.bottom-indicator')) return;

        const indicator = document.createElement('div');
        indicator.className = 'bottom-indicator';
        indicator.innerHTML = '<i class="fas fa-chevron-down"></i><span>Click to continue</span>';
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateX(-50%) translateY(20px)';

        document.body.appendChild(indicator);

        // Add entrance animation
        setTimeout(() => {
            indicator.style.opacity = '1';
            indicator.style.transform = 'translateX(-50%) translateY(0)';
        }, 100);
    }

    // Function to remove bottom indicator
    function removeBottomIndicator() {
        const indicator = document.querySelector('.bottom-indicator');
        if (indicator) {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(() => {
                indicator.remove();
            }, 300);
        }
    }

    // Add click event listeners to controls
    controls.forEach(btn => {
        btn.addEventListener('click', function () {
            // Add click feedback
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            navigateToSection(this.dataset.id);
        });
    });

    // Variables for bottom detection
    let isAtBottom = false;
    let isNavigating = false;

    // Function to check if at bottom of section
    function checkIfAtBottom() {
        const activeSection = document.querySelector('.section.active');
        if (!activeSection) return false;

        // Special handling for home section (always show indicator)
        if (activeSection.id === 'home') {
            return true;
        }

        // Special handling for about section (check if scrolled to bottom)
        if (activeSection.id === 'about') {
            const sectionRect = activeSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if we're at the bottom of the about section
            return sectionRect.bottom <= windowHeight + 100; // 100px threshold for about section
        }

        const sectionRect = activeSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if we're at the bottom of the current section
        return sectionRect.bottom <= windowHeight + 150; // 150px threshold
    }

    // Function to check if device is mobile
    function isMobileDevice() {
        return window.innerWidth <= 600;
    }

    // Add scroll event listener to detect when at bottom
    window.addEventListener('scroll', function () {
        if (isNavigating) return;

        const atBottom = checkIfAtBottom();

        if (atBottom && !isAtBottom) {
            isAtBottom = true;
            // Only show indicator on desktop
            if (!isMobileDevice()) {
                addBottomIndicator();
            }
        } else if (!atBottom && isAtBottom) {
            isAtBottom = false;
            if (!isMobileDevice()) {
                removeBottomIndicator();
            }
        }
    });

    // Add click event listener for navigation when at bottom (desktop only)
    document.addEventListener('click', function (e) {
        // Don't trigger if clicking on controls, theme button, or links
        if (e.target.closest('.controlls') ||
            e.target.closest('.theme-btn') ||
            e.target.closest('a') ||
            e.target.closest('button') ||
            e.target.closest('input') ||
            e.target.closest('textarea')) {
            return;
        }

        // Only handle click navigation on desktop (not mobile)
        if (isAtBottom && !isNavigating && !isMobileDevice()) {
            const activeSection = document.querySelector('.section.active');
            if (!activeSection) return;

            const currentSectionId = activeSection.id;
            const nextSectionId = getNextSection(currentSectionId);

            isNavigating = true;

            // Add click feedback to indicator
            const indicator = document.querySelector('.bottom-indicator');
            if (indicator) {
                indicator.style.transform = 'translateX(-50%) scale(0.9)';
            }

            // Navigate to next section
            setTimeout(() => {
                navigateToSection(nextSectionId);
                isNavigating = false;
                isAtBottom = false;
            }, 300);
        }
    });

    // Initialize: Show indicator on home page after a delay and set initial progress
    setTimeout(() => {
        const activeSection = document.querySelector('.section.active');
        if (activeSection && activeSection.id === 'home') {
            isAtBottom = true;
            // Only show indicator on desktop
            if (!isMobileDevice()) {
                addBottomIndicator();
            }
        }
        updateProgressBar(activeSection ? activeSection.id : 'home');
    }, 2000);

    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Handle window resize (device rotation, etc.)
    window.addEventListener('resize', function () {
        // Reset navigation state when screen size changes
        isAtBottom = false;
        isNavigating = false;

        // Remove any existing indicator
        removeBottomIndicator();

        // Re-check if we should show indicator or auto-navigate
        setTimeout(() => {
            const atBottom = checkIfAtBottom();
            if (atBottom) {
                isAtBottom = true;
                if (!isMobileDevice()) {
                    addBottomIndicator();
                }
            }
        }, 100);
    });

    // Debug: Log navigation events
    console.log('Navigation system initialized');

})();

document.querySelector('.theme-btn').addEventListener('click', () => {
    console.log('hello...');
    document.body.classList.toggle('theme-change');

    // Add click feedback
    const themeBtn = document.querySelector('.theme-btn');
    themeBtn.style.transform = 'scale(0.9) rotate(90deg)';
    setTimeout(() => {
        themeBtn.style.transform = '';
    }, 300);
});