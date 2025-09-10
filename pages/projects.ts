import { Page } from "@playwright/test";
import { Selectors } from "../selectors";

export class ProjectsPage {

	private selectorsRoot: Selectors["projectsSelectors"]["projects"]; 

	constructor(private page: Page, selectors: Selectors) {
		this.selectorsRoot = selectors.projectsSelectors.projects;
	}

	private locatorOrText(locatorCss: string, text?: string) {
		if (locatorCss && locatorCss.trim().length > 0) {
			return this.page.locator(locatorCss);
		}
		if (text && text.trim().length > 0) {
			return this.page.getByText(text, { exact: true });
		}
		throw new Error('Neither selector nor text provided for locator');
	}

	async openProjectByName() {
		const card = this.locatorOrText(this.selectorsRoot.projectCardSelector, this.selectorsRoot.projectCardName);
		await card.first().waitFor({ state: 'visible' });
		await Promise.all([
			this.page.waitForLoadState('networkidle'),
			card.first().click()
		]);
	}

	async openInnerCardByName() {
		const card = this.locatorOrText(this.selectorsRoot.innerCardSelector, this.selectorsRoot.innerCardName);
		const count = await card.count().catch(() => 0);
		if (count === 0) {
			throw new Error(`Inner card not found using selector '${this.selectorsRoot.innerCardSelector || this.selectorsRoot.innerCardName}'`);
		}
		await card.first().scrollIntoViewIfNeeded().catch(() => {});
		await card.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
		await card.first().click();
	}

	async clickEditOnCurrent() {
		if (this.selectorsRoot.editButtonSelector && this.selectorsRoot.editButtonSelector.trim()) {
			const btn = this.page.locator(this.selectorsRoot.editButtonSelector);
			await btn.first().waitFor({ state: 'visible' });
			await Promise.all([
				this.page.waitForLoadState('networkidle'),
				btn.first().click()
			]);
			return;
		}
		const candidates = [
			this.page.getByRole('button', { name: new RegExp(`^${this.selectorsRoot.editButton}$`, 'i') }),
			this.page.locator('button:has-text("' + this.selectorsRoot.editButton + '")'),
			this.page.locator('[aria-label*="' + this.selectorsRoot.editButton + '" i]'),
			this.page.locator('[title*="' + this.selectorsRoot.editButton + '" i]'),
			this.page.locator('a:has-text("' + this.selectorsRoot.editButton + '")')
		];
		for (const locator of candidates) {
			const count = await locator.count().catch(() => 0);
			if (count > 0) {
				await locator.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
				await Promise.all([
					this.page.waitForLoadState('networkidle'),
					locator.first().click()
				]);
				return;
			}
		}
		throw new Error('Edit button not found');
	}

	async openRequirementListTab() {
		const tab = this.locatorOrText(this.selectorsRoot.requirementListTabSelector, this.selectorsRoot.requirementListTab);
		await tab.first().waitFor({ state: 'visible' });
		await tab.first().click();
	}

	async clickAddRequirement() {
		const btn = this.locatorOrText(this.selectorsRoot.addRequirementButtonSelector, this.selectorsRoot.addRequirementButton);
		await btn.first().waitFor({ state: 'visible' });
		await btn.first().click();
	}
}


