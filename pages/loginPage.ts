import { Selector } from '../selectors/index';
import * as dotenv from 'dotenv';
dotenv.config();


 

constructor(page: any) {

  this.page = page;
  this.selector = new Selector();
  this.loginFlow = this.selector.login

}

async login() {

  await this.page.



}
  

  const loginPath = new LoginPath();
  await page.locator(loginPath.userId).fill(email);
  await page.locator(loginPath.passId).fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
}
