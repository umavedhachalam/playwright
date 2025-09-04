import { Page, expect } from '@playwright/test';
import selectors from '../selectors/Login.json';
 
export default class LoginPage {
  readonly page: Page;
 
  constructor(page: Page) {
    this.page = page;
  }
 
  async gotoLogin(email:string, password:string) {
    await this.page.goto('/login');
    await this.page.locator(selectors.usernameInput).fill(email);
    await this.page.locator(selectors.passwordInput).fill(password);
    await this.page.locator(selectors.loginButton).click();
  }
 
 
  // async assertLoginSuccess() {
  //   await expect(this.page).toHaveURL(/dashboard);
  // }
}