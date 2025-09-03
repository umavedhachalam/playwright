
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
export async function goToNetflixLogin(page) {
    await page.goto(`${process.env.BASEURLNETFLIX}`);
    await goToNetflixLogin(page);
}   
export async function waitForNetflixLogin(page) {
    await page.waitForURL(`${process.env.BASEURLNETFLIX}`);
}
export async function waitForNetflixDashboard(page) {
    await page.waitForURL(`https://www.netflix.com/browse`);
}