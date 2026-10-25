/**
 * Signature Look - Cart Module
 * Features:
 * - Dynamic injection into #cart-drawer-container
 * - Persistent storage with localStorage ('signature_cart')
 * - Real-time sync with header.js badge counter
 * - Slide-in off-canvas drawer (Right side)
 * - Quantity increment/decrement, item removal, and auto-subtotal
 * - Free shipping progress bar (threshold: ₹1,999)
 * - Direct WhatsApp / Checkout order trigger
 */

(function () {
  'use strict';

  const CART_STORAGE_KEY = 'signature_cart_items';
  const FREE_SHIPPING_THRESHOLD = 1999;

  // Internal Cart State
  let cartState = [];

  /**
   * Load cart state from localStorage
   */
  function loadCartState() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      cartState = saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('[cart.js] Could not parse localStorage cart data:', err);
      cartState = [];
    }
  }

  /**
   * Save cart state to localStorage and update dependencies
   */
  function saveCartState() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    } catch (err) {
      console.error('[cart.js] Could not save cart data:', err);
    }
    syncHeaderCounter();
    renderCartItems();
  }

  /**
   * Calculate total item count across all quantities
   */
  function getTotalCount() {
    return cartState.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 1), 0);
  }

  /**
   * Calculate subtotal amount
   */
  function getSubtotal() {
    return cartState.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseInt(item.quantity, 10) || 1;
      return sum + (price * qty);
    }, 0);
  }

  /**
   * Sync counter badge in header.js
   */
  function syncHeaderCounter() {
    if (typeof window.updateHeaderCartCount === 'function') {
      window.updateHeaderCartCount(getTotalCount());
    }
  }

  /**
   * Generate Cart Drawer DOM Skeleton
   */
  function createCartDrawerTemplate() {
    return `
      <!-- Cart Backdrop Overlay -->
      <div class="cart-overlay" id="cart-drawer-overlay" aria-hidden="true"></div>

      <!-- Right-side Off-canvas Cart Drawer -->
      <aside class="cart-drawer" id="cart-drawer" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Shopping Bag">
        <div class="cart-container">
          
          <!-- Cart Header -->
          <div class="cart-header">
            <div class="cart-title-wrap">
              <h2 class="cart-title">Shopping Bag</h2>
              <span class="cart-total-badge" id="cart-header-count">(0)</span>
            </div>
            <button class="icon-btn cart-close-btn" id="cart-drawer-close" aria-label="Close cart">
              <svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Free Shipping Progress Tracker -->
          <div class="cart-shipping-banner" id="cart-shipping-banner">
            <p class="shipping-msg" id="shipping-progress-text">Add items to get free delivery</p>
            <div class="shipping-bar-track">
              <div class="shipping-bar-fill" id="shipping-bar-fill" style="width: 0%;"></div>
            </div>
          </div>

          <!-- Scrollable Items List -->
          <div class="cart-body" id="cart-items-container">
            <!-- Dynamically populated via renderCartItems() -->
          </div>

          <!-- Cart Footer Summary -->
          <div class="cart-footer" id="cart-footer-summary">
            <div class="cart-subtotal-row">
              <span class="subtotal-label">Subtotal:</span>
              <span class="subtotal-amount" id="cart-subtotal-val">₹0</span>
            </div>
            <p class="cart-tax-notice">Taxes and shipping calculated at checkout.</p>
            
            <div class="cart-action-buttons">
              <button class="cart-checkout-btn" id="cart-checkout-trigger">
                <span>Proceed to Checkout</span>
                <svg class="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>

        </div>
      </aside>
    `;
  }

  /**
   * Render cart items list and update totals
   */
  function renderCartItems() {
    const itemsContainer = document.getElementById('cart-items-container');
    const headerCount = document.getElementById('cart-header-count');
    const subtotalVal = document.getElementById('cart-subtotal-val');
    const footerSummary = document.getElementById('cart-footer-summary');
    const progressText = document.getElementById('shipping-progress-text');
    const progressFill = document.getElementById('shipping-bar-fill');

    if (!itemsContainer) return;

    const totalCount = getTotalCount();
    const subtotal = getSubtotal();

    if (headerCount) headerCount.textContent = `(${totalCount})`;
    if (subtotalVal) subtotalVal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;

    // Update Free Shipping Progress Bar
    if (progressText && progressFill) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        progressText.innerHTML = `🎉 <strong>Congratulations!</strong> You qualify for <strong>FREE Delivery</strong>.`;
        progressFill.style.width = '100%';
      } else {
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        const percent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
        progressText.innerHTML = `Add <strong>₹${remaining.toLocaleString('en-IN')}</strong> more for <strong>FREE Shipping</strong>`;
        progressFill.style.width = `${percent}%`;
      }
    }

    // Empty State Check
    if (cartState.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-icon-wrap">
            <svg class="empty-bag-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h3 class="empty-title">Your Bag is Empty</h3>
          <p class="empty-desc">Looks like you haven't added anything to your bag yet.</p>
          <button class="empty-shop-btn" id="empty-continue-btn">Continue Shopping</button>
        </div>
      `;
      if (footerSummary) footerSummary.style.display = 'none';

      const contBtn = document.getElementById('empty-continue-btn');
      if (contBtn) contBtn.addEventListener('click', closeCartDrawer);
      return;
    }

    if (footerSummary) footerSummary.style.display = 'block';

    // Populate Item Cards
    itemsContainer.innerHTML = cartState.map((item, index) => `
      <div class="cart-item-row" data-index="${index}">
        <div class="item-thumb-wrap">
          <img src="${item.image}" alt="${item.title}" class="item-thumb-img" />
        </div>
        <div class="item-details-wrap">
          <div class="item-title-bar">
            <h4 class="item-name">${item.title}</h4>
            <button class="item-remove-btn" data-action="remove" data-index="${index}" aria-label="Remove item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          ${item.size ? `<span class="item-variant">Size: <strong>${item.size}</strong></span>` : ''}
          <div class="item-pricing-row">
            <div class="qty-stepper">
              <button class="qty-btn minus" data-action="decrease" data-index="${index}">−</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn plus" data-action="increase" data-index="${index}">+</button>
            </div>
            <div class="item-price">₹${(item.price * item.quantity).toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Cart Drawer Interaction Logic (Open / Close)
   */
  function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (!drawer || !overlay) return;

    drawer.classList.add('is-open');
    overlay.classList.add('is-visible');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (!drawer || !overlay) return;

    drawer.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  /**
   * Public Cart API for adding items from home.js / product cards
   */
  window.addToCart = function (product) {
    if (!product || !product.id) return;

    const existingIndex = cartState.findIndex(
      item => item.id === product.id && item.size === product.size
    );

    if (existingIndex > -1) {
      cartState[existingIndex].quantity += (product.quantity || 1);
    } else {
      cartState.push({
        id: product.id,
        title: product.title || 'Product',
        price: parseFloat(product.price) || 0,
        image: product.image || '',
        size: product.size || 'Free Size',
        quantity: product.quantity || 1
      });
    }

    saveCartState();
    openCartDrawer();
  };

  /**
   * Bind event listeners for cart interactions
   */
  function initCartEvents() {
    const overlay = document.getElementById('cart-drawer-overlay');
    const closeBtn = document.getElementById('cart-drawer-close');
    const itemsContainer = document.getElementById('cart-items-container');
    const checkoutBtn = document.getElementById('cart-checkout-trigger');

    if (overlay) overlay.addEventListener('click', closeCartDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      const drawer = document.getElementById('cart-drawer');
      if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
        closeCartDrawer();
      }
    });

    // Listen to header.js trigger
    window.addEventListener('toggle-cart-drawer', () => {
      const drawer = document.getElementById('cart-drawer');
      if (drawer && drawer.classList.contains('is-open')) {
        closeCartDrawer();
      } else {
        openCartDrawer();
      }
    });

    // Delegated actions on Cart Item Rows (Decrease, Increase, Remove)
    if (itemsContainer) {
      itemsContainer.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('[data-action]');
        if (!targetBtn) return;

        const action = targetBtn.getAttribute('data-action');
        const index = parseInt(targetBtn.getAttribute('data-index'), 10);

        if (isNaN(index) || !cartState[index]) return;

        if (action === 'increase') {
          cartState[index].quantity += 1;
          saveCartState();
        } else if (action === 'decrease') {
          if (cartState[index].quantity > 1) {
            cartState[index].quantity -= 1;
          } else {
            cartState.splice(index, 1);
          }
          saveCartState();
        } else if (action === 'remove') {
          cartState.splice(index, 1);
          saveCartState();
        }
      });
    }

    // Checkout Trigger (Can connect to WhatsApp or payment page)
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (cartState.length === 0) return;
        const subtotal = getSubtotal();
        const itemsList = cartState.map(i => `• ${i.title} (${i.size}) x${i.quantity} = ₹${i.price * i.quantity}`).join('%0A');
        const message = `Hello Signature Look, I would like to place an order:%0A%0A${itemsList}%0A%0ATotal Amount: ₹${subtotal}%0APlease confirm delivery details.`;
        
        // WhatsApp order link
        window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
      });
    }
  }

  /**
   * Mount cart component into DOM
   */
  function mountCart() {
    const container = document.getElementById('cart-drawer-container');
    if (!container) return;

    loadCartState();
    container.innerHTML = createCartDrawerTemplate();
    initCartEvents();
    syncHeaderCounter();
    renderCartItems();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountCart);
  } else {
    mountCart();
  }

})();