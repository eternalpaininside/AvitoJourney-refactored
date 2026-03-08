import { safeImageMarkup } from '../utils/images.js';

let currentMediaItems = [];
let currentFullscreenIndex = 0;

export async function initProductPage() {
  initScrollToTop();
  initSearchField();
  initSellerLink();

  try {
    const productData = await loadProductData();
    if (productData?.media) initProductCarousel(productData.media);
    displayProductData(productData);
    initBookingSystem();
    initFullscreenControls();
  } catch (e) {
    showError('Не удалось загрузить данные товара.');
  }
}

function initSellerLink() {
  const sellerInfo = document.querySelector('.seller-info');
  if (!sellerInfo) return;
  sellerInfo.addEventListener('click', () => {
    window.location.href = 'seller.html';
  });
}

async function loadProductData() {
  const response = await fetch('../data/product.json');
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
}

function showError(message) {
  const productInfo = document.getElementById('productInfo');
  if (!productInfo) return;

  productInfo.innerHTML = `
    <div class="error-message">
      <div class="loading-icon">❌</div>
      <h3>Ошибка загрузки данных</h3>
      <p>${message}</p>
      <button id="retryBtn" type="button" class="retry-button">
        Повторить попытку
      </button>
    </div>
  `;

  const retryBtn = document.getElementById('retryBtn');
  if (retryBtn) retryBtn.addEventListener('click', () => window.location.reload());
}

function initFullscreenControls() {
  const modal = document.getElementById('fullscreenModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('[data-action="close"]');
  const prevBtn = modal.querySelector('[data-action="prev"]');
  const nextBtn = modal.querySelector('[data-action="next"]');

  if (closeBtn) closeBtn.addEventListener('click', closeFullscreen);
  if (prevBtn) prevBtn.addEventListener('click', () => navigateFullscreen(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateFullscreen(1));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeFullscreen();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeFullscreen();
    if (e.key === 'ArrowLeft') navigateFullscreen(-1);
    if (e.key === 'ArrowRight') navigateFullscreen(1);
  });
}

