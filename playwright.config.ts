import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // location of test specs
  timeout: 30 * 1000, // 30s timeout per test
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['list'], // CLI output
    ['html', { open: 'never' }], // HTML report
  ],
  use: {
    headless: true,
    baseURL: process.env.APP_URL || 'https://your-app-url.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1366, height: 768 },
  },
  outputDir: 'test-results',

  projects: [
    //  Setup project - logs in once and saves user.json
    {
      name: 'setup',
      testMatch: /.*setup\.ts/,
    },

    // Chromium tests
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // Firefox tests
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     storageState: 'playwright/.auth/user.json',
    //   },
    //   dependencies: ['setup'],
    // },

    // WebKit tests
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     storageState: 'playwright/.auth/user.json',
    //   },
    //   dependencies: ['setup'],
    // },
  ],
});
