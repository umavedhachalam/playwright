import { selectors, test as setup } from '@playwright/test';
import { LoginPage } from '../../pages/login';
import { goToLogin , waitForDashboard} from '../../components/navigation';
import { Selectors } from '../../selectors';
// import { loginSelectors } from '../../pages/login';


// dotenv.config();
// const authFile = 'playwright/.auth/user.json';

setup('Authenticate', async ({ page }) => {
  // Import or define your loginSelectors object
  const selectors = new Selectors();
  const loginPage = new LoginPage(page , selectors);
  
  await goToLogin(page);
  await loginPage.loginFlow(process.env.userName || '', process.env.password || '');
  await waitForDashboard(page);  

});