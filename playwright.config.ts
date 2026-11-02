import { defineConfig, devices } from '@playwright/test';

// Smoke tests contra el build estático servido por PHP (igual que Hostinger), con el formulario en modo dry-run.
// Usa el Chrome instalado en la máquina (channel: 'chrome'), sin descargar navegadores.
export default defineConfig({
  testDir: './tests',
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:8791', channel: 'chrome' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome', viewport: { width: 360, height: 780 }, deviceScaleFactor: 2 } },
  ],
  webServer: {
    command: 'php -S 127.0.0.1:8791 -t dist scripts/php-router.php',
    url: 'http://127.0.0.1:8791/',
    reuseExistingServer: true,
    env: { LEAD_DRY_RUN: '1' },
  },
});
