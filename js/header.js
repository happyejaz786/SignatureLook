/**
 * Signature Look - Header Module
 * Features:
 * - Top-left Brand Logo placement ("Signature Look" | "Look Smart, Everyday..")
 * - Dynamic injection of Announcement Bar, Main Navbar & Mobile Drawer
 * - Mobile slide-out drawer with body scroll locking
 * - Sticky Glassmorphism transition on scroll
 * - Event-driven Cart counter and Drawer trigger
 */

(function () {
  'use strict';

  // Navigation Links Configuration
  const NAV_LINKS = [
    { title: 'Home', href: 'index.html', badge: '' },
    { title: 'Suit Sets', href: '#suit-sets', badge: '' },
    { title: 'Farshi Gharara', href: '#farshi', badge: 'Popular' },
    { title: 'Co-ord Sets', href: '#coord-sets', badge: '' },
    { title: 'Velvet Edit', href: '#velvet', badge: 'New' },
    { title: 'Sale', href: '#sale', badge: 'Up to 40% Off' }
  ];

  // Store Meta & Branding Configuration
  const STORE_META = {
    brandName: 'Signature Look',
    brandTagline: 'Look Smart, Everyday..',
    announcement: '✨ Flat 10% Off on First Order | Code: FIRST10 | Free Pan-India Delivery ✨',
    supportNumber: '+91 98765 43210'
  };

  /**
   * Generates HTML template for the entire header suite with Top-Left logo
   */
  function createHeaderTemplate() {
    const navItemsDesktop = NAV_LINKS.map(link => `
      <li class="nav-item">
        <a href="${link.href}" class="nav-link">
          ${link.title}
          ${link.badge ? `<span class="nav-badge">${link.badge}</span>` : ''}
        </a>
      </li>
    `).join('');

    const navItemsMobile = NAV_LINKS.map(link => `
      <li class="drawer-nav-item">
        <a href="${link.href}" class="drawer-nav-link">
          <span>${link.title}</span>
          ${link.badge ? `<span class="drawer-badge">${link.badge}</span>` : ''}
        </a>
      </li>
    `).join('');

    return `
      <!-- Top Announcement Bar -->
      <aside class="announcement-bar" role="region" aria-label="Announcement">
        <div class="announcement-content">
          <span>${STORE_META.announcement}</span>
        </div>
      </aside>

      <!-- Main Sticky Navigation Bar -->
      <header class="main-header" id="site-main-header">
        <div class="header-inner container">
          
          <!-- Top-Left Branding & Mobile Trigger Section -->
          <div class="header-left">
            <button class="icon-btn mobile-only" id="mobile-menu-toggle" aria-label="Open mobile menu" aria-expanded="false">
              <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <!-- Brand Logo (Placed at Top-Left) -->
            <div class="brand-logo-wrap">
              <a href="index.html" class="brand-logo" aria-label="${STORE_META.brandName} Home">
                <span class="brand-title">${STORE_META.brandName}</span>
                <span class="brand-subtitle">${STORE_META.brandTagline}</span>
              </a>
            </div>
          </div>

          <!-- Center: Desktop Navigation -->
          <nav class="desktop-navigation desktop-only" aria-label="Primary Navigation">
            <ul class="nav-list">
              ${navItemsDesktop}
            </ul>
          </nav>

          <!-- Right: Action Utilities -->
          <div class="header-right action-tools">
            <button class="icon-btn search-trigger" id="site-search-btn" aria-label="Search collection">
              <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            <button class="icon-btn cart-trigger" id="header-cart-btn" aria-label="View shopping bag">
              <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span class="cart-counter-badge" id="header-cart-count">0</span>
            </button>
          </div>

        </div>
      </header>

      <!-- Mobile Drawer Backdrop Overlay -->
      <div class="drawer-overlay" id="mobile-drawer-overlay" aria-hidden="true"></div>

      <!-- Off-Canvas Mobile Drawer -->
      <aside class="mobile-drawer" id="mobile-drawer" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
        <div class="drawer-container">
          
          <div class="drawer-header">
            <div class="drawer-brand">
              <span class="drawer-brand-title">${STORE_META.brandName}</span>
              <span class="drawer-brand-tagline">${STORE_META.brandTagline}</span>
            </div>
            <button class="icon-btn drawer-close-btn" id="mobile-drawer-close" aria-label="Close menu">
              <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="drawer-body">
            <ul class="drawer-nav-list">
              ${navItemsMobile}
            </ul>
          </div>

          <div class="drawer-footer">
            <div class="drawer-support-box">
              <span class="support-label">Customer Concierge:</span>
              <a href="tel:${STORE_META.supportNumber.replace(/\s+/g, '')}" class="support-phone">${STORE_META.supportNumber}</a>
            </div>
            <p class="drawer-copyright">© ${new Date().getFullYear()} ${STORE_META.brandName}</p>
          </div>

        </div>
      </aside>
    `;
  }

  /**
   * Initializes functional interactions, events, and lifecycle hooks
   */
  function initHeaderLogic() {
    const mainHeader = document.getElementById('site-main-header');
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const menuClose = document.getElementById('mobile-drawer-close');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    const cartBtn = document.getElementById('header-cart-btn');
    const cartCountBadge = document.getElementById('header-cart-count');

    // 1. Mobile Drawer Control Logic
    function openDrawer() {
      drawer.classList.add('is-open');
      overlay.classList.add('is-visible');
      drawer.setAttribute('aria-hidden', 'false');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('no-scroll');
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      drawer.setAttribute('aria-hidden', 'true');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('no-scroll');
    }

    if (menuToggle) menuToggle.addEventListener('click', openDrawer);
    if (menuClose) menuClose.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    // Close drawer when any nav link is tapped
    const mobileLinks = drawer.querySelectorAll('.drawer-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // 2. Sticky Navbar Glassmorphism on Scroll
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 40) {
        mainHeader.classList.add('header-scrolled');
      } else {
        mainHeader.classList.remove('header-scrolled');
      }
      lastScrollY = currentScroll;
    }, { passive: true });

    // 3. Cart Trigger Integration (Dispatches custom event to cart.js)
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('toggle-cart-drawer'));
      });
    }

    // 4. Global API for cart.js to update the item badge count
    window.updateHeaderCartCount = function (count) {
      if (!cartCountBadge) return;
      const parsedCount = parseInt(count, 10) || 0;
      cartCountBadge.textContent = parsedCount;
      if (parsedCount > 0) {
        cartCountBadge.classList.add('has-items');
      } else {
        cartCountBadge.classList.remove('has-items');
      }
    };
  }

  /**
   * Mount function called on DOM Ready
   */
  function mountHeader() {
    const container = document.getElementById('header-container');
    if (!container) {
      console.error('[header.js] Target element "#header-container" not found.');
      return;
    }
    container.innerHTML = createHeaderTemplate();
    initHeaderLogic();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountHeader);
  } else {
    mountHeader();
  }

})();