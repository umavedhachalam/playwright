
export async function goToLogin(page) {
    await page.goto(`${process.env.BASE_URL}/login`);
    await waitForLogin(page);
}

export async function waitForLogin(page) {
    await page.waitForURL(`${process.env.BASE_URL}/login`);
}


export async function waitForDashboard(page) {
    await page.waitForURL(`https://rev.dtaak.com/in/admin/providers`);
}
