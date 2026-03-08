import { safeImageMarkup } from '../utils/images.js';

export async function initSellerPage() {
  initScrollToTop();
  initSearchField();
  initBackButton();
  initContactButtons();
  await loadSellerProducts();
}

function initBackButton() {
  const backBtn = document.querySelector('[data-action="back"]');
  if (!backBtn) return;
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.history.back();
  });
}

function initContactButtons() {
  document.querySelectorAll('[data-action="contact"]')?.forEach((btn) => {
    btn.addEventListener('click', () => {
      const kind = btn.getAttribute('data-kind') || 'contact';
      if (kind === 'chat') alert('Открыть чат с продавцом');
      else if (kind === 'call') alert('Позвонить продавцу');
      else alert('Связаться с продавцом');
    });
  });
}

async function loadSellerProducts() {
  try {
    const response = await fetch('../data/products.json');
    const products = await response.json();
    const productGrid = document.querySelector('.seller-products');
    if (!productGrid) return;

    const sellerProducts = products.slice(0, 3);
    productGrid.innerHTML = '';

    sellerProducts.forEach((product) => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      productElement.dataset.productId = product.id;

      productElement.innerHTML = `
        <a href="product.html?id=${product.id}" class="product-link">
          ${safeImageMarkup(product.image, product.name, 'product-image')}
          <div class="title-container"><h3>${product.name}</h3></div>
          <p>${product.description}</p>
          <div class="product-price-preview">
            <span class="price">${product.price || 'Цена не указана'} ${product.currency || 'Руб.'}</span>
            <span class="location">📍 ${product.location || 'Местоположение не указано'}</span>
          </div>
        </a>
      `;

      productGrid.appendChild(productElement);
    });
  } catch (error) {
    console.error('Ошибка загрузки услуг:', error);
    const productGrid = document.querySelector('.seller-products');
    if (productGrid) {
      productGrid.innerHTML = `
        <div class="status-card">
          <p>Не удалось загрузить услуги продавца.</p>
        </div>
      `;
    }
  }
}

function initScrollToTop() {
  const scrollToTopBtn = document.querySelector('.scroll-to-top');
  if (!scrollToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) scrollToTopBtn.classList.add('show');
    else scrollToTopBtn.classList.remove('show');
  });

  scrollToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initSearchField() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;

  const originalPlaceholder = searchInput.placeholder;

  searchInput.addEventListener('focus', function () {
    this.classList.add('no-emoji', 'search-focused');
    this.placeholder = originalPlaceholder.replace('🔍 ', '').replace('🔍', '');
  });

  searchInput.addEventListener('blur', function () {
    if (this.value === '') {
      this.classList.remove('no-emoji', 'search-focused');
      this.placeholder = originalPlaceholder;
    }
  });
}
