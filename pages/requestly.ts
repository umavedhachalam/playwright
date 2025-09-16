import { Page } from '@playwright/test';
import { NewSelectors } from '../selectors/new_index';

export class LoginPage {
  readonly page: Page;
  readonly selectors: NewSelectors;

  constructor(page: Page) {
    this.page = page;
    this.selectors = new NewSelectors();
  }

  async login(username: string, password: string) {
    const data = this.selectors.loginData;

  await this.page
  .getByRole(data.login.emailField.role as any, { name: data.login.emailField.name })
  .fill(username);

await this.page
  .getByRole(data.login.passwordField.role as any, { name: data.login.passwordField.name })
  .fill(password);

// await this.page
//   .getByRole(data.login.loginButton.role as any, { name: data.login.loginButton.name })
//   .click();

await this. page.getByRole(data.login.loginButton.role as any).click();

// Project flow
await this.page.getByText(data.project.school.text).click();

await this.page
  .getByRole(data.project.viewProjectHeading.role as any, { name: data.project.viewProjectHeading.name })
  .click();

await this.page
  .getByRole(data.project.searchBox.role as any, { name: data.project.searchBox.name }).fill(data.project.searchdata.text);
  await this.page.keyboard.press('Enter');


    await this.page.getByText(data.project.priorityMedium.text).click();
    await this.page.getByText(data.project.companySchool.text).click();
    await this.page.getByText(data.project.custodianThursday.text).click();
    await this.page.getByText(data.project.reviewerFriday.text).click();
    await this.page.getByText(data.project.escalation1Friday.text).click();
    await this.page.getByText(data.project.escalation3Tuesday.text).click();

   await this.page
  .getByRole(data.project.escalation1Combobox.role as any)
  .filter({ hasText: data.project.escalation1Combobox.filterText })
  .click();

    // 🔹 Locators
    await this.page.locator(data.locators.escalation1Icon).click();
    await this.page.locator(data.locators.escalation3Icon).click();
    await this.page.locator(data.locators.escalation2Icon).click();

    // 🔹 Attachment
    await this.page
      .getByRole(data.attachment.button.role as any, { name: data.attachment.button.name })
      .click();
    await this.page.locator(data.attachment.modal).first().press('Escape');
    await this.page
      .getByRole(data.attachment.button.role as any, { name: data.attachment.button.name })
      .press('Escape');

    // 🔹 Wait for project page
    await this.page.waitForURL(data.urls.projectsPage);
  }
}
