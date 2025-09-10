
export async function goToLogin(page) {
    await page.goto(`${process.env.baseUrl}`);
    await waitForLogin(page);
}

export async function waitForLogin(page) {
    await page.waitForURL(`${process.env.baseUrl}`);
}
export async function waitForDashboard(page) {
    // Wait for redirect after login - could be dashboard, projects, or other pages
    try {
        // First try to wait for dashboard
        await page.waitForURL(`**/dashboard**`, { timeout: 10000 });
    } catch {
        try {
            // If no dashboard, wait for any URL change from login
            await page.waitForURL(url => !url.includes('/login'), { timeout: 10000 });
        } catch {
            // Fallback: wait for any navigationz
            await page.waitForLoadState('networkidle');
        }
    }
}

