// Renders product cards from products.json (no inline scripts, CSP-friendly)
const DEFAULT_AFFILIATE = 'https://jforce.jumia.co.ke/s/eeIzZkk';
const FALLBACK_IMG = 'images/redmi-15c.jpg';

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
// Only allow https links to Jumia domains, otherwise fall back to the main affiliate link
function safeLink(url, fallback) {
  try {
    const u = new URL(url);
    if (u.protocol === 'https:' && /(^|\.)jumia\.co\.ke$/.test(u.hostname)) return u.href;
  } catch (e) {}
  return fallback;
}
async function loadAndRenderProducts(category, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  try {
    const res = await fetch('products.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    let list = data[category] || [];
    const limit = parseInt(el.dataset.limit, 10);
    if (limit > 0) list = list.slice(0, limit);
    const affiliate = safeLink(data.settings && data.settings.affiliateLink, DEFAULT_AFFILIATE);
    if (!list.length) { el.innerHTML = '<p class="empty-note">New products coming soon.</p>'; return; }
    el.innerHTML = list.map(p => `
      <article class="product-card${p.featured ? ' featured' : ''}">
        ${p.badge ? `<div class="product-badge">${escapeHtml(p.badge)}</div>` : ''}
        <div class="product-img-wrap"><img loading="lazy" decoding="async" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}"></div>
        <div class="product-body">
          <h3>${escapeHtml(p.name)}</h3>
          <p class="product-meta">${escapeHtml(p.meta)}</p>
          <p>${escapeHtml(p.description)}</p>
          <div class="product-actions">
            <a href="${escapeHtml(safeLink(p.affiliateUrl, safeLink(p.url, affiliate)))}" class="btn ${p.featured ? 'btn-primary' : 'btn-outline'} btn-sm" target="_blank" rel="sponsored noopener noreferrer">Shop on Jumia</a>
          </div>
        </div>
      </article>`).join('');
    el.querySelectorAll('img').forEach(img => img.addEventListener('error', () => { img.src = FALLBACK_IMG; }, { once: true }));
  } catch (e) {
    console.error(e);
    el.innerHTML = '<p class="empty-note">Could not load products right now. Please refresh or try again later.</p>';
  }
}
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-category]').forEach(grid => loadAndRenderProducts(grid.dataset.category, grid.id));
});
