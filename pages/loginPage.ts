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
        // Click on the requirement (click Row)
        await this.page.locator(this.loginFlow.selectProject.processFinanceCell).first().click();
    }

    async fillProjectInfo(details: {
        priority?: string,
        category?: string,
        dataRequirement?: string,
        requirementTitle?: string,
        dueDate?: string,
        reviewerDueDate?: string
    }) {
        const tryFill = async (selector: string, value: string, isDate = false) => {
            if (!selector) throw new Error('Selector is undefined');
            const locator = this.page.locator(selector);
            try {
                await locator.waitFor({ state: 'visible', timeout: 5000 });
                const tag = await locator.evaluate(el => el.tagName.toLowerCase());
                if (isDate) {
                    await locator.click(); // open the date picker
                    await this.page.waitForSelector('.ant-picker-dropdown', { state: 'visible', timeout: 5000 });
                    const dateCellSelector = this.loginFlow.projectInfo.dateCell;
                    const dayCell = this.page.locator(dateCellSelector, { hasText: value });
                    if (await dayCell.count() > 0) {
                        await dayCell.first().click();
                    } else {
                        throw new Error(`Date cell with value '${value}' not found in calendar.`);
                    }
                } else if (['input', 'textarea', 'select'].includes(tag) || await locator.getAttribute('contenteditable')) {
                    await locator.fill(value);
                } else {
                    await locator.click();
                    await this.page.getByRole('option', { name: value }).click();
                }
            } catch (e) {
                console.error(`Could not fill/select selector: ${selector} with value: ${value}`);
                throw e;
            }
        };
        if (details.priority) {
            await tryFill(this.loginFlow.projectInfo.priority, details.priority);
        }
        if (details.category) {
            await tryFill(this.loginFlow.projectInfo.category, details.category);
        }
        if (details.dataRequirement) {
            await tryFill(this.loginFlow.projectInfo.dataRequirement, details.dataRequirement);
        }
        if (details.requirementTitle) {
            await tryFill(this.loginFlow.projectInfo.requirementTitle, details.requirementTitle);
        }
        // if (details.dueDate) {
        //     await tryFill(this.loginFlow.projectInfo.dueDateBox, details.dueDate, true);
        // }
        // if (details.reviewerDueDate) {
        //     await tryFill(this.loginFlow.projectInfo.reviewerDueDateBox, details.reviewerDueDate, true);
        // }
    }

    async pickDueAndReviewerDates(dueDate: string, reviewerDueDate: string) {
        // Pick Due Date
        await this.page.locator(this.loginFlow.projectInfo.dueDateBox).click();
        await this.page.locator(this.loginFlow.projectInfo.dateCell, { hasText: dueDate }).click();
        // Pick Reviewer Due Date
        await this.page.locator(this.loginFlow.projectInfo.reviewerDueDateBox).click();
        await this.page.locator(this.loginFlow.projectInfo.dateCell, { hasText: reviewerDueDate }).click();
    }
}

