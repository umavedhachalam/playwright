import { Page } from '@playwright/test';
import { SelfHealingPage, SelfHealingElement, ElementStrategies, SelfHealingConfig } from '../utils/self-healing';
import { testData } from '../selectors/index';

export class SelfHealingLoginPage {
  private page: Page;
  private selfHealingPage: SelfHealingPage;
  private config: SelfHealingConfig;

  // Self-healing elements
  public usernameInput: SelfHealingElement;
  public passwordInput: SelfHealingElement;
  public loginButton: SelfHealingElement;
  public errorMessage: SelfHealingElement;

  constructor(page: Page, config: SelfHealingConfig = {}) {
    this.page = page;
    this.config = {
      maxRetries: testData.retryConfig.maxRetries,
      retryDelay: testData.retryConfig.retryDelay,
      timeout: testData.timeouts.login,
      enableScreenshots: true,
      enableLogging: true,
      ...config
    };
    
    this.selfHealingPage = new SelfHealingPage(page, this.config);
    
    // Initialize self-healing elements
    this.usernameInput = this.selfHealingPage.createElement(
      ElementStrategies.usernameInput,
      'usernameInput'
    );
    
    this.passwordInput = this.selfHealingPage.createElement(
      ElementStrategies.passwordInput,
      'passwordInput'
    );
    
    this.loginButton = this.selfHealingPage.createElement(
      ElementStrategies.loginButton,
      'loginButton'
    );
    
    this.errorMessage = this.selfHealingPage.createElement(
      ElementStrategies.errorMessage,
      'errorMessage'
    );
  }

  async navigateToLoginPage(url?: string): Promise<void> {
    const loginUrl = url || testData.urls.loginPage;
    console.log(`[SelfHealingLoginPage] Navigating to login page: ${loginUrl}`);
    await this.selfHealingPage.navigateTo(loginUrl);
    await this.selfHealingPage.waitForNetworkIdle();
    await this.selfHealingPage.takeContextualScreenshot('login-page-loaded');
  }

  async login(username: string, password: string): Promise<{ success: boolean; message?: string; redirected?: boolean }> {
    console.log(`[SelfHealingLoginPage] Attempting login with username: ${username}`);
    
    try {
      // Validate form before attempting login
      const formValidation = await this.validateLoginForm();
      if (!formValidation.isValid) {
        console.log('[SelfHealingLoginPage] Form validation failed:', formValidation.issues);
        return { success: false, message: `Form validation failed: ${formValidation.issues.join(', ')}` };
      }
      
      // Fill username field
      await this.usernameInput.fill(username);
      console.log('[SelfHealingLoginPage] Username filled successfully');
      
      // Fill password field
      await this.passwordInput.fill(password);
      console.log('[SelfHealingLoginPage] Password filled successfully');
      
      // Take screenshot before login attempt
      await this.selfHealingPage.takeContextualScreenshot('before-login');
      
      // Click login button
      await this.loginButton.click();
      console.log('[SelfHealingLoginPage] Login button clicked');
      
      // Wait for response
      await this.page.waitForTimeout(3000);
      
      // Check for error messages
      const hasErrorMessage = await this.errorMessage.isVisible();
      if (hasErrorMessage) {
        const errorText = await this.errorMessage.getText();
        console.log(`[SelfHealingLoginPage] Error message found: ${errorText}`);
        await this.selfHealingPage.takeContextualScreenshot('login-error');
        return { success: false, message: errorText || 'Login failed' };
      }
      
      // Check if redirected (successful login)
      const currentUrl = this.page.url();
      const isRedirected = !currentUrl.includes('/login');
      
      if (isRedirected) {
        console.log(`[SelfHealingLoginPage] Login successful, redirected to: ${currentUrl}`);
        await this.selfHealingPage.takeContextualScreenshot('login-success');
        return { success: true, redirected: true };
      }
      
      // Check for success indicators on the same page
      const successIndicators = await this.checkForSuccessIndicators();
      if (successIndicators.length > 0) {
        console.log(`[SelfHealingLoginPage] Login successful, found indicators: ${successIndicators.join(', ')}`);
        await this.selfHealingPage.takeContextualScreenshot('login-success-indicators');
        return { success: true, message: successIndicators.join(', ') };
      }
      
      console.log('[SelfHealingLoginPage] Login status unclear, no clear success or error indicators');
      await this.selfHealingPage.takeContextualScreenshot('login-unclear');
      return { success: false, message: 'Login status unclear' };
      
    } catch (error) {
      console.error(`[SelfHealingLoginPage] Login failed with error: ${error}`);
      await this.selfHealingPage.takeContextualScreenshot('login-exception');
      return { success: false, message: `Login failed: ${error}` };
    }
  }

