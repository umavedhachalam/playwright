import { Page, Locator, expect } from '@playwright/test';

export interface SelfHealingConfig {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  enableScreenshots?: boolean;
  enableLogging?: boolean;
}

export interface ElementStrategy {
  name: string;
  selector: string;
  priority: number;
  condition?: (locator: Locator) => Promise<boolean>;
}

export class SelfHealingElement {
  private page: Page;
  private strategies: ElementStrategy[];
  private config: SelfHealingConfig;
  private elementName: string;

  constructor(
    page: Page, 
    strategies: ElementStrategy[], 
    elementName: string,
    config: SelfHealingConfig = {}
  ) {
    this.page = page;
    this.strategies = strategies.sort((a, b) => a.priority - b.priority);
    this.elementName = elementName;
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 10000,
      enableScreenshots: true,
      enableLogging: true,
      ...config
    };
  }

  private log(message: string, level: 'info' | 'warn' | 'error' = 'info') {
    if (this.config.enableLogging) {
      const timestamp = new Date().toISOString();
      const logLevel = level.toUpperCase().padEnd(5);
      console.log(`[${timestamp}] [SelfHealing-${this.elementName}] ${logLevel}: ${message}`);
    }
  }

  private async takeScreenshot(context: string) {
    if (this.config.enableScreenshots) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      await this.page.screenshot({ 
        path: `test-results/self-healing-${this.elementName}-${context}-${timestamp}.png`,
        fullPage: true 
      });
    }
  }

  async findElement(): Promise<Locator> {
    let lastError: Error | null = null;
    const strategyResults: Array<{ strategy: string; error: string }> = [];
    
    this.log(`Starting element discovery for '${this.elementName}' with ${this.strategies.length} strategies`);
    
    for (let attempt = 1; attempt <= this.config.maxRetries!; attempt++) {
      this.log(`Attempt ${attempt}/${this.config.maxRetries} to find element`);
      
      for (const strategy of this.strategies) {
        try {
          this.log(`Trying strategy: ${strategy.name} with selector: ${strategy.selector}`);
          
          const locator = this.page.locator(strategy.selector);
          
          // Wait for element to be visible
          await locator.waitFor({ 
            state: 'visible', 
            timeout: this.config.timeout! / this.strategies.length 
          });
          
          // Apply custom condition if provided
          if (strategy.condition) {
            const conditionMet = await strategy.condition(locator);
            if (!conditionMet) {
              throw new Error(`Condition not met for strategy: ${strategy.name}`);
            }
          }
          
          // Verify element is actionable
          await this.validateElementState(locator);
          
          this.log(`Successfully found element using strategy: ${strategy.name}`, 'info');
          return locator;
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.log(`Strategy ${strategy.name} failed: ${errorMessage}`, 'warn');
          strategyResults.push({ strategy: strategy.name, error: errorMessage });
          lastError = error as Error;
          continue;
        }
      }
      
      if (attempt < this.config.maxRetries!) {
        this.log(`All strategies failed on attempt ${attempt}, retrying in ${this.config.retryDelay}ms`);
        await this.takeScreenshot(`attempt-${attempt}-failed`);
        await this.page.waitForTimeout(this.config.retryDelay!);
      }
    }
    
    await this.takeScreenshot('all-attempts-failed');
    
    // Enhanced error reporting
    const errorDetails = strategyResults.map(r => `  - ${r.strategy}: ${r.error}`).join('\n');
    const finalError = `Failed to find element '${this.elementName}' after ${this.config.maxRetries} attempts.\nStrategy results:\n${errorDetails}\nLast error: ${lastError?.message}`;
    
    this.log(finalError, 'error');
    throw new Error(finalError);
  }

  private async validateElementState(locator: Locator): Promise<void> {
    // Check if element is visible and enabled
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    
    // Additional validation for interactive elements
    const tagName = await locator.evaluate(el => el.tagName.toLowerCase());
    if (['button', 'input', 'select', 'textarea'].includes(tagName)) {
      await expect(locator).toBeAttached();
    }
  }

  async click(options?: { timeout?: number }): Promise<void> {
    const locator = await this.findElement();
    await locator.click({ timeout: options?.timeout || this.config.timeout });
    this.log('Element clicked successfully');
  }

  async fill(value: string, options?: { timeout?: number }): Promise<void> {
    const locator = await this.findElement();
    await locator.clear();
    await locator.fill(value, { timeout: options?.timeout || this.config.timeout });
    this.log(`Element filled with value: ${value}`);
  }

  async getText(): Promise<string | null> {
    const locator = await this.findElement();
    const text = await locator.textContent();
    this.log(`Element text retrieved: ${text}`);
    return text;
  }

  async isVisible(): Promise<boolean> {
    try {
      const locator = await this.findElement();
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  async waitFor(options?: { state?: 'visible' | 'hidden' | 'attached' | 'detached', timeout?: number }): Promise<void> {
    const locator = await this.findElement();
    await locator.waitFor({ 
      state: options?.state || 'visible',
      timeout: options?.timeout || this.config.timeout 
    });
  }
}

export class SelfHealingPage {
  private page: Page;
  private config: SelfHealingConfig;

  constructor(page: Page, config: SelfHealingConfig = {}) {
    this.page = page;
    this.config = config;
  }

  // Self-healing element factory
  createElement(strategies: ElementStrategy[], elementName: string): SelfHealingElement {
    return new SelfHealingElement(this.page, strategies, elementName, this.config);
  }

  // Smart navigation with retry
  async navigateTo(url: string, options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.config.maxRetries!; attempt++) {
      try {
        await this.page.goto(url, { 
          waitUntil: options?.waitUntil || 'networkidle',
          timeout: this.config.timeout 
        });
        
        // Verify page loaded successfully
        await this.page.waitForLoadState('networkidle');
        console.log(`Successfully navigated to ${url}`);
        return;
        
      } catch (error) {
        lastError = error as Error;
        console.log(`Navigation attempt ${attempt} failed: ${error}`);
        
        if (attempt < this.config.maxRetries!) {
          await this.page.waitForTimeout(this.config.retryDelay!);
        }
      }
    }
    
    throw new Error(`Failed to navigate to ${url} after ${this.config.maxRetries} attempts. Last error: ${lastError?.message}`);
  }

  // Smart wait for network requests
  async waitForNetworkIdle(timeout: number = 5000): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout });
    } catch {
      // Fallback to basic wait if networkidle times out
      await this.page.waitForTimeout(2000);
    }
  }

  // Adaptive screenshot with context
  async takeContextualScreenshot(context: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({ 
      path: `test-results/self-healing-${context}-${timestamp}.png`,
      fullPage: true 
    });
  }
}

