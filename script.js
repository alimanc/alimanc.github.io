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
    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileNavToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
        });
    }

    // Close Drawer when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileNavToggle) mobileNavToggle.classList.remove('open');
            if (navMenu) navMenu.classList.remove('open');
            if (dropdownWrapper) dropdownWrapper.classList.remove('open');
        });
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (navMenu && mobileNavToggle && dropdownWrapper) {
            if (!navMenu.contains(e.target) && !mobileNavToggle.contains(e.target)) {
                mobileNavToggle.classList.remove('open');
                navMenu.classList.remove('open');
                dropdownWrapper.classList.remove('open');
            }
        }
    });

    // ==========================================================================
    // 3. Dropdown Menu on Mobile Touch Viewports
    // ==========================================================================
    const dropdownToggle = document.querySelector('.dropdown-toggle');

    if (dropdownToggle && dropdownWrapper) {
        dropdownToggle.addEventListener('click', (e) => {
            // Toggle only on mobile devices (width <= 768px)
            if (window.innerWidth <= 768) {
                e.preventDefault(); // Prevent navigating to #projects anchor immediately
                e.stopPropagation();
                dropdownWrapper.classList.toggle('open');
            }
        });
    }

    // ==========================================================================
    // 5. Plant of the Day — Wikipedia Integration
    // ==========================================================================
    const PLANT_LINKS = [
        "https://en.wikipedia.org/wiki/Acacia_pycnantha",
        "https://en.wikipedia.org/wiki/Adenanthos_cuneatus",
        "https://en.wikipedia.org/wiki/Adenanthos_obovatus",
        "https://en.wikipedia.org/wiki/Adiantum_viridimontanum",
        "https://en.wikipedia.org/wiki/Ailanthus_altissima",
        "https://en.wikipedia.org/wiki/Alloxylon_flammeum",
        "https://en.wikipedia.org/wiki/Alloxylon_pinnatum",
        "https://en.wikipedia.org/wiki/Banksia_cuneata",
        "https://en.wikipedia.org/wiki/Banksia_integrifolia",
        "https://en.wikipedia.org/wiki/Banksia_menziesii",
        "https://en.wikipedia.org/wiki/Banksia_paludosa",
        "https://en.wikipedia.org/wiki/Banksia_sessilis",
        "https://en.wikipedia.org/wiki/Banksia_aculeata",
        "https://en.wikipedia.org/wiki/Banksia_aemula",
        "https://en.wikipedia.org/wiki/Banksia_aquilonia",
        "https://en.wikipedia.org/wiki/Banksia_attenuata",
        "https://en.wikipedia.org/wiki/Banksia_blechnifolia",
        "https://en.wikipedia.org/wiki/Banksia_brownii",
        "https://en.wikipedia.org/wiki/Brachychiton_rupestris",
        "https://en.wikipedia.org/wiki/Dracophyllum_fiordense",
        "https://en.wikipedia.org/wiki/Drosera_regia",
        "https://en.wikipedia.org/wiki/Epacris_impressa",
        "https://en.wikipedia.org/wiki/Ficus_aurea",
        "https://en.wikipedia.org/wiki/Ficus_macrophylla",
        "https://en.wikipedia.org/wiki/Grevillea_juniperina",
        "https://en.wikipedia.org/wiki/Hypericum_sechmenii",
        "https://en.wikipedia.org/wiki/Isopogon_anemonifolius",
        "https://en.wikipedia.org/wiki/Lambertia_formosa",
        "https://en.wikipedia.org/wiki/Metrosideros_bartlettii",
        "https://en.wikipedia.org/wiki/Persoonia_lanceolata",
        "https://en.wikipedia.org/wiki/Pinguicula_moranensis"
    ];

    function getDayOfMonth() {
        return new Date().getDate();
    }

    async function loadPlantPost() {
        const plantsText = document.getElementById('plants-text');
        const plantsTitle = document.getElementById('plants-title');
        const plantsDesc = document.getElementById('plants-desc');
        const plantsCard = document.getElementById('plants-card');
        const plantsThumb = document.getElementById('plants-thumbnail');
        const plantsSubtitle = document.getElementById('plants-subtitle');

        try {
            const dayOfMonth = getDayOfMonth();
            const plantUrl = PLANT_LINKS[dayOfMonth - 1];
            const plantSlug = plantUrl.replace('https://en.wikipedia.org/wiki/', '');
            console.log(`[Plant of the Day] Day ${dayOfMonth}: ${plantSlug}`);

            const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(plantSlug)}`);
            if (!res.ok) throw new Error(`Article API returned ${res.status}`);
            const data = await res.json();

            if (plantsText) plantsText.textContent = `Todays featured plant is:`;
            if (plantsTitle) plantsTitle.textContent = data.title;
            if (plantsDesc) plantsDesc.textContent = data.extract;
            if (plantsSubtitle) {
                plantsSubtitle.textContent = data.description || '';
                plantsSubtitle.style.display = data.description ? 'block' : 'none';
            }
            if (plantsCard) plantsCard.href = plantUrl;

            if (plantsThumb && data.thumbnail?.source) {
                plantsThumb.src = data.thumbnail.source;
                plantsThumb.alt = data.title;
                plantsThumb.style.display = 'block';

                // After image loads, resize container and card to match image height
                plantsThumb.onload = () => {
                    const imgHeight = plantsThumb.offsetHeight;
                    const imgWidth = plantsThumb.offsetWidth;
                    const tweetCard = plantsThumb.closest('.tweet-card');
                    const isMobile = window.innerWidth <= 420;

                    if (tweetCard) {
                        if (isMobile) {
                            // Mobile: both image and text sections are square
                            tweetCard.style.height = 'unset';
                        } else {
                            tweetCard.style.height = imgHeight + 'px';
                        }
                    }
                    plantsThumb.parentElement.style.height = imgHeight + 'px';

                    // On mobile, info section is also square (same as image width)
                    if (isMobile) {
                        const infoEl = document.querySelector('#plants-card .tweet-card-info');
                        if (infoEl) {
                            infoEl.style.maxHeight = imgWidth + 'px';
                        }
                    }

                    // Dynamically clamp description to fit available space
                    const textAreaHeight = isMobile ? imgWidth : imgHeight;
                    const lineHeight = 12.8;
                    const maxLines = Math.max(2, Math.floor((textAreaHeight - 60) / lineHeight));
                    plantsDesc.style.webkitLineClamp = maxLines;
                    plantsDesc.style.display = '-webkit-box';
                    plantsDesc.style.webkitBoxOrient = 'vertical';
                    plantsDesc.style.overflow = 'hidden';
                };
            }
            console.log('[Plant of the Day] Loaded:', data.title);
        } catch (err) {
            console.error('[Plant of the Day] Failed:', err.message, err.stack);
            console.warn('[Plant of the Day] Check: 1) Hard refresh (Ctrl+Shift+R), 2) Open F12 Console for details');
            if (plantsText) plantsText.textContent = `Todays featured plant is:`;
            if (plantsTitle) plantsTitle.textContent = 'Acacia pycnantha';
            if (plantsDesc) plantsDesc.textContent = 'A fascinating plant worth exploring on Wikipedia.';
            if (plantsSubtitle) plantsSubtitle.style.display = 'none';
            if (plantsCard) plantsCard.href = PLANT_LINKS[0];
        }
    }

    // ==========================================================================
    // 6. Profile Tabs — Summary / Skills / History
    // ==========================================================================
    const profileTabs = document.querySelectorAll('.profile-tab');
    const profilePanels = document.querySelectorAll('.profile-tab-panel');

    profileTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');
            profileTabs.forEach(t => t.classList.remove('active'));
            profilePanels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.querySelector(`.profile-tab-panel[data-panel="${target}"]`).classList.add('active');
        });
    });

    loadPlantPost();

    // ==========================================================================
    // 7. Sidebar Nav — Active State Switching
    // ==========================================================================
    const sidebarNavItems = document.querySelectorAll('.sidebar-nav-item');

    sidebarNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            sidebarNavItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // ==========================================================================
    // 8. Scroll Spy — IntersectionObserver on Content Sections
    // ==========================================================================
    const sidebarNavLinks = document.querySelectorAll('.sidebar-nav-item');
    const sectionIds = ['home', 'projects', 'profile'];

    // Collect observable sections, skipping any that don't exist
    const sections = sectionIds
        .map(id => document.getElementById(id))
        .filter(el => el !== null);

    // Build a map from section id to its matching nav link
    // (skips nav links with no matching section and sections with no matching nav link)
    const navMap = {};
    sidebarNavLinks.forEach(link => {
        const href = link.getAttribute('href').replace('#', '');
        if (sectionIds.includes(href)) {
            navMap[href] = link;
        }
    });

    // Thin trigger band at the vertical middle of the viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const sectionId = entry.target.id;
            const matchedLink = navMap[sectionId];
            if (!matchedLink) return; // skip sections with no matching nav link

            sidebarNavLinks.forEach(link => link.classList.remove('active'));
            matchedLink.classList.add('active');
        });
    }, {
        root: null, // viewport — correct whether content scrolls in window or container
        rootMargin: '-45% 0px -45% 0px', // thin band at vertical middle (45%–55%)
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
});
