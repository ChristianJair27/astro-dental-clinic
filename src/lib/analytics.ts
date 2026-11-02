// Eventos GA4: generate_lead, whatsapp_click, phone_click, email_click.
// Funciona aunque GA4 no esté configurado (solo empuja a dataLayer).

type Params = Record<string, string | number | undefined>;

export function track(event: string, params: Params = {}): void {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  } else {
    window.dataLayer.push({ event, ...params });
  }
}

/** Conversión de Google Ads para leads (si PUBLIC_ADS_ID y PUBLIC_ADS_LEAD_LABEL existen). */
export function trackAdsLead(): void {
  const id = import.meta.env.PUBLIC_ADS_ID;
  const label = import.meta.env.PUBLIC_ADS_LEAD_LABEL;
  if (id && label && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', { send_to: `${id}/${label}` });
  }
}

function linkLocation(el: Element): string {
  return el.closest('[data-section]')?.getAttribute('data-section') ?? 'unknown';
}

document.addEventListener('click', (e) => {
  const a = (e.target as Element | null)?.closest('a[href]');
  if (!a) return;
  const href = a.getAttribute('href') ?? '';
  const location = linkLocation(a);
  if (href.startsWith('https://wa.me/')) track('whatsapp_click', { location });
  else if (href.startsWith('tel:')) track('phone_click', { location });
  else if (href.startsWith('mailto:')) track('email_click', { location });
});
