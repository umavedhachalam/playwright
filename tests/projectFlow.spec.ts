import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import dotenv from 'dotenv';
dotenv.config();
import testData from '../test_data/validData.json';


test('should complete project flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const email = process.env.email!;
    const password = process.env.password!;
    await page.goto('/');
    await loginPage.login(email, password);
    await loginPage.selectProject();
     await loginPage.fillProjectInfo(testData.requirement);
    // Optionally, assert something after filling project info
});

