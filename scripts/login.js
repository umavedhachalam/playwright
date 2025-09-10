const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

async function loginAndSaveStorage() {
	const baseUrl = process.env.BASE_URL;
	const email = process.env.EMAIL;
	const password = process.env.PASSWORD;
	if (!baseUrl || !email || !password) {
		throw new Error('Missing BASE_URL, EMAIL, or PASSWORD in environment.');
	}

	const selectors = require(path.join(__dirname, '..', 'selectors', 'login.json'));
	const loginSelectors = selectors.login;

	const browser = await chromium.launch({ headless: false });
	const context = await browser.newContext();
	const page = await context.newPage();
	await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' });
	await page.getByPlaceholder(loginSelectors.email).fill(email);
	await page.getByPlaceholder(loginSelectors.password).fill(password);
	await page.getByText(loginSelectors.loginbtn, { exact: true }).click();
	await page.waitForLoadState('networkidle');

	const storagePath = path.join(process.cwd(), 'storage.json');
	await context.storageState({ path: storagePath });
	await browser.close();
	if (!fs.existsSync(storagePath)) {
		throw new Error('Failed to write storage.json');
	}
	return storagePath;
}

loginAndSaveStorage()
	.then((p) => {
		console.log('Saved storage state to:', p);
		process.exit(0);
	})
	.catch((err) => {
		console.error(err.message || err);
		process.exit(1);
	});


