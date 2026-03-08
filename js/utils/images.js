export function safeImageMarkup(src, alt, classes = '') {
  const safeAlt = String(alt ?? '').replace(/"/g, '&quot;');
  const safeSrc = String(src ?? '').replace(/"/g, '&quot;');
  return `<img src="${safeSrc}" alt="${safeAlt}" class="${classes}" data-fallback="1" loading="lazy">`;
}

export function installImageFallback() {
  document.addEventListener('error', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (target.dataset.fallback !== '1') return;

    target.dataset.fallback = '0';
    target.src = '../images/placeholder-card.svg';
  }, true);
}
