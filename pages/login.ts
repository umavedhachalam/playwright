import { Page } from '@playwright/test';
import { LoginSelect ,login_select_new} from '../selectors/index';


export class LoginPage {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }
  async loginFlow(username: string, password: string) {
    await this.page.locator(login_select_new.usernameInput).waitFor({ state: 'visible' });
    await this.page.fill(login_select_new.usernameInput, username);
    await this.page.locator(login_select_new.passwordInput).waitFor({ state: 'visible' });
    await this.page.fill(login_select_new.passwordInput, password);
    await this.page.locator(login_select_new.loginButton).click();
  }
}