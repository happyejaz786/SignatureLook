/**
 * Signature Look - Global Header Engine with Amazon-Style Customer Ribbon
 * Path: js/header.js
 */

(function initSignatureHeader() {
  const container = document.getElementById('header-container');
  if (!container) return;

  // 1. Session Check (localStorage)
  let customer = null;
  try {
    customer = JSON.parse(localStorage.getItem('signature_customer'));
  } catch (e) {
    customer = null;
  }

  const isUserLoggedIn = !!(customer && (customer.fullName || customer.phone));
  const displayName = isUserLoggedIn ? (customer.fullName || 'Valued Client') : 'Guest';
  const displayCity = isUserLoggedIn ? (customer.delivery_address || 'Shahjahanpur') : 'Shahjahanpur';

  // 2. Render Amazon Ribbon + Main Navigation Bar
  container.innerHTML = `
    <!-- Top Amazon-Style Customer Ribbon -->
    <div class="sig-amazon-ribbon" style="
      background: linear-gradient(90deg, #07100B 0%, #13271D 50%, #07100B 100%);
      border-bottom: 1.5px solid #C5A880;
      color: #FAF8F5;
      font-size: 0.8rem;
      padding: 7px 16px;
      position: sticky;
      top: 0;
      z-index: 1001;
      box-shadow: 0 4px 14px rgba(0,0,0,0.3);
    ">
      <div style="max-width: 1240px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        
        <!-- Location / Greeting Block -->
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="color: #ECC880; display: flex; align-items: center;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </span>
          <div style="line-height: 1.2;">
            <span style="font-size: 0.68rem; color: #C5A880; text-transform: uppercase; letter-spacing: 0.08em; display: block;">
              ${isUserLoggedIn ? 'Deliver to ' + displayCity : 'Boutique Access'}
            </span>
            <span style="font-weight: 700; color: #FFFFFF; font-size: 0.86rem;">
              ${isUserLoggedIn ? 'Welcome!!, ' + displayName : 'Welcome, Guest'}
            </span>
          </div>
        </div>

        <!-- Auth Action Trigger -->
        <div style="display: flex; align-items: center; gap: 12px;">
          ${isUserLoggedIn ? `
            <span style="color: #ECC880; font-size: 0.72rem; letter-spacing: 0.08em; font-weight: 700; text-transform: uppercase;">VIP Member ✦</span>
            <button id="sig-logout-btn" style="
              background: none;
              border: 1px solid rgba(197, 168, 128, 0.4);
              color: #FAF8F5;
              padding: 4px 10px;
              border-radius: 4px;
              font-size: 0.74rem;
              cursor: pointer;
              font-weight: 600;
              transition: all 0.2s;
            ">Sign Out</button>
          ` : `
            <a href="auth.html" style="
              background: linear-gradient(135deg, #ECC880, #C5A880);
              color: #08110D;
              padding: 4px 12px;
              border-radius: 4px;
              text-decoration: none;
              font-size: 0.75rem;
              font-weight: 800;
              letter-spacing: 0.04em;
              display: inline-flex;
              align-items: center;
              gap: 4px;
            ">Sign In ➔</a>
            <a href="register.html" style="
              color: #ECC880;
              text-decoration: underline;
              font-size: 0.75rem;
              font-weight: 600;
            ">Register</a>
          `}
        </div>

      </div>
    </div>

    <!-- Main Luxury Navbar -->
    <header class="boutique-navbar" style="
      background: rgba(250, 248, 245, 0.96);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(197, 168, 128, 0.35);
      padding: 14px 20px;
    ">
      <div style="max-width: 1240px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between;">
        
        <!-- Brand Logo -->
        <a href="index.html" style="text-decoration: none; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 1.3rem;">✨</span>
          <span style="font-family: 'Playfair Display', Georgia, serif; font-size: 1.45rem; font-weight: 800; color: #12221B; letter-spacing: 0.04em;">
            Signature Look
          </span>
        </a>

        <!-- Right Quick Actions -->
        <div style="display: flex; align-items: center; gap: 16px;">
          <a href="index.html" style="text-decoration: none; color: #12221B; font-size: 0.88rem; font-weight: 600;">Store</a>
          <button id="cart-drawer-toggle" style="
            background: #12221B;
            color: #FFFFFF;
            border: none;
            padding: 8px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.82rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 6px;
          ">
            <span>Bag</span>
            <span id="cart-count-badge" style="background: #C5A880; color: #12221B; padding: 2px 6px; border-radius: 10px; font-size: 0.72rem; font-weight: 800;">0</span>
          </button>
        </div>

      </div>
    </header>
  `;

  // 3. Logout Handler
  const logoutBtn = document.getElementById('sig-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('signature_customer');
      window.location.reload();
    });
  }

  // 4. Cart Count Badge Updater
  try {
    const cart = JSON.parse(localStorage.getItem('signature_cart') || '[]');
    const totalQty = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const badge = document.getElementById('cart-count-badge');
    if (badge) badge.textContent = totalQty;
  } catch (err) {}
})();