import { installImageFallback } from './utils/images.js';
import { initLayout } from './components/layout.js';
import { initHeader } from './components/header.js';

import { initHomePage } from './pages/home.js';
import { initProductPage } from './pages/product.js';
import { initSellerPage } from './pages/seller.js';
import { initUserPage } from './pages/user.js';
import { initLoginPage } from './pages/login.js';
import { initChatPage } from './pages/chat.js';

document.addEventListener('DOMContentLoaded', async () => {
  installImageFallback();
  initLayout();
  initHeader();

  const page = document.body?.dataset?.page;

  try {
    if (page === 'home') await initHomePage();
    else if (page === 'product') await initProductPage();
    else if (page === 'seller') await initSellerPage();
    else if (page === 'user') initUserPage();
    else if (page === 'login') initLoginPage();
    else if (page === 'chat') initChatPage();
  } catch (e) {
    console.error('Init error:', e);
  }
});
