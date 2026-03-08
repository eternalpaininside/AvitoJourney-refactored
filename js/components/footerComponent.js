export function renderFooter() {
  return `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>О компании</h3>
          <p>ТужорниПерни - ваш надёжный помощник в мире путешествий. Работаем с 2026 года.</p>
          <p>
            ИНН: 1234567890<br>
            ОГРН: 1234567890123<br>
            г. Пермь, ул. Аллея, д. 228
          </p>
        </div>
        <div class="footer-section">
          <h3>Политика</h3>
          <ul>
            <li><a href="#">Политика конфиденциальности</a></li>
            <li><a href="#">Условия использования</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Мы в соцсетях</h3>
          <div class="social-links">
            <a href="#" aria-label="Telegram">Telegram</a><br>
            <a href="#" aria-label="YouTube">YouTube</a><br>
            <a href="#" aria-label="VK">VK</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 ТужорниПерни. Все права защищены.</p>
      </div>
    </footer>
  `;
}
