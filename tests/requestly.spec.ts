import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/requestly';

dotenv.config();

test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);

  const username = process.env.USERNAMES as string;
  const password = process.env.PASSWORDS as string;

  await page.goto('/login');
  await loginPage.login(username, password);
});
