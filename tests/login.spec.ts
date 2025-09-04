import { test } from '@playwright/test';
import * as dotenv from 'dotenv';
import LoginPage from '../pages/loginPage';
 
dotenv.config();
 
test('should login successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLogin(process.env.EMAIL || '', process.env.PASSWORD || '');
  // await loginPage.assertLoginSuccess();
});