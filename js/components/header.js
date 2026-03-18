import { isAuthed, isSeller } from '../storage/auth.js';

export function initHeader() {
  const profileLink = document.querySelector('[data-role="profile-link"]');
  if (profileLink) {
    if (!isAuthed()) {
      profileLink.setAttribute('href', 'login.html');
    } else if (isSeller()) {
      profileLink.setAttribute('href', 'seller-dashboard.html');
    } else {
      profileLink.setAttribute('href', 'user.html');
    }
  }

  document.querySelectorAll('[data-go]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const to = el.getAttribute('data-go');
      if (!to) return;
      e.preventDefault();
      window.location.href = to;
    });
  });
}
