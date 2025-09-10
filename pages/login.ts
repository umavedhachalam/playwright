import { Page } from "@playwright/test";
import { Selectors } from "../selectors/index";
 
export class LoginPage {
 
  private selector: Selectors["loginSelectors"];

  constructor(private page: Page,selectors:Selectors) {
    this.selector = selectors.loginSelectors;

  }
  async login(email: string, password: string) {
    // console.log('??',email,password);
    // console.log('??', this.selector.login.email);
    await this.page.getByPlaceholder(this.selector.login.email).fill(email);
    await this.page.getByPlaceholder(this.selector.login.password).fill(password);  
    await this.page.getByText(this.selector.login.loginbtn).click();
   
  }
  async openTestProject() {
    await this.page.getByText(this.selector.dashboard.testProjectCard, { exact: true }).click();
  }
  async clickEditOnProject() {
    const projectName = this.selector.dashboard.testProjectCard;
    const card = this.page.locator(
      `xpath=//*[normalize-space(text())=\"${projectName}\"]/ancestor::*[self::div or self::section or self::article][1]`
    );
    await card.first().waitFor({ state: 'visible' });
    await card.first().scrollIntoViewIfNeeded();
    await card.first().hover({ trial: true }).catch(() => {});

    const candidates = [
      card.getByRole('button', { name: /edit/i }),
      card.locator('button:has-text("Edit")'),
      card.locator('[aria-label*="Edit" i]'),
      card.locator('[title*="Edit" i]'),
      card.locator('a:has-text("Edit")')
    ];

    for (const locator of candidates) {
      try {
        const count = await locator.count();
        if (count > 0) {
          await locator.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
          await Promise.all([
            this.page.waitForLoadState('networkidle'),
            locator.first().click()
          ]);
          return;
        }
      } catch {}
    }
    throw new Error('Edit button not found within the Test project card');
  }
  async openProjectSetupTab() {
    const tab = this.page.getByRole('tab', { name: this.selector.dashboard.projectSetupTab });
    await tab.waitFor({ state: 'visible' });
    await tab.click();
  }
  async openRequirementListTab() {
    const tab = this.page.getByRole('tab', { name: this.selector.dashboard.requirementListTab });
    await tab.waitFor({ state: 'visible' });
    await tab.click();
  }
  
}