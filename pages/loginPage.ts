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
        // Helper to robustly pick a date
        const pickDate = async (inputSelector: string, dateCellSelector: string, value: string) => {
            const input = this.page.locator(inputSelector);
            await input.waitFor({ state: 'visible', timeout: 5000 });
            await input.waitFor({ state: 'attached', timeout: 5000 });
            // If calendar is already open, close it by pressing Escape
            if (await this.page.locator('.ant-picker-dropdown[style*="display: block"]').count() > 0) {
                await this.page.keyboard.press('Escape');
                await this.page.waitForSelector('.ant-picker-dropdown', { state: 'hidden', timeout: 2000 }).catch(() => {});
            }
            await input.click({ force: true });
            // Wait a bit for the popup to render
            await this.page.waitForTimeout(200);
            // Wait for the calendar popup
            await this.page.waitForSelector('.ant-picker-dropdown', { state: 'visible', timeout: 5000 });
            const dayCell = this.page.locator(dateCellSelector, { hasText: value });
            if (await dayCell.count() > 0) {
                await dayCell.first().click();
            } else {
                throw new Error(`Date cell with value '${value}' not found in calendar.`);
            }
        };
        const dueDateBox = this.loginFlow.projectInfo.dueDate;
        const reviewerDueDateBox = this.loginFlow.projectInfo.reviewerDueDate;
        const dateCellSelector = this.loginFlow.projectInfo.dateCell;
        if (!dueDateBox || !reviewerDueDateBox || !dateCellSelector) throw new Error('Date input or cell selector is undefined');
        await pickDate(dueDateBox, dateCellSelector, dueDate);
        await pickDate(reviewerDueDateBox, dateCellSelector, reviewerDueDate);
    }
}

