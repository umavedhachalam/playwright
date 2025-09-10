import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/login";
import { Selectors } from "../../selectors";

test.describe('Login Tests', () => {
  const selector = new Selectors();
  const password = process.env.PASSWORD || '';
  const email = process.env.EMAIL || '';
  const baseUrl = process.env.BASE_URL || '';
  const expectedUrl = `${baseUrl}/projects`;

  test.beforeEach(async ({ page }) => {
    // Go to the full URL of the login page
    await page.goto(`${baseUrl}/login`);
    const loginPage = new LoginPage(page, selector);
    await loginPage.login(email, password);
  });

  test('should successfully login and redirect to projects page', async ({ page }) => {
    // Verify URL after login
    await expect(page).toHaveURL(expectedUrl);
    // Additional assertions can be added here to verify successful login
    // await expect(page).toHaveTitle(/Projects/);
  });
  test('should click the Test project card', async({page})=> {
    const loginPage = new LoginPage(page, selector);
    await loginPage.openTestProject();
    await loginPage.clickEditOnProject();
    await loginPage.openProjectSetupTab();
    await loginPage.openRequirementListTab();
  });

});