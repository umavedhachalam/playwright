import { Selector } from '../selectors/index';
import * as dotenv from 'dotenv';
dotenv.config();

export class LoginPage {
    private page: any;
    private selector: Selector;
    private loginFlow: any;

    constructor(page: any) {
        this.page = page;
        this.selector = new Selector();
        this.loginFlow = this.selector.loginFlow;
    }

    async login(email: string, password: string) {
        await this.page.locator(this.loginFlow.loginCredentials.usernameInput).fill(email);
        await this.page.locator(this.loginFlow.loginCredentials.passwordInput).fill(password);
        await this.page.getByRole("button", { name: "Log in" }).click();
    }

    async selectProject() {
        // Click on the project card
        await this.page.locator(this.loginFlow.selectProject.project).click();
        // Click on the project with the specified text
        await this.page.getByText(this.loginFlow.selectProject.clickProject).click();
        // Click on the requirement
        await this.page.locator(this.loginFlow.selectProject.selectRequirement).click();
    }

    async selectAutomationProject() {
        // Click on the Automation title
        await this.page.locator(this.loginFlow.selectProject.automationTitle).click();
        // Click on the edit icon
        await this.page.locator(this.loginFlow.selectProject.editIcon).click();
    }

    async fillProjectInfo(details: {
        priority?: string,
        category?: string,
        dataRequirement?: string,
        requirementTitle?: string,
        dueDate?: string,
        reviewerDueDate?: string
    }) {
        if (details.priority) {
            await this.page.locator(this.loginFlow.projectInfo.priority).fill(details.priority);
        }
        if (details.category) {
            await this.page.locator(this.loginFlow.projectInfo.category).fill(details.category);
        }
        if (details.dataRequirement) {
            await this.page.locator(this.loginFlow.projectInfo.dataRequirement).fill(details.dataRequirement);
        }
        if (details.requirementTitle) {
            await this.page.locator(this.loginFlow.projectInfo.requirementTitle).fill(details.requirementTitle);
        }
        if (details.dueDate) {
            await this.page.locator(this.loginFlow.projectInfo.dueDate).fill(details.dueDate);
        }
        if (details.reviewerDueDate) {
            await this.page.locator(this.loginFlow.projectInfo.reviewerDueDate).fill(details.reviewerDueDate);
        }
    }
}


