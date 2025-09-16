import { Page } from '@playwright/test';
import { NewSelectors } from '../selectors/new_index';

export class LoginPage {
  readonly page: Page;
  readonly selectors: NewSelectors;

  constructor(page: Page) {
    this.page = page;
    this.selectors = new NewSelectors();
  }

  async login(username,password) {
    const data = this.selectors.loginData;
    const valid = this.selectors.validData;

  await this.page
  .getByRole(data.login.emailField.role as any, { name: data.login.emailField.name })
  .fill(username);

await this.page
  .getByRole(data.login.passwordField.role as any, { name: data.login.passwordField.name })
  .fill(password);

await this.page
  .getByRole(data.login.loginButton.role as any, { name: data.login.loginButton.name })
  .click();


// Project flow
await this.page.getByText(data.project.school.text).click();

await this.page
  .getByRole(data.project.viewProjectHeading.role as any, { name: data.project.viewProjectHeading.name })
  .click();

await this.page
  // .getByRole(data.project.searchBox.role as any, { name: data.project.searchBox.name }).fill(data.project.searchdata.text);
//  await this.page.keyboard.press('Enter');
//  await this.page.getByRole(data.project.searchBox.role as any, { name: data.project.searchBox.name }).type('k');
//  await this.page.keyboard.press('Tab');
 
 
 await this. page.locator('td', { hasText: 'neural_network' }).click();


"data":"school001",
    "priority": "high",
    "requirementTitle": "neural_network",
    "process": "technology",
    "dueDate":"22-08-2025",
    "department":"it/cse",
    "dataRequirement":"data",
    "company":"School",
    "custodian":"thursday",
    "reviewer":"friday",
     "query":"Hey",
     "threeDot":"Move to Query",
     "reviewerDueDate":"22-08-2025",
     "escalation1":"friday",
     "escalation2":"tuesday"


    await this.page.getByTestId(data.project.requirementTitle.text).filter({ hasText: valid.custodianValid.requirementTitle });
    await this.page.getByText(data.project.priorityMedium.text).filter({ hasText: valid.custodianValid.priority});
    await this.page.getByText(data.project.companySchool.text).filter({ hasText: valid.custodianValid.company });
    await this.page.getByText(data.project.custodianThursday.text).filter({ hasText: valid.custodianValid.custodian});
    await this.page.getByText(data.project.reviewerFriday.text).filter({ hasText: valid.custodianValid.reviewer});
    await this.page.getByText(data.project.escalation1Friday.text).filter({ hasText: valid.custodianValid.escalation1 });
    await this.page.getByText(data.project.escalation3Tuesday.text).filter({ hasText: valid.custodianValid.escalation2 });

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
    await this.page.waitForURL(data.urls.projectsPage);
  }
}