  private async checkForSuccessIndicators(): Promise<string[]> {
    const indicators: string[] = [];
    
    // Check for common success indicators
    const successSelectors = [
      { selector: '.success, .alert-success', name: 'Success message' },
      { selector: '[data-testid*="success"], [data-testid*="welcome"]', name: 'Success test ID' },
      { selector: 'h1:has-text("Dashboard"), h1:has-text("Welcome")', name: 'Dashboard title' },
      { selector: '.user-menu, .profile-menu, .account-menu', name: 'User menu' },
      { selector: 'button:has-text("Logout"), a:has-text("Logout")', name: 'Logout button' }
    ];
    
    for (const { selector, name } of successSelectors) {
      try {
        const element = this.page.locator(selector);
        if (await element.isVisible()) {
          const text = await element.textContent();
          indicators.push(`${name}: ${text}`);
        }
      } catch {
        // Ignore errors for individual selectors
      }
    }
    
    return indicators;
  }

  async validateLoginForm(): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    try {
      // Check if username field is present and visible
      const usernameVisible = await this.usernameInput.isVisible();
      if (!usernameVisible) {
        issues.push('Username field not visible');
      }
      
      // Check if password field is present and visible
      const passwordVisible = await this.passwordInput.isVisible();
      if (!passwordVisible) {
        issues.push('Password field not visible');
      }
      
      // Check if login button is present and visible
      const loginButtonVisible = await this.loginButton.isVisible();
      if (!loginButtonVisible) {
        issues.push('Login button not visible');
      }
      
      return {
        isValid: issues.length === 0,
        issues
      };
      
    } catch (error) {
      return {
        isValid: false,
        issues: [`Form validation failed: ${error}`]
      };
    }
  }

  async getFormData(): Promise<{ username: string; password: string }> {
    try {
      const username = await this.usernameInput.getText() || '';
      const password = await this.passwordInput.getText() || '';
      
      return { username, password };
    } catch (error) {
      console.error(`[SelfHealingLoginPage] Failed to get form data: ${error}`);
      return { username: '', password: '' };
    }
  }

  async clearForm(): Promise<void> {
    try {
      await this.usernameInput.fill('');
      await this.passwordInput.fill('');
      console.log('[SelfHealingLoginPage] Form cleared successfully');
    } catch (error) {
      console.error(`[SelfHealingLoginPage] Failed to clear form: ${error}`);
    }
  }

  async waitForPageLoad(): Promise<void> {
    await this.selfHealingPage.waitForNetworkIdle();
  }

  async takeScreenshot(context: string): Promise<void> {
    await this.selfHealingPage.takeContextualScreenshot(context);
  }

  // Valid credentials from environment variables only
  // getValidCredentials() {
  //   return {
  //     username: process.env.LOGIN_USERNAME || process.env.USERNAME || 'test123',
  //     password: process.env.LOGIN_PASSWORD || process.env.PASSWORD || 'testpass123'
  //   };
  // }

  // All other test data from JSON
  getInvalidCredentials() {
    return testData.invalidCredentials;
  }

  getEmptyCredentials() {
    return testData.emptyCredentials;
  }

  getTestUsers() {
    return testData.testUsers;
  }

  getLoginUrl() {
    return testData.urls.loginPage;
  }

  getDashboardUrl() {
    return testData.urls.dashboard;
  }
}
