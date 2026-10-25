/**
 * Signature Look - Home & Product Catalog Module (Live Google Sheet Sync)
 */

(function () {
  'use strict';

  // YAHAN APNA GOOGLE APPS SCRIPT WEB APP URL PASTE KAREIN:
  const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbzXt-5t6qmCF1d8CN-EIBgBZ6_HTJdgRKAnpOVkra8CuHicjq5gS-DQ1WT-_dEYE1Ui/exec';

  // Fallback initial data (taaki sheet load hone se pehle UI khali na dikhe)
  let PRODUCTS_DATA = [
    {
      id: 'prod-001',
      title: 'Zari Embroidered Chanderi Suit Set',
      category: 'suit-sets',
      price: 2499,
      comparePrice: 4999,
      sizes: ['S', 'M', 'L', 'XL'],
      primaryImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
      secondaryImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80',
      badge: 'Bestseller'
    },
    {
      id: 'prod-002',
      title: 'Royal Awadh Farshi Gharara Set',
      category: 'farshi-gharara',
      price: 4999,
      comparePrice: 8999,
      sizes: ['M', 'L', 'XL', 'XXL'],
      primaryImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=700&q=80',
      secondaryImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
      badge: 'Heritage'
    }
  ];

  const selectedSizesState = {};
  let currentActiveCategory = null;

  function renderHeroBanner() {
    const heroContainer = document.getElementById('hero-banner-container');
    if (!heroContainer) return;

    heroContainer.innerHTML = `
      <div class="hero-banner-inner">
        <div class="hero-content-wrap container">
          <div class="hero-text-card">
            <span class="hero-kicker">Signature Look Originals</span>
            <h1 class="hero-title">Timeless Grace, <br/>Modern Silhouette</h1>
            <p class="hero-desc">Discover our handpicked couture — crafted with pure silks, delicate embroideries, and refined tailoring.</p>
            <div class="hero-cta-group">
              <a href="#featured-products-container" class="hero-primary-btn">
                <span>Explore Bestsellers</span>
                <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <span class="hero-meta-badge">Free Pan-India Delivery Available</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function buildProductCard(prod) {
    const discountPercent = prod.comparePrice 
      ? Math.round(((prod.comparePrice - prod.price) / prod.comparePrice) * 100) 
      : 0;

    if (!selectedSizesState[prod.id]) {
      selectedSizesState[prod.id] = (Array.isArray(prod.sizes) && prod.sizes[0]) ? prod.sizes[0] : 'Free Size';
    }
    const currentSelectedSize = selectedSizesState[prod.id];

    const sizesArr = Array.isArray(prod.sizes) ? prod.sizes : ['Free Size'];
    const sizePillsHtml = sizesArr.map(sz => `
      <button 
        type="button" 
        class="size-pill ${sz === currentSelectedSize ? 'is-active' : ''}" 
        data-action="select-size" 
        data-product-id="${prod.id}" 
        data-size="${sz}">
        ${sz}
      </button>
    `).join('');

    return `
      <div class="product-card" data-product-id="${prod.id}" data-category="${prod.category}">
        <div class="product-thumb-frame">
          ${discountPercent > 0 ? `<span class="product-discount-tag">-${discountPercent}%</span>` : ''}
          ${prod.badge ? `<span class="product-status-tag">${prod.badge}</span>` : ''}
          
          <div class="product-images-slider">
            <img src="${prod.primaryImage}" alt="${prod.title}" class="img-primary" loading="lazy" />
            <img src="${prod.secondaryImage || prod.primaryImage}" alt="${prod.title} alternate view" class="img-secondary" loading="lazy" />
          </div>

          <div class="product-quick-actions">
            <button class="quick-add-btn" data-action="quick-add" data-product-id="${prod.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Add to Bag</span>
            </button>
          </div>
        </div>

        <div class="product-info-wrap">
          <h3 class="product-title" title="${prod.title}">${prod.title}</h3>
          
          <div class="product-pricing">
            <span class="price-current">₹${Number(prod.price).toLocaleString('en-IN')}</span>
            ${prod.comparePrice ? `<span class="price-original">₹${Number(prod.comparePrice).toLocaleString('en-IN')}</span>` : ''}
          </div>

          <div class="product-size-section">
            <span class="size-label">Select Size:</span>
            <div class="size-pills-row">
              ${sizePillsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderProducts(filteredCategory = null) {
    const productsContainer = document.getElementById('featured-products-container');
    if (!productsContainer) return;

    currentActiveCategory = filteredCategory;
    let itemsToDisplay = PRODUCTS_DATA;
    if (filteredCategory && filteredCategory !== 'all') {
      itemsToDisplay = PRODUCTS_DATA.filter(p => p.category === filteredCategory);
    }

    productsContainer.innerHTML = `
      <div class="products-section-header">
        <div class="products-header-left">
          <span class="section-kicker">Curated For You</span>
          <h2 class="section-heading">Featured Creations</h2>
        </div>
        ${filteredCategory && filteredCategory !== 'all' ? `
          <button class="clear-filter-btn" id="clear-product-filter">
            <span>Showing: ${filteredCategory.replace('-', ' ').toUpperCase()}</span>
            <span class="clear-x">✕ Clear</span>
          </button>
        ` : ''}
      </div>

      <div class="products-grid" id="products-grid-list">
        ${itemsToDisplay.length > 0 ? itemsToDisplay.map(buildProductCard).join('') : `
          <div class="no-products-msg">
            <p>No products found in this collection currently.</p>
          </div>
        `}
      </div>
    `;

    const clearBtn = document.getElementById('clear-product-filter');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        renderProducts(null);
        const collectionCards = document.querySelectorAll('.collection-item');
        collectionCards.forEach(c => c.classList.remove('is-selected'));
      });
    }
  }

  /**
   * Fetch Live Products from Google Sheets API
   */
  async function fetchProductsFromSheet() {
    if (!GOOGLE_SHEET_API_URL || GOOGLE_SHEET_API_URL.includes('PASTE_YOUR')) {
      return;
    }

    try {
      const response = await fetch(GOOGLE_SHEET_API_URL);
      const json = await response.json();
      
      if (json && json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
        PRODUCTS_DATA = json.data;
        renderProducts(currentActiveCategory);
      }
    } catch (err) {
      console.warn('[home.js] Could not fetch live Google Sheet data, showing fallback items:', err);
    }
  }

  function initProductEvents() {
    const productsContainer = document.getElementById('featured-products-container');
    if (!productsContainer) return;

    productsContainer.addEventListener('click', (e) => {
      const sizeBtn = e.target.closest('[data-action="select-size"]');
      if (sizeBtn) {
        const prodId = sizeBtn.getAttribute('data-product-id');
        const chosenSize = sizeBtn.getAttribute('data-size');
        selectedSizesState[prodId] = chosenSize;

        const card = sizeBtn.closest('.product-card');
        if (card) {
          const allPills = card.querySelectorAll('.size-pill');
          allPills.forEach(p => p.classList.remove('is-active'));
          sizeBtn.classList.add('is-active');
        }
        return;
      }

      const addBtn = e.target.closest('[data-action="quick-add"]');
      if (addBtn) {
        const prodId = addBtn.getAttribute('data-product-id');
        const product = PRODUCTS_DATA.find(p => p.id === prodId);
        if (!product) return;

        const size = selectedSizesState[prodId] || (Array.isArray(product.sizes) ? product.sizes[0] : 'Free Size');

        if (typeof window.addToCart === 'function') {
          window.addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.primaryImage,
            size: size,
            quantity: 1
          });
        }
      }
    });

    window.addEventListener('collection-selected', (e) => {
      const categoryId = e.detail && e.detail.categoryId;
      if (categoryId) {
        renderProducts(categoryId);
        const targetSection = document.getElementById('featured-products-container');
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  function initHome() {
    renderHeroBanner();
    renderProducts();
    initProductEvents();
    fetchProductsFromSheet(); // Live data fetch
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHome);
  } else {
    initHome();
  }

})();