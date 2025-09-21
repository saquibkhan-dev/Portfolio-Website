// DOM Elements
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const themeToggle = document.getElementById('themeToggle');
const typewriter = document.getElementById('typewriter');
const contactForm = document.getElementById('contactForm');
const scrollProgress = document.querySelector('.scroll-progress');

// Theme Management
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        // Check for saved theme preference or default to 'light'
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        // Add event listener for theme toggle
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle icon
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollListener();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveNavLink();
    }

    setupScrollListener() {
        window.addEventListener('scroll', () => {
            // Add scrolled class to navbar
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Update scroll progress
            this.updateScrollProgress();
        });
    }

    setupMobileMenu() {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle hamburger/close icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        // Close mobile menu when clicking on a link
        navLinks.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
            }
        });
    }

    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed header
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinkElements = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinkElements.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    }
}

// Typewriter Effect
class TypewriterEffect {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            // Pause at end
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex++;
            
            // Reset to first text if we've gone through all
            if (this.textIndex === this.texts.length) {
                this.textIndex = 0;
            }
            
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Animation Observer
class AnimationObserver {
    constructor() {
        this.init();
    }

    init() {
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements
        const elementsToAnimate = document.querySelectorAll(
            '.skill-category, .project-card, .timeline-item, .section-header'
        );

        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.init();
    }

    init() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validateForm(data)) {
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    validateForm(data) {
        const { name, email, message } = data;
        
        if (!name.trim()) {
            this.showMessage('Please enter your name.', 'error');
            return false;
        }
        
        if (!email.trim() || !this.isValidEmail(email)) {
            this.showMessage('Please enter a valid email address.', 'error');
            return false;
        }
        
        if (!message.trim()) {
            this.showMessage('Please enter a message.', 'error');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(text, type = 'info') {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const message = document.createElement('div');
        message.className = `form-message form-message-${type}`;
        message.textContent = text;
        
        // Style the message
        Object.assign(message.style, {
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            fontSize: '0.9rem',
            fontWeight: '500'
        });

        if (type === 'success') {
            message.style.background = '#dcfce7';
            message.style.color = '#166534';
            message.style.border = '1px solid #bbf7d0';
        } else if (type === 'error') {
            message.style.background = '#fef2f2';
            message.style.color = '#991b1b';
            message.style.border = '1px solid #fecaca';
        }

        // Insert message
        contactForm.insertBefore(message, contactForm.firstChild);

        // Remove message after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
            }
        });

        // Monitor scroll performance
        let scrolling = false;
        window.addEventListener('scroll', Utils.throttle(() => {
            if (!scrolling) {
                requestAnimationFrame(() => {
                    scrolling = false;
                });
                scrolling = true;
            }
        }, 16)); // ~60fps
    }
}

// Error Handler
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript Error:', e.error);
            // In production, you might want to send this to an error reporting service
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled Promise Rejection:', e.reason);
        });
    }
}

// Accessibility Features
class AccessibilityFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupFocusManagement();
        this.setupReducedMotion();
    }

    setupKeyboardNavigation() {
        // Allow keyboard navigation for custom interactive elements
        document.querySelectorAll('.project-card, .skill-category').forEach(element => {
            element.setAttribute('tabindex', '0');
            
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    element.click();
                }
            });
        });
    }

    setupFocusManagement() {
        // Trap focus in mobile menu when open
        const mobileMenu = document.getElementById('navLinks');
        const focusableElements = 'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select';
        
        mobileMenu.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && mobileMenu.classList.contains('active')) {
                const focusableContent = mobileMenu.querySelectorAll(focusableElements);
                const firstFocusableElement = focusableContent[0];
                const lastFocusableElement = focusableContent[focusableContent.length - 1];

                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    setupReducedMotion() {
        // Respect user's motion preferences
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.documentElement.style.setProperty('--animation-delay', '0.01ms');
        }
    }
}

// Initialize Application
class App {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    start() {
        try {
            // Initialize all managers and features
            new ThemeManager();
            new NavigationManager();
            new AnimationObserver();
            new FormHandler();
            new PerformanceMonitor();
            new ErrorHandler();
            new AccessibilityFeatures();

            // Initialize typewriter effect
            if (typewriter) {
                const texts = [
                    'Frontend Developer',
                    'React Enthusiast',
                    'Problem Solver',
                    'UI/UX Focused',
                    'JavaScript Developer'
                ];
                new TypewriterEffect(typewriter, texts, 100);
            }

            // Add loading class removal
            document.body.classList.remove('loading');

            console.log('Portfolio website initialized successfully! 🚀');

        } catch (error) {
            console.error('Error initializing application:', error);
        }
    }
}

// Additional Interactive Features
class InteractiveFeatures {
    constructor() {
        this.init();
    }

    init() {
        this.setupProjectCardHovers();
        this.setupSkillTagAnimations();
        this.setupParallaxEffect();
        this.setupEasterEgg();
    }

