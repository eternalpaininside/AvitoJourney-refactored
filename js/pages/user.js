import { safeImageMarkup } from '../utils/images.js';
import { getFavorites, removeFromFavorites } from '../storage/favorites.js';
import { setAuthed } from '../storage/auth.js';

const PRODUCTS_URL = '../data/products.json';

export function initUserPage() {
  initScrollToTop();
  initSearchField();
  initUserTabs();
  initLogout();
  loadFavorites();
}

function initLogout() {
  const logout = document.querySelector('.logout-btn');
  if (!logout) return;
  logout.addEventListener('click', () => {
    setAuthed(false);
  });
}

function initUserTabs() {
  const tabLinks = document.querySelectorAll('.page-user .sidebar a[data-tab]');
  const tabContents = document.querySelectorAll('.page-user .tab-content');

  if (tabContents[0]) tabContents[0].classList.add('active');
  if (tabLinks[0]) tabLinks[0].classList.add('active');

  tabLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.dataset.tab;

      tabContents.forEach((content) => content.classList.remove('active'));
      tabLinks.forEach((tabLink) => tabLink.classList.remove('active'));

      const target = document.getElementById(`tab-${tabId}`);
      if (target) {
        target.classList.add('active');
        link.classList.add('active');
        if (tabId === 'favorites') loadFavorites();
      }
    });
  });
}

async function loadFavorites() {
  const favoritesGrid = document.getElementById('favoritesGrid');
  if (!favoritesGrid) return;

  const favorites = getFavorites();
  if (!favorites.length) {
    favoritesGrid.innerHTML = emptyFavoritesMarkup();
    return;
  }

  try {
    const response = await fetch(PRODUCTS_URL);
    const allProducts = await response.json();
    const favoriteProducts = allProducts.filter((product) => favorites.some((fav) => fav.id === product.id));

    if (!favoriteProducts.length) {
      favoritesGrid.innerHTML = emptyFavoritesMarkup();
      return;
    }

    favoritesGrid.innerHTML = '';

    favoriteProducts.forEach((product) => {
      const item = document.createElement('div');
      item.className = 'favorite-item';
      item.dataset.productId = product.id;
      item.innerHTML = `
        <a href="product.html?id=${product.id}" class="product-link">
          ${safeImageMarkup(product.image, product.name, '')}
          <div class="favorite-item-info">
            <h4 class="favorite-item-title">${product.name}</h4>
            <div class="favorite-item-price">${product.price || 'Цена не указана'} ${product.currency || 'Руб.'}</div>
            <div class="favorite-item-location">📍 ${product.location || 'Местоположение не указано'}</div>
          </div>
        </a>
        <button class="favorite-item-remove" type="button" data-product-id="${product.id}">Удалить из избранного</button>
      `;
      favoritesGrid.appendChild(item);
    });

    favoritesGrid.querySelectorAll('.favorite-item-remove').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = Number(btn.dataset.productId);
        removeFromFavorites(productId);

        const el = favoritesGrid.querySelector(`.favorite-item[data-product-id="${productId}"]`);
        if (el) el.remove();
        if (!getFavorites().length) favoritesGrid.innerHTML = emptyFavoritesMarkup();
      });
    });
  } catch (error) {
    console.error('Ошибка загрузки избранных:', error);
    favoritesGrid.innerHTML = '<div class="loading-favorites">Ошибка загрузки избранных объявлений</div>';
  }
}

function emptyFavoritesMarkup() {
  return `
    <div class="empty-favorites">
      <h3>❤️ В избранном пока пусто</h3>
      <p>Добавляйте объявления в избранное, чтобы быстро находить их позже</p>
      <a href="index.html" class="back-button back-button-inline">Перейти к объявлениям</a>
    </div>
  `;
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
