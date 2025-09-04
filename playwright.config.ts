import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
 
// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '.env') });
 
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
  baseURL: 'https://dev.noqu.app/#/login',
  trace: 'on-first-retry',
  video: 'retain-on-failure',
  screenshot: 'only-on-failure',
},
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
 
 