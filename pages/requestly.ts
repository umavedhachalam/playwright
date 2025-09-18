import { expect, Page } from '@playwright/test';
import { NewSelectors } from '../selectors/new_index';

export class LoginPage {
  readonly page: Page;
  readonly selectors: NewSelectors;

  constructor(page: Page) {
    this.page = page;
    this.selectors = new NewSelectors();
  }

  async login(username, password) {
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


    await this.page.locator(data.project.neuralNetworkCell.locator).filter( { hasText: data.project.neuralNetworkCell.hasText}).click();


    //Data Verification from json file

    await this.page.locator(data.project.requirementTitle).filter({ hasText: valid.custodianValid.requirementTitle });
    await this.page.locator(data.project.priority).filter({ hasText: valid.custodianValid.priority });
    await this.page.locator(data.project.category).filter({ hasText: valid.custodianValid.process });
    await this.page.locator(data.project.dataRequirement).filter({ hasText: valid.custodianValid.dataRequirement });
    await this.page.locator(data.project.dueDate).filter({ hasText: valid.custodianValid.dueDate });
    await this.page.locator(data.project.department).filter({ hasText: valid.custodianValid.department });
    await this.page.locator(data.project.company).filter({ hasText: valid.custodianValid.company });
    await this.page.locator(data.project.custodian).filter({ hasText: valid.custodianValid.custodian });
    await this.page.locator(data.project.reviewer).filter({ hasText: valid.custodianValid.reviewer });
    await this.page.locator(data.project.reviewerDueDate).filter({ hasText: valid.custodianValid.reviewerDueDate });
    await this.page.locator(data.project.query).filter({ hasText: valid.custodianValid.query });


    await this.page.locator(data.project.company).filter({ hasText: valid.custodianValid.company });

    await this.page.locator(data.project.escalation1).filter({ hasText: valid.custodianValid.escalation1 });
    await this.page.locator(data.project.escalation2).filter({ hasText: valid.custodianValid.escalation2 });
    await this.page.locator(data.project.query).fill(this.selectors.validData.testData.query);

    await this.page.locator(data.project.kebabMenu).click();
    await this.page.locator(data.project.actionMenu).filter({ hasText: data.project.actionMenuText }).click();
    await this.page.getByRole(data.project.cancel as any).click();

    



    //a=wait this.page.pause();
    //expect(a).tovisible();
    //to have , has, contains


  }
}
