import { test } from '@playwright/test';
import dotenv from 'dotenv';
import { NetflixPage } from '../../pages/netflix';
import { goToNetflixLogin } from '../../components/navigation';

dotenv.config();
const authFile = 'playwright/.auth/user.json';

test('Authenticate', async ({ page }) => {
    const netflixPage = new NetflixPage(page);
    await goToNetflixLogin(page);
    await netflixPage.loginFlow(process.env.USERNAME || '', process.env.PASSWORD || '');
    await page.context().storageState({ path: authFile });
});
