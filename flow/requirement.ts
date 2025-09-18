import { Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { RequirementData } from '../src/utils/requirementData';

export class RequirementFlow {
    private page: Page;
    private loginPage: LoginPage;

    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
    }

    async updateRequirement(email: string, password: string) {
        // Login
        await this.loginPage.login(email, password);
        
        // Select project
        await this.loginPage.selectProject();
        
        // Generate random requirement data
        const requirementData = RequirementData.generateRequirementData();
        
        // Fill project info with random data
        await this.loginPage.fillProjectInfo({
            priority: requirementData.priority,
            category: requirementData.category,
            dataRequirement: requirementData.dataRequirement,
            requirementTitle: requirementData.requirementTitle
            




        });

        // Set dates
        // await this.loginPage.pickDueAndReviewerDates(
        //     requirementData.dueDate,
        //     requirementData.reviewerDueDate
        // );  

        // return requirementData; // Return the generated data for assertions
    }
}