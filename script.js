/**
 * Alice Mancosu | UX Design Portfolio
 * Custom Script for Language Selection, Mobile Navigation, and Dropdowns
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Dual-Language Translation System
    // ==========================================================================
    const langEnBtn = document.getElementById('lang-en');
    const langItBtn = document.getElementById('lang-it');
    const translatableElements = document.querySelectorAll('.trn');
    
    /**
     * Set active website language
     * @param {string} lang - 'en' or 'it'
     */
    function setLanguage(lang) {
        // Update HTML lang attribute
        document.documentElement.setAttribute('lang', lang);
        
        // Update flag button active states
        if (lang === 'it') {
            langItBtn.classList.add('active');
            langEnBtn.classList.remove('active');
        } else {
            langEnBtn.classList.add('active');
            langItBtn.classList.remove('active');
        }
        
        // Translate all marked text elements
        translatableElements.forEach(el => {
            const translation = el.getAttribute(`data-${lang}`);
            if (translation) {
                // If element has a chevron (like the Projects dropdown), preserve it
                const chevron = el.querySelector('.chevron-icon');
                if (chevron) {
                    el.childNodes[0].textContent = translation + ' '; // Space before chevron
                } else {
                    el.textContent = translation;
                }
            }
        });
        
        // Save preference in localStorage
        localStorage.setItem('pref-lang', lang);
    }
    
    // Add Click Listeners to Flags
    langEnBtn.addEventListener('click', () => setLanguage('en'));
    langItBtn.addEventListener('click', () => setLanguage('it'));
    
    // Detect & Load Saved Language or Browser Default
    const savedLang = localStorage.getItem('pref-lang');
    const browserLang = navigator.language || navigator.userLanguage;
    const defaultLang = browserLang.startsWith('it') ? 'it' : 'en';
    
    setLanguage(savedLang || defaultLang);

    // ==========================================================================
    // 2. Mobile Responsive Navigation Drawer
    // ==========================================================================
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    const dropdownWrapper = document.querySelector('.dropdown');
    
    // Toggle Mobile Drawer Menu
    mobileNavToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileNavToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });
    
    // Close Drawer when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavToggle.classList.remove('open');
            navMenu.classList.remove('open');
            dropdownWrapper.classList.remove('open');
        });
    });
    
    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileNavToggle.contains(e.target)) {
            mobileNavToggle.classList.remove('open');
            navMenu.classList.remove('open');
            dropdownWrapper.classList.remove('open');
        }
    });

    // ==========================================================================
    // 3. Dropdown Menu on Mobile Touch Viewports
    // ==========================================================================
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    
    dropdownToggle.addEventListener('click', (e) => {
        // Toggle only on mobile devices (width <= 768px)
        if (window.innerWidth <= 768) {
            e.preventDefault(); // Prevent navigating to #projects anchor immediately
            e.stopPropagation();
            dropdownWrapper.classList.toggle('open');
        }
    });

    // ==========================================================================
    // 4. Scroll Spy - Active Nav Link Indicator
    // ==========================================================================
    const sections = document.querySelectorAll('main, section[id], header');
    const mainNavLinks = document.querySelectorAll('.nav-list > li > .nav-link');
    
    function scrollSpy() {
        const scrollPosition = window.scrollY + 100; // Offset for sticky header
        
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            
            if (scrollPosition >= top && scrollPosition < top + height) {
                mainNavLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    
                    if (href === `#${id}` || (id === 'home' && href === '#home')) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // Initial execution on load
});
