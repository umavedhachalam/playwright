import { Page, expect } from "@playwright/test";
import { Selectors } from "../selectors";
 
export class LoginPage {
  private loginSelectors;
  constructor(private page: Page, private selectors: Selectors) {
    this.loginSelectors = this.selectors.loginSelectors;
  }
 
  async loginFlow(email: string, password: string) {
    await this.page.locator(this.loginSelectors.emailInput).fill(email);
    await this.page.locator(this.loginSelectors.passwordInput).fill(password);
    await this.page.locator(this.loginSelectors.loginButton).click();
  }
  
}
 