// Import JSON selectors for integration
import { loginSelectors } from '../selectors/index';

// Predefined element strategies for common UI patterns
export const ElementStrategies = {
  // Input field strategies (ordered by priority) - JSON selectors as primary
  usernameInput: [
    { name: 'jsonFormControl', selector: loginSelectors.usernameInput, priority: 1 },
    { name: 'formControl', selector: "[formcontrolname='empID']", priority: 2 },
    { name: 'placeholder', selector: "input[placeholder*='user'], input[placeholder*='User'], input[placeholder*='username']", priority: 3 },
    { name: 'typeText', selector: "input[type='text']", priority: 4 },
    { name: 'nameAttribute', selector: "input[name*='user'], input[name*='username'], input[name*='email']", priority: 5 },
    { name: 'idAttribute', selector: "input[id*='user'], input[id*='username'], input[id*='email']", priority: 6 },
    { name: 'labelText', selector: "input:has(+ label:has-text('user')), input:has(+ label:has-text('User'))", priority: 7 }
  ],

  passwordInput: [
    { name: 'jsonFormControl', selector: loginSelectors.passwordInput, priority: 1 },
    { name: 'formControl', selector: "[formcontrolname='password']", priority: 2 },
    { name: 'typePassword', selector: "input[type='password']", priority: 3 },
    { name: 'placeholder', selector: "input[placeholder*='password'], input[placeholder*='Password']", priority: 4 },
    { name: 'nameAttribute', selector: "input[name*='password'], input[name*='pass']", priority: 5 },
    { name: 'idAttribute', selector: "input[id*='password'], input[id*='pass']", priority: 6 }
  ],

  loginButton: [
    { name: 'jsonSelectors', selector: loginSelectors.loginButton, priority: 1 },
    { name: 'jsonSubmitButton', selector: loginSelectors.submitButton, priority: 2 },
    { name: 'formControl', selector: "button[type='submit']", priority: 3 },
    { name: 'textContent', selector: "button:has-text('Login'), button:has-text('Sign In'), button:has-text('Log in')", priority: 4 },
    { name: 'classBased', selector: ".login-btn, .btn-login, .submit-btn", priority: 5 },
    { name: 'formSubmit', selector: "form button, input[type='submit']", priority: 6 },
    { name: 'genericButton', selector: "button", priority: 7 }
  ],

  errorMessage: [
    { name: 'jsonSelectors', selector: loginSelectors.errorMessage, priority: 1 },
    { name: 'roleAlert', selector: "[role='alert']", priority: 2 },
    { name: 'errorClass', selector: ".error, .alert, .message, .toast, .notification", priority: 3 },
    { name: 'ariaLive', selector: "[aria-live='polite'], [aria-live='assertive']", priority: 4 },
    { name: 'textPattern', selector: ":has-text('error'), :has-text('Error'), :has-text('invalid'), :has-text('Invalid')", priority: 5 }
  ],

  // Generic strategies for any element
  genericButton: [
    { name: 'textContent', selector: "button:has-text('{text}')", priority: 1 },
    { name: 'typeSubmit', selector: "button[type='submit']", priority: 2 },
    { name: 'classBased', selector: "button.{class}", priority: 3 },
    { name: 'idBased', selector: "button#{id}", priority: 4 },
    { name: 'genericButton', selector: "button", priority: 5 }
  ],

  genericInput: [
    { name: 'placeholder', selector: "input[placeholder*='{placeholder}']", priority: 1 },
    { name: 'nameAttribute', selector: "input[name*='{name}']", priority: 2 },
    { name: 'idAttribute', selector: "input[id*='{id}']", priority: 3 },
    { name: 'typeBased', selector: "input[type='{type}']", priority: 4 },
    { name: 'genericInput', selector: "input", priority: 5 }
  ]
};

// Helper function to create dynamic strategies
export function createDynamicStrategies(baseStrategies: ElementStrategy[], replacements: Record<string, string>): ElementStrategy[] {
  return baseStrategies.map(strategy => ({
    ...strategy,
    selector: Object.entries(replacements).reduce(
      (selector, [key, value]) => selector.replace(`{${key}}`, value),
      strategy.selector
    )
  }));
}
