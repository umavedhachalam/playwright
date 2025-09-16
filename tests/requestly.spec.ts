import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/requestly';

dotenv.config();

test('login test', async ({ page }) => {
  const loginPage = new LoginPage(page);

  const username = process.env.USERNAMES;
  const password = process.env.PASSWORDS ;
  const url = process.env.URL ;

  await page.goto(url + '/login');   
  await loginPage.login(username, password);

  
});
