// import { test, expect } from '@playwright/test';
// import { SelfHealingLoginPage } from '../pages/self-healing-login';
// import { testData } from '../selectors/index';

// test.describe('Self-Healing Login Tests', () => {
//   let loginPage: SelfHealingLoginPage;
//   let data: any;

//   test.beforeAll(async () => {
//     // Load test data from JSON fixture....
//     data = testData;
//   });

//   test.beforeEach(async ({ page }) => {
//     loginPage = new SelfHealingLoginPage(page);
//     await loginPage.navigateToLoginPage();
//   });

//   test('should login successfully with valid credentials', async () => {
//     const validCredentials = data.validCredentials;
    
//     const formValidation = await loginPage.validateLoginForm();
//     expect(formValidation.isValid).toBeTruthy();
    
//     const loginResult = await loginPage.login(validCredentials.username, validCredentials.password);
//     expect(loginResult.success).toBeTruthy();
//   });

//   test('should show validation error for invalid username', async () => {
//     const invalidCredentials = data.invalidCredentials;
//     const loginResult = await loginPage.login(invalidCredentials.username, invalidCredentials.password);
//     expect(loginResult.success).toBeFalsy();
//     expect(loginResult.message).toBeTruthy();
//   });

//   test('should handle empty credentials gracefully', async () => {
//     const emptyCredentials = data.emptyCredentials;
//     const loginResult = await loginPage.login(emptyCredentials.username, emptyCredentials.password);
//     expect(loginResult.success).toBeFalsy();
//   });

//   test('should validate form elements are present and functional', async () => {
//     const formValidation = await loginPage.validateLoginForm();
//     expect(formValidation.isValid).toBeTruthy();
    
//     const validCredentials = data.validCredentials;
//     await loginPage.usernameInput.fill(validCredentials.username);
//     await loginPage.passwordInput.fill(validCredentials.password);
//     await loginPage.clearForm();
    
//     const formData = await loginPage.getFormData();
//     expect(formData.username).toBe('');
//     expect(formData.password).toBe('');
//   });

//   test('should handle network issues and retry automatically', async ({ page }) => {
//     await page.route('**/*', async route => {
//       await new Promise(resolve => setTimeout(resolve, 2000));
//       await route.continue();
//     });
    
//     const validCredentials = data.validCredentials;
//     const loginResult = await loginPage.login(validCredentials.username, validCredentials.password);
//     expect(typeof loginResult.success).toBe('boolean');
//   });

//   test('should test with multiple users from JSON data', async () => {
//     const testUsers = data.testUsers;
    
//     for (const user of testUsers) {
//       await loginPage.clearForm();
//       const loginResult = await loginPage.login(user.username, user.password);
//       expect(typeof loginResult.success).toBe('boolean');
//     }
//   });

//   test('should provide detailed logging and screenshots', async () => {
//     await loginPage.takeScreenshot('test-start');
    
//     const validCredentials = data.validCredentials;
//     await loginPage.usernameInput.fill(validCredentials.username);
//     await loginPage.passwordInput.fill(validCredentials.password);
//     await loginPage.takeScreenshot('form-filled');
    
//     await loginPage.clearForm();
//     await loginPage.takeScreenshot('form-cleared');
//   });
// });
