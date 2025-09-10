import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login";
import { ProjectsPage } from "../pages/projects";
import { Selectors } from "../selectors";

test.describe('Application Flow', () => {
	const selectors = new Selectors();
	const email = process.env.EMAIL || '';
	const password = process.env.PASSWORD || '';
	const baseUrl = process.env.BASE_URL || '';

	test('login, open Test → IPC, edit, go to Requirement List, add requirement', async ({ page }) => {
		await page.goto(`${baseUrl}/login`);
		const loginPage = new LoginPage(page, selectors);
		await loginPage.login(email, password);
		await expect(page).toHaveURL(/projects/i);

		const projectsPage = new ProjectsPage(page, selectors);
		await projectsPage.openProjectByName();
		await projectsPage.openInnerCardByName();
		await projectsPage.clickEditOnCurrent();
		await projectsPage.openRequirementListTab();
		await projectsPage.clickAddRequirement();
	});
});


