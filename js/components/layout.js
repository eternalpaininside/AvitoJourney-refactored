import { renderHeader } from './headerComponent.js';
import { renderFooter } from './footerComponent.js';

export function initLayout() {
  const page = document.body?.dataset?.page;

  const headerMount = document.getElementById('app-header');
  if (headerMount) {
    headerMount.innerHTML = renderHeader({ page });
  }

  const footerMount = document.getElementById('app-footer');
  if (footerMount) {
    footerMount.innerHTML = renderFooter();
  }
}
