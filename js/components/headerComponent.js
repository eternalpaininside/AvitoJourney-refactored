export function renderHeader({ page } = {}) {
  const showSearch = page === 'home';

  return `
    <div class="header">
      <a href="index.html" class="logo-link" aria-label="На главную">
        <div class="logo">PLACE<br>HOLDER</div>
      </a>
      ${showSearch ? `
        <div class="search-container">
          <input type="text" class="search-input" placeholder="🔍" id="searchInput">
        </div>
      ` : '<div class="search-container search-container-empty" aria-hidden="true"></div>'}
      <a href="user.html" class="user-icon-link" aria-label="Мой профиль" data-role="profile-link">
        <div class="user-icon">👤</div>
      </a>
    </div>
  `;
}
