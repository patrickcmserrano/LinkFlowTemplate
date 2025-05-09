import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 1, // Aumentando retentativas
  workers: process.env.CI ? 2 : undefined,
  reporter: 'html',
  timeout: 60000, // Aumentando timeout global para 60 segundos
  expect: {
    timeout: 20000, // Aumentando timeout para assertions
    toMatchSnapshot: { maxDiffPixels: 100 } // Maior tolerância para snapshots
  },
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    // Capturar screenshot em caso de falha para facilitar debug
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // Configurações específicas para WebKit
        launchOptions: {
          slowMo: 100, // Adiciona delay entre ações
        },
        actionTimeout: 15000, // Timeout maior para ações
        navigationTimeout: 30000 // Timeout maior para navegação
      },
      timeout: 120000, // Timeout aumentado para testes no WebKit
      retries: 3 // Mais tentativas para WebKit
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});