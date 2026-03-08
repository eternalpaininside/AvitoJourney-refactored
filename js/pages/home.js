import { safeImageMarkup } from '../utils/images.js';
import { addToFavorites, removeFromFavorites, isFavorite } from '../storage/favorites.js';

const BANNERS_URL = '../data/banners.json';
const PRODUCTS_URL = '../data/products.json';
const PRODUCT_PAGE_URL = 'product.html';

async function loadBanners() {
  try {
    const response = await fetch(BANNERS_URL);
    const banners = await response.json();
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    track.innerHTML = '';

    banners.forEach((banner) => {
      const bannerEl = document.createElement('div');
      bannerEl.className = 'banner';
      bannerEl.innerHTML = `
        <img src="${banner.image}" alt="${banner.title}" class="banner-image" loading="lazy">
      `;
      track.appendChild(bannerEl);
    });

    initMainCarousel();
  } catch (error) {
    console.error('Ошибка загрузки баннеров:', error);
  }
}

export async function initHomePage() {
  await loadBanners();
  await loadProducts();
  initScrollToTop();
  initSearchField();
}

async function loadProducts() {
  try {
    const response = await fetch(PRODUCTS_URL);
    const products = await response.json();
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = '';

    products.forEach((product) => {
      const card = document.createElement('div');
      card.className = 'product';
      card.dataset.productId = product.id;

      const fav = isFavorite(product.id);

      card.innerHTML = `
        <a href="${PRODUCT_PAGE_URL}?id=${product.id}" class="product-link">
          ${safeImageMarkup(product.image, product.name, 'product-image')}
          <div class="title-container"><h3>${product.name}</h3></div>
          <p>${product.description}</p>
          <div class="product-price-preview">
            <span class="price">${product.price || 'Цена не указана'} ${product.currency || 'Руб.'}</span>
            <span class="location">📍 ${product.location || 'Местоположение не указано'}</span>
          </div>
        </a>
        <button class="favorite-toggle" type="button" aria-label="В избранное">
          ${fav ? '⭐️' : '☆'}
        </button>
      `;

      productGrid.appendChild(card);

      const favBtn = card.querySelector('.favorite-toggle');
      favBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const nowFav = isFavorite(product.id);
        if (nowFav) {
          removeFromFavorites(product.id);
          favBtn.textContent = '☆';
        } else {
          addToFavorites(product);
          favBtn.textContent = '⭐️';
        }
      });
    });
  } catch (error) {
    console.error('Ошибка загрузки объявлений:', error);
    const productGrid = document.querySelector('.product-grid');
    if (productGrid) {
      productGrid.innerHTML = `
        <div class="status-card status-card-full">
          <p class="status-text">Не удалось загрузить объявления. Пожалуйста, попробуйте позже.</p>
        </div>
      `;
    }
  }
}

function initMainCarousel() {
  const carouselTrack = document.getElementById('carouselTrack');
  const indicatorsContainer = document.getElementById('indicators');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!carouselTrack || !indicatorsContainer || !prevBtn || !nextBtn) return;

  const banners = carouselTrack.querySelectorAll('.banner');
  const totalBanners = banners.length;
  if (!totalBanners) return;

  let currentIndex = 0;
  let autoPlayInterval;

  function createIndicators() {
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < totalBanners; i += 1) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      indicatorsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    currentIndex = (index + totalBanners) % totalBanners;
    updateCarousel();
    resetAutoPlay();
  }

  function updateCarousel() {
    banners.forEach((banner, index) => {
      banner.classList.remove('left', 'center', 'right');
      if (index === currentIndex) banner.classList.add('center');
      else if ((index - currentIndex + totalBanners) % totalBanners === 1) banner.classList.add('right');
      else if ((index - currentIndex + totalBanners) % totalBanners === totalBanners - 1) banner.classList.add('left');
    });

    indicatorsContainer.querySelectorAll('.dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalBanners;
    updateCarousel();
    resetAutoPlay();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalBanners) % totalBanners;
    updateCarousel();
    resetAutoPlay();
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  createIndicators();
  updateCarousel();
  startAutoPlay();

  carouselTrack.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  carouselTrack.addEventListener('mouseleave', startAutoPlay);
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

  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = this.value.trim();
      if (query) {
        alert(`Поиск: "${query}"\nВ реальном приложении здесь будет выполнен поиск объявлений.`);
        this.value = '';
        this.blur();
      }
    }
  });
}
