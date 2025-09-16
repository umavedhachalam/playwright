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
        const projectSelector = this.loginFlow.selectProject.project;
        if (!projectSelector) throw new Error('Selector for project card is undefined');
        await this.page.locator(projectSelector).waitFor({ state: 'visible', timeout: 5000 });
        await this.page.locator(projectSelector).click();
        // Click on the project with the specified text
        const clickProject = this.loginFlow.selectProject.clickProject;
        if (!clickProject) throw new Error('Selector for clickProject is undefined');
        await this.page.getByText(clickProject).waitFor({ state: 'visible', timeout: 5000 });
        await this.page.getByText(clickProject).click();
        // Click on the dev boys cell
        const devBoysCellSelector = this.loginFlow.selectProject.devBoysCell;
        if (!devBoysCellSelector) throw new Error('Selector for dev boys cell is undefined');
        const devBoysCell = this.page.locator(devBoysCellSelector).first();
        await devBoysCell.waitFor({ state: 'visible', timeout: 5000 });
        await devBoysCell.click();
    }

    async selectDevBoysCell() {
        const devBoysCellSelector = this.loginFlow.selectProject.devBoysCell;
        if (!devBoysCellSelector) throw new Error('Selector for dev boys cell is undefined');
        const devBoysCell = this.page.locator(devBoysCellSelector).first();
        await devBoysCell.waitFor({ state: 'visible', timeout: 5000 });
        await devBoysCell.click();
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
    }

    async pickDueAndReviewerDates(dueDate: string, reviewerDueDate: string) {
        // Use separate selectors for input and cell for each field
        const dueDateInput = this.loginFlow.projectInfo.dueDateInput || this.loginFlow.projectInfo.dueDate;
        const dueDateCell = this.loginFlow.projectInfo.dueDateCell || this.loginFlow.projectInfo.dateCell;
        const reviewerDueDateInput = this.loginFlow.projectInfo.reviewerDueDateInput || this.loginFlow.projectInfo.reviewerDueDate;
        const reviewerDueDateCell = this.loginFlow.projectInfo.reviewerDueDateCell || this.loginFlow.projectInfo.dateCell;
        if (!dueDateInput || !dueDateCell || !reviewerDueDateInput || !reviewerDueDateCell) throw new Error('Date input or cell selector is undefined');
        // Pick Due Date
        await this.page.locator(dueDateInput).click();
        await this.page.waitForSelector('.ant-picker-dropdown', { state: 'visible', timeout: 5000 });
        const dueDayCell = this.page.locator(dueDateCell, { hasText: dueDate });
        if (await dueDayCell.count() > 0) {
            await dueDayCell.first().click();
        } else {
            throw new Error(`Due date cell with value '${dueDate}' not found in calendar.`);
        }
        // Pick Reviewer Due Date
        await this.page.locator(reviewerDueDateInput).click();
        await this.page.waitForSelector('.ant-picker-dropdown', { state: 'visible', timeout: 5000 });
        const reviewerDayCell = this.page.locator(reviewerDueDateCell, { hasText: reviewerDueDate });
        if (await reviewerDayCell.count() > 0) {
            await reviewerDayCell.first().click();
        } else {
            throw new Error(`Reviewer due date cell with value '${reviewerDueDate}' not found in calendar.`);
        }
    }

}