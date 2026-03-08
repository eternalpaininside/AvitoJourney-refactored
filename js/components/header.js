import { isAuthed } from '../storage/auth.js';

export function initHeader() {
  const profileLink = document.querySelector('[data-role="profile-link"]');
  if (profileLink) {
    profileLink.setAttribute('href', isAuthed() ? 'user.html' : 'login.html');
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
