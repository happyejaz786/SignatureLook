/**
 * Signature Look - Footer Module
 * Features:
 * - Dynamic injection into #footer-container
 * - Visitor Hit Counter tracking via localStorage ('signature_hit_count')
 * - Footer Show / Hide toggle logic with state persistence
 * - Newsletter subscription handler
 * - Floating trigger button for quick footer toggle during testing
 */

(function () {
  'use strict';

  const HIT_STORAGE_KEY = 'signature_hit_count';
  const FOOTER_VISIBILITY_KEY = 'signature_footer_visible';

  /**
   * Tracks and increments visitor hits
   */
  function getAndUpdateHitCount() {
    let currentHits = parseInt(localStorage.getItem(HIT_STORAGE_KEY), 10);
    if (isNaN(currentHits) || currentHits < 1) {
      currentHits = 0; // Professional baseline starting count
    } else {
      currentHits += 1;
    }
    try {
      localStorage.setItem(HIT_STORAGE_KEY, currentHits.toString());
    } catch (e) {
      console.warn('[footer.js] Storage access restricted:', e);
    }
    return currentHits;
  }

  /**
   * Generates Footer HTML Template
   */
  function createFooterTemplate(hitCount) {
    return `
      <!-- Floating Quick Toggle for Testing (Bottom-Left) -->
      <button class="footer-float-toggle" id="footer-toggle-btn" title="Toggle Footer Visibility" aria-label="Toggle Footer Visibility">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
        <span class="toggle-text">Footer</span>
      </button>

      <!-- Main Footer Wrapper -->
      <footer class="site-main-footer" id="site-footer-element">
        
        <!-- Newsletter Strip -->
        <div class="footer-newsletter-strip">
          <div class="container newsletter-inner">
            <div class="newsletter-text">
              <h3 class="newsletter-title">Join The Signature Circle</h3>
              <p class="newsletter-subtitle">Receive exclusive previews of new bridal curations and private salon events.</p>
            </div>
            <form class="newsletter-form" id="newsletter-form" onsubmit="event.preventDefault();">
              <input type="email" class="newsletter-input" id="newsletter-email" placeholder="Enter your email address" required />
              <button type="submit" class="newsletter-submit-btn">Subscribe</button>
            </form>
          </div>
        </div>

        <!-- 4-Column Directory Grid -->
        <div class="footer-main-directory container">
          
          <!-- Column 1: Brand Info -->
          <div class="footer-col brand-col">
            <div class="footer-brand">
              <span class="footer-brand-title">SIGNATURE LOOK</span>
              <span class="footer-brand-subtitle">Look Smart, Everyday..</span>
            </div>
            <p class="footer-about-text">
              Curating high-end ethnic silhouettes, royal farshi ghararas, and everyday contemporary couture crafted with timeless Indian artistry.
            </p>
            <div class="footer-social-links">
              <a href="#" class="social-icon-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" class="social-icon-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" class="social-icon-btn" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
            </div>
          </div>

          <!-- Column 2: Collections -->
          <div class="footer-col">
            <h4 class="footer-col-title">Collections</h4>
            <ul class="footer-links-list">
              <li><a href="#suit-sets">Handcrafted Suit Sets</a></li>
              <li><a href="#farshi">Royal Farshi Gharara</a></li>
              <li><a href="#coord-sets">Linen & Silk Co-ords</a></li>
              <li><a href="#velvet">Winter Velvet Edit</a></li>
              <li><a href="#dupatta">Organza Dupattas</a></li>
            </ul>
          </div>

          <!-- Column 3: Customer Care -->
          <div class="footer-col">
            <h4 class="footer-col-title">Customer Care</h4>
            <ul class="footer-links-list">
              <li><a href="#">Size & Fit Guide</a></li>
              <li><a href="#">Shipping & Delivery</a></li>
              <li><a href="#">Returns & Exchanges</a></li>
              <li><a href="#">Track Your Order</a></li>
              <li><a href="#">Contact Concierge</a></li>
            </ul>
          </div>

          <!-- Column 4: Contact & Studio -->
          <div class="footer-col">
            <h4 class="footer-col-title">Boutique Studio</h4>
            <p class="footer-contact-item"><strong>Studio:</strong> Heritage Market, Shahjahanpur, UP, India</p>
            <p class="footer-contact-item"><strong>Direct Support:</strong> +91 98765 43210</p>
            <p class="footer-contact-item"><strong>Email:</strong> care@signaturelook.com</p>
            <p class="footer-contact-item"><strong>Hours:</strong> Mon - Sat (10:00 AM - 8:00 PM)</p>
          </div>

        </div>

        <!-- Bottom Copyright & Live Hit Counter Bar -->
        <div class="footer-bottom-bar">
          <div class="container footer-bottom-inner">
            <p class="footer-copy-text">
              © ${new Date().getFullYear()} Signature Look. All rights reserved. Look Smart, Everyday..
            </p>

            <!-- Real-time Hit Counter Badge -->
            <div class="footer-hit-counter" title="Total Store Visits">
              <span class="hit-indicator-dot"></span>
              <span class="hit-label">Visits:</span>
              <span class="hit-number" id="footer-hit-val">${hitCount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

      </footer>
    `;
  }

  /**
   * Initializes interactions, toggle logic, and form actions
   */
  function initFooterLogic() {
    const footerElement = document.getElementById('site-footer-element');
    const toggleBtn = document.getElementById('footer-toggle-btn');
    const newsletterForm = document.getElementById('newsletter-form');

    // 1. Footer Show / Hide Logic
    function applyFooterVisibility(isVisible) {
      if (!footerElement) return;
      if (isVisible) {
        footerElement.classList.remove('is-hidden');
        if (toggleBtn) {
          toggleBtn.classList.remove('is-collapsed');
          toggleBtn.title = 'Hide Footer';
        }
      } else {
        footerElement.classList.add('is-hidden');
        if (toggleBtn) {
          toggleBtn.classList.add('is-collapsed');
          toggleBtn.title = 'Show Footer';
        }
      }
    }

    // Load saved visibility state (default: visible)
    const savedState = localStorage.getItem(FOOTER_VISIBILITY_KEY);
    const isInitiallyVisible = savedState === null ? true : savedState === 'true';
    applyFooterVisibility(isInitiallyVisible);

    // Toggle button click listener
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentlyHidden = footerElement.classList.contains('is-hidden');
        const newState = currentlyHidden; // If hidden, make visible; if visible, hide
        applyFooterVisibility(newState);
        try {
          localStorage.setItem(FOOTER_VISIBILITY_KEY, newState.toString());
        } catch (e) {}
      });
    }

    // Expose global function for developer console or testing
    window.toggleFooterVisibility = function () {
      if (toggleBtn) toggleBtn.click();
    };

    // 2. Newsletter Submit feedback
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', () => {
        const input = document.getElementById('newsletter-email');
        if (input && input.value) {
          alert('Thank you for subscribing to Signature Look updates!');
          input.value = '';
        }
      });
    }
  }

  /**
   * Mount footer into target DOM container
   */
  function mountFooter() {
    const container = document.getElementById('footer-container');
    if (!container) return;

    const hitCount = getAndUpdateHitCount();
    container.innerHTML = createFooterTemplate(hitCount);
    initFooterLogic();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFooter);
  } else {
    mountFooter();
  }

})();