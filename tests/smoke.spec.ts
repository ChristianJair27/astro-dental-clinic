import { test, expect } from '@playwright/test';

test('home: SEO básico, CTA WhatsApp y schema Dentist', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/.+/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\//);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og\.png$/);

  const wa = page.locator('a[href^="https://wa.me/"]').first();
  await expect(wa).toHaveAttribute('href', /\?text=.+/);

  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
  const parsed = schemas.map((s) => JSON.parse(s) as Record<string, unknown>);
  const types = parsed.map((s) => s['@type']);
  expect(types).toContain('FAQPage');
  expect(types).toContain('Dentist');
  const biz = parsed.find((s) => s['@type'] === 'Dentist');
  expect(biz?.['employee']).toMatchObject({ '@type': 'Person' });
});

test('secciones clave y cédula profesional visible', async ({ page }) => {
  await page.goto('/');
  for (const id of ['tratamientos', 'especialista', 'primera-visita', 'pagos', 'opiniones', 'preguntas', 'ubicacion', 'cita']) {
    await expect(page.locator(`section#${id}`)).toBeAttached();
  }
  await page.locator('#especialista').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-testid="cedula"]')).toBeVisible();
  await expect(page.locator('[data-testid="cedula"]')).not.toBeEmpty();
  await expect(page.locator('#especialista img')).toHaveAttribute('src', /\.webp$/);
  await expect(page.locator('[data-testid="testimonials-demo"]')).toBeVisible();
});

test('click en WhatsApp dispara whatsapp_click', async ({ page, context }) => {
  await context.route('https://wa.me/**', (r) => r.abort());
  await page.goto('/');
  await page.locator('[data-section="hero"] a[href^="https://wa.me/"]').click();
  const events = await page.evaluate(() => window.dataLayer.map((e) => (e as { event?: string }).event));
  expect(events).toContain('whatsapp_click');
});

test('WhatsApp del formulario arma el mensaje con tratamiento y horario', async ({ page }) => {
  await page.goto('/#cita');
  await page.selectOption('#f-service', 'Endodoncia');
  await page.selectOption('#f-time', { index: 2 });
  const time = await page.locator('#f-time').inputValue();
  const href = await page.locator('#wa-form').getAttribute('href');
  const text = decodeURIComponent(new URL(href ?? '').searchParams.get('text') ?? '');
  expect(text).toContain('Endodoncia');
  expect(text).toContain(time);
  // Cada tarjeta de tratamiento también lleva su mensaje.
  const card = page.locator('#tratamientos a[href^="https://wa.me/"]').first();
  await expect(card).toHaveAttribute('href', /Valoraci%C3%B3n/);
});

test('formulario de cita: éxito dispara generate_lead', async ({ page }) => {
  await page.goto('/#cita');
  await page.fill('#f-name', 'Prueba Playwright');
  await page.fill('#f-phone', '442 000 0000');
  await page.selectOption('#f-service', 'Limpieza dental');
  await page.selectOption('#f-time', { index: 1 });
  await page.check('#f-consent');
  await page.waitForTimeout(3100); // trampa de tiempo mínimo del endpoint
  await page.click('#lead-form button[type="submit"]');
  await expect(page.locator('#form-status')).toContainText('Gracias');
  const lead = await page.evaluate(() => window.dataLayer.find((e) => (e as { event?: string }).event === 'generate_lead'));
  expect(lead).toMatchObject({ service: 'Limpieza dental', source: 'cita_form' });
});

test('formulario: sin aceptar aviso de privacidad no se envía', async ({ page }) => {
  let posted = false;
  await page.route('**/api/lead.php', (r) => {
    posted = true;
    return r.fulfill({ status: 200, body: '{"ok":true}' });
  });
  await page.goto('/#cita');
  await page.fill('#f-name', 'Prueba');
  await page.fill('#f-phone', '4420000000');
  await page.click('#lead-form button[type="submit"]');
  await page.waitForTimeout(300);
  expect(posted).toBe(false);
});

test('endpoint PHP rechaza solicitud sin consentimiento', async ({ request }) => {
  const res = await request.post('/api/lead.php', { form: { name: 'Prueba', phone: '4420000000', service: 'Limpieza dental' } });
  expect(res.status()).toBe(422);
  expect(await res.json()).toMatchObject({ fields: ['consent'] });
});

test('formulario: error muestra fallback a WhatsApp', async ({ page }) => {
  await page.route('**/api/lead.php', (r) => r.fulfill({ status: 500, body: '{"ok":false}' }));
  await page.goto('/#cita');
  await page.fill('#f-name', 'Prueba');
  await page.fill('#f-phone', '4420000000');
  await page.check('#f-consent');
  await page.click('#lead-form button[type="submit"]');
  await expect(page.locator('#form-status a[href^="https://wa.me/"]')).toBeVisible();
});

test('formulario: honeypot presente y oculto', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#f-website')).toBeAttached();
  await expect(page.locator('#f-website')).not.toBeInViewport();
});

test('404 real, aviso de privacidad, robots/sitemap', async ({ page, request }) => {
  const res = await request.get('/no-existe-esta-ruta');
  expect(res.status()).toBe(404);
  expect((await request.get('/404.html')).status()).toBe(200);
  expect((await request.get('/aviso-de-privacidad/')).status()).toBe(200);
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap:');
  expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
  await page.goto('/404.html');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('sin scroll horizontal y footer visible', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.locator('footer').scrollIntoViewIfNeeded();
  await expect(page.locator('footer')).toBeVisible();
});

test('capturas', async ({ browser }, info) => {
  // Captura en un contexto con deviceScaleFactor 1: con DPR 2 la página completa en móvil supera el
  // límite de textura de Chrome (16384 px) y la captura repite secciones.
  const width = info.project.name === 'mobile' ? 360 : 1280;
  const context = await browser.newContext({ viewport: { width, height: 800 }, deviceScaleFactor: 1, isMobile: info.project.name === 'mobile' });
  const page = await context.newPage();
  await page.goto('/');
  // Carga la imagen lazy antes de la captura.
  await page.locator('#especialista img').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => (document.querySelector('#especialista img') as HTMLImageElement | null)?.complete === true);
  // fullPage en emulación móvil duplica secciones; se agranda el viewport a la altura total del documento.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewportSize({ width, height });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: `shots/${info.project.name}.png` });
  await context.close();
});
