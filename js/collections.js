/**
 * Begum Boutique - Collections Module
 * Features:
 * - Dynamic injection into #collections-container
 * - Native touch-swipe support for mobile devices
 * - Desktop click-and-drag mouse scrolling
 * - Arrow navigation buttons (Auto-disable when at edges)
 * - Click filtering trigger to communicate with home.js
 */

(function () {
  'use strict';

  // Category Configuration (Images with royalty-free ethnic couture aesthetics)
  const COLLECTIONS_DATA = [
    {
      id: 'suit-sets',
      title: 'Suit Sets',
      tagline: 'Pure Chanderi & Silk',
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'farshi-gharara',
      title: 'Farshi Gharara',
      tagline: 'Royal Awadh Craft',
      badge: 'Heritage',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'coord-sets',
      title: 'Co-ord Sets',
      tagline: 'Contemporary Ethnic',
      badge: '',
      image: 'https://images.unsplash.com/photo-1596783074418-47d74c04a7b0?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'velvet-edit',
      title: 'Velvet Edit',
      tagline: 'Winter Luxury',
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'anarkali',
      title: 'Anarkali Edit',
      tagline: 'Flared Elegance',
      badge: '',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: 'dupatta-curation',
      title: 'Organza Dupattas',
      tagline: 'Zari & Gota Work',
      badge: '',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=400&q=80'
    }
  ];

  /**
   * Generates collections scroller HTML template
   */
  function createCollectionsTemplate() {
    const cardsHtml = COLLECTIONS_DATA.map(item => `
      <div class="collection-item" data-category-id="${item.id}" role="button" tabindex="0" aria-label="Browse ${item.title}">
        <div class="collection-visual-wrapper">
          <img src="${item.image}" alt="${item.title}" class="collection-img" loading="lazy" />
          ${item.badge ? `<span class="collection-card-badge">${item.badge}</span>` : ''}
          <div class="collection-overlay-shade"></div>
        </div>
        <div class="collection-caption">
          <h3 class="collection-title">${item.title}</h3>
          <p class="collection-tagline">${item.tagline}</p>
        </div>
      </div>
    `).join('');

    return `
      <div class="collections-wrapper container">
        <div class="collections-header-bar">
          <div class="collections-titles">
            <span class="section-kicker">Curated Collections</span>
            <h2 class="section-heading">Shop By Silhouette</h2>
          </div>
          <div class="collections-nav-arrows desktop-only">
            <button class="nav-arrow-btn prev-arrow" id="col-arrow-prev" aria-label="Scroll left" disabled>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button class="nav-arrow-btn next-arrow" id="col-arrow-next" aria-label="Scroll right">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <div class="collections-scroll-track" id="collections-track" role="region" aria-label="Collections Carousel">
          ${cardsHtml}
        </div>
      </div>
    `;
  }

  /**
   * Sets up touch sliding, mouse dragging, and arrow controls
   */
  function initCollectionsScroller() {
    const track = document.getElementById('collections-track');
    const prevBtn = document.getElementById('col-arrow-prev');
    const nextBtn = document.getElementById('col-arrow-next');

    if (!track) return;

    // 1. Update Arrow Button Active States
    function updateArrowStatus() {
      if (!prevBtn || !nextBtn) return;
      const scrollLeft = track.scrollLeft;
      const maxScroll = track.scrollWidth - track.clientWidth;

      prevBtn.disabled = scrollLeft <= 10;
      nextBtn.disabled = scrollLeft >= maxScroll - 10;
    }

    // 2. Arrow Button Click Smooth Navigation
    const getScrollStep = () => Math.max(track.clientWidth * 0.75, 280);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
      });
    }

    track.addEventListener('scroll', updateArrowStatus, { passive: true });
    window.addEventListener('resize', updateArrowStatus, { passive: true });

    // 3. Desktop Click-and-Drag Logic
    let isMouseDown = false;
    let startX = 0;
    let scrollStart = 0;
    let hasMoved = false;

    track.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      hasMoved = false;
      track.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      scrollStart = track.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      track.classList.remove('is-dragging');
    });

    track.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.6; // Scroll speed multiplier
      if (Math.abs(walk) > 5) {
        hasMoved = true;
      }
      track.scrollLeft = scrollStart - walk;
    });

    // 4. Click Event Dispatcher (Filters products when category is tapped)
    const items = track.querySelectorAll('.collection-item');
    items.forEach(card => {
      card.addEventListener('click', (e) => {
        if (hasMoved) {
          e.preventDefault(); // Prevent accidental selection during drag
          return;
        }
        const categoryId = card.getAttribute('data-category-id');
        
        // Dispatch custom event to notify home.js product catalog
        window.dispatchEvent(new CustomEvent('collection-selected', {
          detail: { categoryId }
        }));

        // Visual Active Pill Indicator
        items.forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
      });
    });

    // Initial arrow check
    updateArrowStatus();
  }

  /**
   * Mount collections scroller into target DOM container
   */
  function mountCollections() {
    const container = document.getElementById('collections-container');
    if (!container) return;
    container.innerHTML = createCollectionsTemplate();
    initCollectionsScroller();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountCollections);
  } else {
    mountCollections();
  }

})();