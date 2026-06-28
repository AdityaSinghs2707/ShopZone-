const API_URL = 'http://localhost:8000/api';
// ── 1. CART STATE ──
function getCart() {
  return JSON.parse(localStorage.getItem('shopzone_cart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('shopzone_cart', JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {
  const cart = getCart();
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    countEl.textContent = cart.length;
    countEl.classList.toggle('visible', cart.length > 0);
  }
}

// ── 2. TOAST ──
function showToast(msg, type = 'default') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  const colors = { default: '#6C63FF', success: '#2ECC71', error: '#FF6B6B', warning: '#F9A825' };
  toast.style.cssText = `
    position:fixed; bottom:28px; right:28px; z-index:9999;
    background:${colors[type] || colors.default}; color:#fff;
    padding:13px 22px; border-radius:12px; font-size:13px; font-weight:500;
    font-family:'Inter',sans-serif; opacity:0; transform:translateY(8px);
    transition:opacity 0.3s,transform 0.3s; pointer-events:none;
    box-shadow:0 4px 20px rgba(0,0,0,0.4); max-width:320px;
  `;
  toast.textContent = msg;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
  }, 2800);
}

// ── 3. ADD TO CART (product grid cards) ──
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('add-to-cart')) {
    e.stopPropagation();
    const name  = e.target.dataset.name;
    const price = e.target.dataset.price;
    const cart  = getCart();
    cart.push({ name, price, id: Date.now() });
    saveCart(cart);
    showToast(`✓ ${name} added!`, 'success');
    e.target.textContent = '✓';
    e.target.style.background = '#2ECC71';
    setTimeout(() => { e.target.textContent = '+'; e.target.style.background = ''; }, 1500);
  }
  if (e.target.classList.contains('card-wishlist')) {
    e.stopPropagation();
    e.target.classList.toggle('active');
    e.target.textContent = e.target.classList.contains('active') ? '♥' : '♡';
    showToast(e.target.classList.contains('active') ? '♥ Added to wishlist!' : 'Removed from wishlist',
      e.target.classList.contains('active') ? 'default' : 'warning');
  }
});

// ── 4. FILTER ──
const filterBtns   = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    productCards.forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

// ── 5. LIVE SEARCH ──
const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    productCards.forEach(card => {
      const name = card.querySelector('.card-name')?.textContent.toLowerCase() || '';
      const cat  = card.dataset.category?.toLowerCase() || '';
      card.classList.toggle('hidden', q !== '' && !name.includes(q) && !cat.includes(q));
    });
    if (!q) {
      filterBtns.forEach(b => b.classList.remove('active'));
      document.querySelector('[data-filter="all"]')?.classList.add('active');
    }
  });
}

// ── 6. NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.borderBottomColor = window.scrollY > 20 ? 'var(--border-hover)' : 'var(--border)';
    navbar.style.background = window.scrollY > 20 ? 'rgba(10,10,10,0.98)' : 'rgba(10,10,10,0.92)';
  }, { passive: true });
}

// ── 7. HAMBURGER ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  }));
}

// ── 8. SCROLL ANIMATIONS ──
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.product-card, .hero-product-card, .cart-item')
    .forEach(el => { el.classList.add('animate-on-scroll'); observer.observe(el); });
}

// ── 9. THEME TOGGLE ──
function initThemeToggle() {
  const navRight = document.querySelector('.nav-right');
  if (!navRight || document.getElementById('themeToggle')) return;
  const btn = document.createElement('button');
  btn.id = 'themeToggle';
  btn.className = 'btn-icon';
  btn.title = 'Toggle theme';
  btn.style.fontSize = '15px';
  navRight.insertBefore(btn, navRight.firstChild);
  const saved = localStorage.getItem('sz_theme') || 'dark';
  if (saved === 'light') { document.body.classList.add('light-mode'); btn.innerHTML = '🌙'; }
  else btn.innerHTML = '☀️';
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    btn.innerHTML = isLight ? '🌙' : '☀️';
    localStorage.setItem('sz_theme', isLight ? 'light' : 'dark');
    showToast(isLight ? '☀️ Light mode' : '🌙 Dark mode');
  });
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  initScrollAnimations();
  initThemeToggle();
  // Restore theme
  if (localStorage.getItem('sz_theme') === 'light') document.body.classList.add('light-mode');
});
updateCartCount();