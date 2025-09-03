import page from'@playwright/test';
import { netflixSelect } from '../selectors/index';

export class NetflixPage {
    constructor(private page:any) {}
    
    async loginFlow(username: string, password: string) {
        await this.page.locator(netflixSelect.username).waitFor({ state: 'visible' });
        await this.page.fill(netflixSelect.username, username);
        await this.page.locator(netflixSelect.password).waitFor({ state: 'visible' });
        await this.page.fill(netflixSelect.password, password);
        await this.page.locator(netflixSelect.loginButton).click();
    }

}
