import { test, expect } from '@playwright/test';
import { RequirementFlow } from '../flow/requirement';
import dotenv from 'dotenv';
dotenv.config();


test('should complete project flow with random data', async ({ page }) => {
    const requirementFlow = new RequirementFlow(page);
    const email = process.env.email!;
    const password = process.env.password!;
    await page.goto('/');
    await requirementFlow.updateRequirement(email, password);
    











    
    // Create requirement with random data
    // const requirementData = await requirementFlow.createRequirement(email, password);
    
    // Add assertions as needed
    // For example, verify the created requirement has the correct data
    // await expect(page.locator('priority-field')).toHaveText(requirementData.priority);
    // Add more assertions based on your UI
});

// test('should handle multiple requirement creations', async ({ page }) => {
//     const requirementFlow = new RequirementFlow(page);
//     const email = process.env.email!;
//     const password = process.env.password!;
    
//     await page.goto('/');
    
//     // Create multiple requirements with different random data
//     for (let i = 0; i < 3; i++) {
//         const requirementData = await requirementFlow.createRequirement(email, password);
//         // Add assertions for each requirement
//         // You might need to add navigation between requirements
//     }
// });

