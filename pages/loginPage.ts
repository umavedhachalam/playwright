import { LoginPath } from '../selectors/index';
import * as dotenv from 'dotenv';
dotenv.config();

export async function createLogin(page: any) {

  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;

  const loginPath = new LoginPath();
  await page.locator(loginPath.userId).fill(email);
  await page.getByPlaceholder(loginPath.passId).fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();

}