function openFullscreen(index) {
  const modal = document.getElementById('fullscreenModal');
  const modalContent = document.getElementById('modalContent');
  const modalCounter = document.getElementById('modalCounter');

  if (!modal || !modalContent) return;

  currentFullscreenIndex = index;
  const mediaItem = currentMediaItems[index];

  modalContent.innerHTML = '';

  if (mediaItem.type === 'image') {
    modalContent.innerHTML = safeImageMarkup(mediaItem.url, `Фото ${index + 1}`, '');
  } else if (mediaItem.type === 'video') {
    const video = document.createElement('video');
    video.src = mediaItem.url;
    video.controls = true;
    video.autoplay = true;
    modalContent.appendChild(video);
  }

  if (modalCounter) modalCounter.textContent = `${index + 1}/${currentMediaItems.length}`;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
  const modal = document.getElementById('fullscreenModal');
  const modalContent = document.getElementById('modalContent');
  if (!modal) return;

  const video = modalContent?.querySelector('video');
  if (video) video.pause();

  modal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

function navigateFullscreen(direction) {
  let newIndex = currentFullscreenIndex + direction;
  if (newIndex < 0) newIndex = currentMediaItems.length - 1;
  if (newIndex >= currentMediaItems.length) newIndex = 0;
  openFullscreen(newIndex);
}

function initProductCarousel(mediaItems) {
  const carouselTrack = document.getElementById('carouselTrack');
  const indicatorsContainer = document.getElementById('indicators');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!carouselTrack || !indicatorsContainer) return;

  currentMediaItems = mediaItems;
  carouselTrack.innerHTML = '';

  mediaItems.forEach((mediaItem, index) => {
    const banner = document.createElement('div');
    banner.className = 'banner';

    const typeBadge = document.createElement('div');
    typeBadge.className = 'media-type-badge';
    typeBadge.textContent = mediaItem.type === 'video' ? '▶ Видео' : '📷 Фото';

    if (mediaItem.type === 'image') {
      banner.innerHTML = safeImageMarkup(mediaItem.url, `Фото ${index + 1}`, 'carousel-image');
    } else {
      banner.innerHTML = `<video src="${mediaItem.url}" preload="metadata" poster="${mediaItem.thumbnail || ''}"></video>`;
    }

    banner.appendChild(typeBadge);
    banner.addEventListener('click', () => openFullscreen(index));
    carouselTrack.appendChild(banner);
  });

  const totalBanners = mediaItems.length;
  let currentIndex = 0;
  let autoPlayInterval;

  function createIndicators() {
    indicatorsContainer.innerHTML = '';
    for (let i = 0; i < totalBanners; i++) {
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
    carouselTrack.querySelectorAll('.banner').forEach((banner, index) => {
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

  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);

  createIndicators();
  updateCarousel();
  startAutoPlay();

  carouselTrack.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  carouselTrack.addEventListener('mouseleave', startAutoPlay);
}

function displayProductData(productData) {
  const productInfo = document.getElementById('productInfo');
  if (productInfo) {
    productInfo.innerHTML = `
      <div class="product-header">
        <h1 class="product-title">${productData.title || 'Название не указано'}</h1>
        <div class="product-price">${productData.price || '0'} ${productData.currency || 'Руб.'}</div>
      </div>

      <div class="product-location">
        <div class="location-details">
          <span>📍 ${productData.location || 'Адрес не указан'}</span>
          ${productData.distance ? `<span class="distance">• ${productData.distance}</span>` : ''}
          <a href="#" class="show-map">Показать на карте</a>
        </div>
      </div>

      ${productData.tags?.length ? `
        <div class="product-tags">
          ${productData.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </div>
      ` : ''}

      ${productData.description ? `
        <div class="description-section">
          <h3>Описание</h3>
          <div class="description-content">${productData.description}</div>
        </div>
      ` : ''}
    `;

    const showMapBtn = document.querySelector('.show-map');
    if (showMapBtn) {
      showMapBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert(`Показать на карте: ${productData.location || 'Адрес не указан'}`);
      });
    }
  }

  const bookingSection = document.getElementById('bookingSection');
  if (bookingSection) {
    bookingSection.style.display = 'block';
  }

  const seller = productData.seller || {};
  const sellerName = document.getElementById('seller-name');
  const sellerRole = document.getElementById('seller-role');
  const sellerClients = document.getElementById('seller-clients');
  const sellerRating = document.getElementById('seller-rating');

  if (sellerName) sellerName.textContent = seller.name || 'Не указано';
  if (sellerRole) sellerRole.textContent = seller.role || '';
  if (sellerClients) sellerClients.textContent = seller.clients || 0;

  if (sellerRating) {
    const rounded = Math.round(seller.rating || 0);
    const stars = '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
    sellerRating.innerHTML = `${stars} <span>(${seller.rating || 0})</span>`;
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

// === Система бронирования времени ===
let selectedTimeSlot = null;
let currentProductId = null;

// Инициализация системы бронирования
function initBookingSystem() {
    const bookingSection = document.getElementById('bookingSection');
    const bookingDateInput = document.getElementById('bookingDate');
    const bookingTimeGrid = document.getElementById('bookingTimeGrid');
    const bookingConfirm = document.getElementById('bookingConfirm');
    const bookingSubmitBtn = document.getElementById('bookingSubmitBtn');
    const selectedTimeText = document.getElementById('selectedTimeText');

    if (!bookingSection || !bookingDateInput || !bookingTimeGrid) return;

    // Получаем ID продукта из URL
    const urlParams = new URLSearchParams(window.location.search);
    currentProductId = urlParams.get('id');

    // Показываем секцию бронирования
    bookingSection.style.display = 'block';

    // Устанавливаем минимальную дату (сегодня)
    const today = new Date().toISOString().split('T')[0];
    bookingDateInput.min = today;
    bookingDateInput.value = today;

    // Загружаем доступное время при изменении даты
    bookingDateInput.addEventListener('change', () => {
        loadAvailableTimes(bookingDateInput.value);
    });

    // Загружаем время при первой загрузке
    loadAvailableTimes(today);

    // Обработчик кнопки подтверждения
    if (bookingSubmitBtn) {
        bookingSubmitBtn.addEventListener('click', () => {
            submitBooking();
        });
    }
}

// Загрузка доступного времени из БД (заглушка для подключения БД)
async function loadAvailableTimes(date) {
    const bookingTimeGrid = document.getElementById('bookingTimeGrid');
    const bookingConfirm = document.getElementById('bookingConfirm');

    if (!bookingTimeGrid) return;

    bookingTimeGrid.innerHTML = '<div class="loading-times">Загрузка доступного времени...</div>';
    if (bookingConfirm) bookingConfirm.style.display = 'none';
    selectedTimeSlot = null;

    try {
        // TODO: Подключи здесь загрузку из БД
        // Пример: const response = await fetch(`/api/available-times?productId=${currentProductId}&date=${date}`);
        // const availableTimes = await response.json();

        // Временные данные для демонстрации (удали после подключения БД)
        const availableTimes = await getMockAvailableTimes(date);

        bookingTimeGrid.innerHTML = '';

        if (availableTimes.length === 0) {
            bookingTimeGrid.innerHTML = '<div class="loading-times">Нет доступного времени на эту дату</div>';
            return;
        }

        availableTimes.forEach(time => {
            const slot = document.createElement('div');
            slot.className = `time-slot ${time.booked ? 'booked' : ''}`;
            slot.textContent = time.time;
            slot.dataset.time = time.time;
            slot.dataset.booked = time.booked;

            if (!time.booked) {
                slot.addEventListener('click', () => selectTimeSlot(slot, time.time));
            }

            bookingTimeGrid.appendChild(slot);
        });

    } catch (error) {
        console.error('Ошибка загрузки времени:', error);
        bookingTimeGrid.innerHTML = '<div class="loading-times">Ошибка загрузки времени</div>';
    }
}

// Получение доступного времени (MOCK-данные - удали после подключения БД)
async function getMockAvailableTimes(date) {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 300));

    // Генерируем временные слоты с 9:00 до 20:00
    const times = [];
    for (let hour = 9; hour <= 20; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        // Случайным образом помечаем некоторые слоты как забронированные
        const isBooked = Math.random() < 0.3;
        times.push({
            time,
            booked: isBooked
        });
    }
    return times;
}

// Выбор временного слота
function selectTimeSlot(slotElement, time) {
    // Снимаем выделение с предыдущего
    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));

    // Выделяем текущий
    slotElement.classList.add('selected');
    selectedTimeSlot = time;

    // Показываем кнопку подтверждения
    const bookingConfirm = document.getElementById('bookingConfirm');
    const selectedTimeText = document.getElementById('selectedTimeText');

    if (bookingConfirm && selectedTimeText) {
        const bookingDateInput = document.getElementById('bookingDate');
        selectedTimeText.textContent = `${bookingDateInput.value} в ${time}`;
        bookingConfirm.style.display = 'block';
    }
}

// Подтверждение бронирования
async function submitBooking() {
    const bookingDateInput = document.getElementById('bookingDate');
    const bookingSubmitBtn = document.getElementById('bookingSubmitBtn');

    if (!selectedTimeSlot || !bookingDateInput.value) return;

    bookingSubmitBtn.disabled = true;
    bookingSubmitBtn.textContent = 'Бронирование...';

    try {
        // TODO: Подключи здесь отправку данных в БД
        // Пример: const response = await fetch('/api/book', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         productId: currentProductId,
        //         date: bookingDateInput.value,
        //         time: selectedTimeSlot
        //     })
        // });

        // Имитация задержки
        await new Promise(resolve => setTimeout(resolve, 500));

        // Успешное бронирование
        alert(`✅ Бронирование подтверждено!\nДата: ${bookingDateInput.value}\nВремя: ${selectedTimeSlot}`);

        // Перезагружаем доступное время
        loadAvailableTimes(bookingDateInput.value);

    } catch (error) {
        console.error('Ошибка бронирования:', error);
        alert('❌ Ошибка при бронировании. Попробуйте ещё раз.');
    } finally {
        bookingSubmitBtn.disabled = false;
        bookingSubmitBtn.textContent = 'Подтвердить бронирование';
    }
}
