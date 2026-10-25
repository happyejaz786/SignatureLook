/**
 * Signature Look - Dynamic & Unstoppable Collections Slider Module
 * Features: Floating Side Arrows, 1-card mobile / 3-cards laptop step scroll, Drag & Sheet Sync
 */

(function () {
  'use strict';

  const MASTER_COLLECTIONS = [
    {
      id: 'suit-sets',
      title: 'Suit Sets',
      subtitle: 'Pure Chanderi & Silk',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'farshi-gharara',
      title: 'Farshi Gharara',
      subtitle: 'Royal Awadh Craft',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'coord-sets',
      title: 'Co-ord Sets',
      subtitle: 'Contemporary Ethnic',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'velvet-edit',
      title: 'Velvet Edit',
      subtitle: 'Winter Luxury',
      image: 'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'anarkali',
      title: 'Anarkali Edit',
      subtitle: 'Flared Elegance',
      image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'organza-dupatta',
      title: 'Organza Dupattas',
      subtitle: 'Zari & Gota Work',
      image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'chikankari',
      title: 'Chikankari Edit',
      subtitle: 'Lucknowi Handwork',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'bridal-couture',
      title: 'Bridal Couture',
      subtitle: 'Intricate Zardozi',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'raw-silk',
      title: 'Raw Silk',
      subtitle: 'Woven Opulence',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'designer-kaftans',
      title: 'Designer Kaftans',
      subtitle: 'Relaxed Glamour',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'festive-pret',
      title: 'Festive Pret',
      subtitle: 'Celebration Ready',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'draped-sarees',
      title: 'Draped Sarees',
      subtitle: 'Modern Drapes',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80'
    }
  ];

  let selectedCategoryId = null;

  function renderCollections(collections = MASTER_COLLECTIONS) {
    const container = document.getElementById('collections-container');
    if (!container) return;

    container.innerHTML = `
      <section class="collections-section">
        <div class="container collections-header-row">
          <div class="collections-title-wrap">
            <span class="collections-kicker">Curated Collections</span>
            <h2 class="collections-heading">Shop By Silhouette</h2>
          </div>
        </div>

        <!-- Slider Track Shell with Floating Side Arrows -->
        <div class="collections-slider-shell">
          
          <!-- Left Floating Arrow -->
          <button type="button" class="slider-side-arrow prev-side-arrow" id="col-prev-btn" aria-label="Scroll Left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <!-- Slider Track Viewport -->
          <div class="collections-track-wrapper" id="collections-slider-track">
            <div class="collections-cards-rail" id="collections-rail">
              ${collections.map(item => `
                <div class="collection-arch-card ${selectedCategoryId === item.id ? 'is-active-cat' : ''}" data-category-id="${item.id}">
                  <div class="arch-visual-frame">
                    <img src="${item.image}" alt="${item.title}" class="arch-img" loading="lazy" />
                    <div class="arch-gold-overlay"></div>
                    <span class="arch-action-hint">Explore</span>
                  </div>
                  <div class="arch-info-block">
                    <h3 class="arch-card-title">${item.title}</h3>
                    <p class="arch-card-subtitle">${item.subtitle || 'Signature Look'}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right Floating Arrow -->
          <button type="button" class="slider-side-arrow next-side-arrow" id="col-next-btn" aria-label="Scroll Right">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

        </div>
      </section>
    `;

    bindSliderInteractions();
  }

  /**
   * Powerful Scroll Engine: Mobile = 1 card, Laptop = 3 cards
   */
  function bindSliderInteractions() {
    const track = document.getElementById('collections-slider-track');
    const prevBtn = document.getElementById('col-prev-btn');
    const nextBtn = document.getElementById('col-next-btn');
    const rail = document.getElementById('collections-rail');

    if (!track || !rail) return;

    // Device-Specific Dynamic Scroll Step Calculation
    const getScrollStep = () => {
      const firstCard = rail.querySelector('.collection-arch-card');
      if (!firstCard) return 260;

      // Card width + Gap
      const cardWidth = firstCard.offsetWidth;
      const gap = 24; 
      const singleStep = cardWidth + gap;

      // Agar screen 768px se badi hai (Laptop/Desktop) to exact 3 cards, warna mobile par 1 card
      return window.innerWidth >= 768 ? singleStep * 3 : singleStep;
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const step = getScrollStep();
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (Math.ceil(track.scrollLeft) >= maxScroll - 5) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: step, behavior: 'smooth' });
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const step = getScrollStep();
        if (track.scrollLeft <= 5) {
          const maxScroll = track.scrollWidth - track.clientWidth;
          track.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: -step, behavior: 'smooth' });
        }
      });
    }

    // High-Performance Drag-to-Scroll
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let hasDragged = false;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      hasDragged = false;
      track.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('is-dragging');
    });

    track.addEventListener('mouseleave', () => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('is-dragging');
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 5) hasDragged = true;
      track.scrollLeft = scrollLeft - walk;
    });

    // Category Filter Selection
    rail.addEventListener('click', (e) => {
      if (hasDragged) {
        hasDragged = false;
        return;
      }

      const card = e.target.closest('.collection-arch-card');
      if (!card) return;

      const catId = card.getAttribute('data-category-id');
      selectedCategoryId = (selectedCategoryId === catId) ? null : catId;

      document.querySelectorAll('.collection-arch-card').forEach(c => {
        c.classList.toggle('is-active-cat', c.getAttribute('data-category-id') === selectedCategoryId);
      });

      window.dispatchEvent(new CustomEvent('collection-selected', {
        detail: { categoryId: selectedCategoryId || 'all' }
      }));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => renderCollections());
  } else {
    renderCollections();
  }

  // Global Dynamic Sync Hook
  window.syncDynamicCollections = function(sheetProducts) {
    if (!Array.isArray(sheetProducts) || sheetProducts.length === 0) return;

    const existingIds = new Set(MASTER_COLLECTIONS.map(c => c.id));
    let hasNewCategory = false;

    sheetProducts.forEach(prod => {
      if (prod.category && !existingIds.has(prod.category)) {
        existingIds.add(prod.category);
        hasNewCategory = true;
        MASTER_COLLECTIONS.push({
          id: prod.category,
          title: prod.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          subtitle: 'Boutique Collection',
          image: prod.primaryImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
        });
      }
    });

    if (hasNewCategory) {
      renderCollections(MASTER_COLLECTIONS);
    }
  };

})();