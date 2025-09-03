import { test as setup } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from '../../pages/login';
import { goToLogin , waitForDashboard} from '../../components/navigation';


dotenv.config();
const authFile = 'playwright/.auth/user.json';

setup('Authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await goToLogin(page);
  await loginPage.loginFlow(process.env.APP_USERNAME || '', process.env.APP_PASSWORD || '');
  await waitForDashboard(page);  
  await page.context().storageState({ path: authFile });
});