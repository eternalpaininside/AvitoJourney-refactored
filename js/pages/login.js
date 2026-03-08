import { setAuthed } from '../storage/auth.js';

export function initLoginPage() {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginMsg = document.getElementById('loginMessage');
  const registerMsg = document.getElementById('registerMessage');

  const toRegisterBtn = document.getElementById('toRegisterBtn');
  const toLoginBtn = document.getElementById('toLoginBtn');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');

  function clearMessages() {
    if (loginMsg) loginMsg.textContent = '';
    if (registerMsg) registerMsg.textContent = '';
  }

  function showRegisterForm() {
    loginForm?.classList.add('hidden');
    registerForm?.classList.remove('hidden');
    clearMessages();
  }

  function showLoginForm() {
    registerForm?.classList.add('hidden');
    loginForm?.classList.remove('hidden');
    clearMessages();
  }

  toRegisterBtn?.addEventListener('click', showRegisterForm);
  toLoginBtn?.addEventListener('click', showLoginForm);

  loginBtn?.addEventListener('click', () => {
    const email = document.getElementById('loginEmail')?.value || '';
    const password = document.getElementById('loginPassword')?.value || '';

    if (email && password) {
      setAuthed(true);
      if (loginMsg) {
        loginMsg.textContent = 'Вход выполнен успешно!';
        loginMsg.style.color = 'green';
      }
      setTimeout(() => { window.location.href = 'index.html'; }, 300);
    } else if (loginMsg) {
      loginMsg.textContent = 'Пожалуйста, заполните все поля.';
      loginMsg.style.color = 'red';
    }
  });

  registerBtn?.addEventListener('click', () => {
    const name = document.getElementById('registerName')?.value || '';
    const email = document.getElementById('registerEmail')?.value || '';
    const password = document.getElementById('registerPassword')?.value || '';
    const confirmPassword = document.getElementById('confirmPassword')?.value || '';

    if (!name || !email || !password || !confirmPassword) {
      if (registerMsg) {
        registerMsg.textContent = 'Пожалуйста, заполните все поля.';
        registerMsg.style.color = 'red';
      }
      return;
    }

    if (password !== confirmPassword) {
      if (registerMsg) {
        registerMsg.textContent = 'Пароли не совпадают.';
        registerMsg.style.color = 'red';
      }
      return;
    }

    setAuthed(true);
    if (registerMsg) {
      registerMsg.textContent = 'Регистрация успешна!';
      registerMsg.style.color = 'green';
    }
    setTimeout(() => { window.location.href = 'user.html'; }, 300);
  });
}
