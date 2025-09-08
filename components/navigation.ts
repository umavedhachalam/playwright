
export async function goToLogin(page) {
    await page.goto(`${process.env.baseUrl}`);
    await waitForLogin(page);
}

export async function waitForLogin(page) {
    await page.waitForURL(`${process.env.baseUrl}`);
}
export async function waitForDashboard(page) {
    await page.waitForURL(`${process.env.baseUrl}/dashboard`);
}

