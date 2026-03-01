// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const body = document.body;
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        if (navMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = 'auto';
        }
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = 'auto';
            
            // Update active nav link
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.style.overflow = 'auto';
        }
    });
    
    // Set current year in footer
    const currentYear = new Date().getFullYear();
    document.getElementById('currentYear').textContent = currentYear;
    
    // Update active nav link on scroll
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', updateActiveNavLink);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                body.style.overflow = 'auto';
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Lazy loading for images (excluding video posters)
    const images = document.querySelectorAll('img:not(.hero-fallback)');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // triggers load if using lazy loading
                    imageObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Scroll animation observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.service-card, .gallery-item, .contact-item').forEach(el => {
        observer.observe(el);
    });
    
    updateActiveNavLink();
    
    // Hide loader on window load
    window.addEventListener('load', function() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
        }
    });
    
    // ========== GALLERY CAROUSEL ==========
    const carousel = document.getElementById('galleryCarousel');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dotsContainer = document.querySelector('.carousel-dots');
    const items = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;
    const itemCount = items.length;
    
    // Create dots
    items.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.dataset.index = index;
        dot.addEventListener('click', () => {
            scrollToIndex(index);
            updateDots(index);
        });
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot');
    updateDots(0);
    
    // Scroll event to update dots
    carousel.addEventListener('scroll', () => {
        const scrollLeft = carousel.scrollLeft;
        const itemWidth = items[0].offsetWidth + 20; // width + gap
        const index = Math.round(scrollLeft / itemWidth);
        if (index >= 0 && index < itemCount) {
            updateDots(index);
            currentIndex = index;
        }
    });
    
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            scrollToIndex(currentIndex - 1);
        } else {
            scrollToIndex(itemCount - 1);
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentIndex < itemCount - 1) {
            scrollToIndex(currentIndex + 1);
        } else {
            scrollToIndex(0);
        }
    });
    
    function scrollToIndex(index) {
        const itemWidth = items[0].offsetWidth + 20;
        carousel.scrollTo({
            left: index * itemWidth,
            behavior: 'smooth'
        });
        currentIndex = index;
        updateDots(index);
    }
    
    function updateDots(index) {
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // ========== LIGHTBOX (with touch swipe) ==========
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxContent = document.querySelector('.lightbox-content');
    let currentLightboxIndex = 0;
    
    // Touch variables for swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    function updateLightboxMedia(index) {
        const item = items[index];
        const type = item.dataset.type;
        
        lightboxContent.innerHTML = '';
        
        if (type === 'image') {
            const imgSrc = item.querySelector('img').src;
            const img = document.createElement('img');
            img.src = imgSrc;
            img.alt = '';
            lightboxContent.appendChild(img);
        } else {
            const videoSrc = item.querySelector('video source').src;
            const video = document.createElement('video');
            video.src = videoSrc;
            video.controls = true;
            video.autoplay = true;
            video.loop = false;
            video.muted = false;
            video.playsInline = true;
            video.style.maxWidth = '100%';
            video.style.maxHeight = '100%';
            lightboxContent.appendChild(video);
        }
    }
    
    // Open lightbox
    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentLightboxIndex = index;
            updateLightboxMedia(index);
            lightbox.classList.add('active');
            body.style.overflow = 'hidden';
        });
    });
    
    // Close
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        body.style.overflow = 'auto';
        const video = lightboxContent.querySelector('video');
        if (video) video.pause();
    });
    
    // Previous/Next buttons
    lightboxPrev.addEventListener('click', () => {
        currentLightboxIndex = (currentLightboxIndex - 1 + itemCount) % itemCount;
        updateLightboxMedia(currentLightboxIndex);
    });
    
    lightboxNext.addEventListener('click', () => {
        currentLightboxIndex = (currentLightboxIndex + 1) % itemCount;
        updateLightboxMedia(currentLightboxIndex);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') {
            lightbox.classList.remove('active');
            body.style.overflow = 'auto';
            const video = lightboxContent.querySelector('video');
            if (video) video.pause();
        } else if (e.key === 'ArrowLeft') {
            currentLightboxIndex = (currentLightboxIndex - 1 + itemCount) % itemCount;
            updateLightboxMedia(currentLightboxIndex);
        } else if (e.key === 'ArrowRight') {
            currentLightboxIndex = (currentLightboxIndex + 1) % itemCount;
            updateLightboxMedia(currentLightboxIndex);
        }
    });
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            body.style.overflow = 'auto';
            const video = lightboxContent.querySelector('video');
            if (video) video.pause();
        }
    });
    
    // Touch swipe for lightbox
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50; // minimum distance
        if (touchEndX < touchStartX - swipeThreshold) {
            // swipe left -> next
            currentLightboxIndex = (currentLightboxIndex + 1) % itemCount;
            updateLightboxMedia(currentLightboxIndex);
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // swipe right -> previous
            currentLightboxIndex = (currentLightboxIndex - 1 + itemCount) % itemCount;
            updateLightboxMedia(currentLightboxIndex);
        }
    }
});