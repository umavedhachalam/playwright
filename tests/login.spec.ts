import { test } from '@playwright/test';
import {createLogin} from '../pages/loginPage';
 
 
test('should login successfully', async ({ page }) => {
  await page.goto('/');
  await createLogin(page);
});