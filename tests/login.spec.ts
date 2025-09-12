import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import dotenv from 'dotenv';
dotenv.config();
 
 
test('should login successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const email = process.env.email!;
    const password = process.env.password!;
    await page.goto('/');
    await loginPage.login(email, password);
    await loginPage.selectProject();
    await loginPage.selectAutomationProject();
    await loginPage.fillProjectInfo


});

test('should select a project', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.selectProject();
});