    setupProjectCardHovers() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateX(5deg)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0deg)';
            });
        });
    }

    setupSkillTagAnimations() {
        document.querySelectorAll('.skill-tag').forEach((tag, index) => {
            tag.style.animationDelay = `${index * 0.1}s`;
            
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'translateY(-3px) scale(1.05)';
            });

            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    setupParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.hero-image, .stats-card');
        
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            parallaxElements.forEach(element => {
                if (element.getBoundingClientRect().top < window.innerHeight) {
                    element.style.transform = `translate3d(0, ${rate}px, 0)`;
                }
            });
        }, 16));
    }

    setupEasterEgg() {
        let konamiCode = [];
        const sequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA

        document.addEventListener('keydown', (e) => {
            konamiCode.push(e.keyCode);
            
            if (konamiCode.length > sequence.length) {
                konamiCode.shift();
            }
            
            if (JSON.stringify(konamiCode) === JSON.stringify(sequence)) {
                this.activateEasterEgg();
                konamiCode = [];
            }
        });
    }

    activateEasterEgg() {
        // Create celebration effect
        const celebration = document.createElement('div');
        celebration.innerHTML = '🎉 You found the secret code! 🎉';
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--gradient);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            font-size: 1.5rem;
            font-weight: bold;
            text-align: center;
            z-index: 10000;
            animation: bounce 0.5s ease-in-out;
            box-shadow: var(--shadow-lg);
        `;

        document.body.appendChild(celebration);

        // Add confetti effect
        this.createConfetti();

        setTimeout(() => {
            celebration.remove();
        }, 3000);
    }

    createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}vw;
                top: -10px;
                border-radius: 50%;
                animation: confetti-fall ${2 + Math.random() * 3}s linear forwards;
                z-index: 9999;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 5000);
        }
    }
}

// Performance Optimization
class LazyLoader {
    constructor() {
        this.init();
    }

    init() {
        // Lazy load images
        if ('IntersectionObserver' in window) {
            this.setupLazyImages();
        }

        // Lazy load non-critical CSS
        this.loadNonCriticalCSS();
    }

    setupLazyImages() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    loadNonCriticalCSS() {
        // Load non-critical styles after page load
        window.addEventListener('load', () => {
            const nonCriticalCSS = [
                'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
            ];

            nonCriticalCSS.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                document.head.appendChild(link);
            });
        });
    }
}

// SEO and Analytics
class SEOAnalytics {
    constructor() {
        this.init();
    }

    init() {
        this.setupStructuredData();
        this.setupAnalytics();
        this.setupSocialSharing();
    }

    setupStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Saquib Khan",
            "jobTitle": "Frontend Developer",
            "description": "Aspiring Frontend Developer with hands-on training in React, JavaScript, and modern web technologies.",
            "url": window.location.origin,
            "sameAs": [
                "https://linkedin.com/in/saquib-java",
                "https://github.com/saquibkhan6392"
            ],
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Lucknow",
                "addressCountry": "India"
            },
            "email": "saquibkhanjava@gmail.com",
            "telephone": "+91 6392490847"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    setupAnalytics() {
        // Track page views and user interactions
        this.trackPageView();
        this.trackUserInteractions();
    }

    trackPageView() {
        // In production, you would use Google Analytics, Plausible, or similar
        console.log('Page view tracked:', window.location.pathname);
    }

    trackUserInteractions() {
        // Track important user interactions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn, .project-link, .social-link')) {
                console.log('User interaction:', e.target.textContent || e.target.className);
            }
        });

        // Track form submissions
        if (contactForm) {
            contactForm.addEventListener('submit', () => {
                console.log('Contact form submitted');
            });
        }
    }

    setupSocialSharing() {
        // Add dynamic social sharing
        const shareData = {
            title: 'Saquib Khan - Frontend Developer',
            text: 'Check out my portfolio showcasing React, JavaScript, and modern web development projects.',
            url: window.location.href
        };

        // Add share button if Web Share API is supported
        if (navigator.share) {
            const shareButton = document.createElement('button');
            shareButton.innerHTML = '<i class="fas fa-share-alt"></i> Share';
            shareButton.className = 'btn btn-secondary';
            shareButton.onclick = () => navigator.share(shareData);
            
            // Add to hero section
            const heroCTA = document.querySelector('.hero-cta');
            if (heroCTA) {
                heroCTA.appendChild(shareButton);
            }
        }
    }
}

// Service Worker Registration
class ServiceWorkerManager {
    constructor() {
        this.init();
    }

    init() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }
}

// Add dynamic CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes confetti-fall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }

    @keyframes bounce {
        0%, 20%, 53%, 80%, 100% {
            animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
            transform: translate(-50%, -50%) translate3d(0,0,0);
        }
        40%, 43% {
            animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
            transform: translate(-50%, -50%) translate3d(0, -30px, 0);
        }
        70% {
            animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
            transform: translate(-50%, -50%) translate3d(0, -15px, 0);
        }
        90% {
            transform: translate(-50%, -50%) translate3d(0,-4px,0);
        }
    }

    .loading {
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .loading.loaded {
        opacity: 1;
    }

    /* Add pulse animation for CTA buttons */
    .btn-primary {
        position: relative;
        overflow: hidden;
    }

    .btn-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
    }

    .btn-primary:hover::before {
        left: 100%;
    }

    /* Improved focus styles */
    .btn:focus-visible,
    .nav-link:focus-visible,
    .project-link:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
        border-radius: 4px;
    }
`;
document.head.appendChild(style);

// Initialize everything when DOM is ready
const app = new App();

// Initialize additional features
document.addEventListener('DOMContentLoaded', () => {
    new InteractiveFeatures();
    new LazyLoader();
    new SEOAnalytics();
    new ServiceWorkerManager();
});

// Export for potential external use
window.PortfolioApp = {
    App,
    ThemeManager,
    NavigationManager,
    TypewriterEffect,
    AnimationObserver,
    FormHandler,
    InteractiveFeatures,
    Utils
};