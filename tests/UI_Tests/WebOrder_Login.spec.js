import { test, expect } from '@playwright/test';

test('Webprder login functionality', async ({ page }) => {
  await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx?ReturnUrl=%2fsamples%2fTestComplete11%2fWebOrders%2fDefault.aspx');

  await page.getByRole('textbox', { name: 'Username:' }).click();
  test.setTimeout(60000);
  await page.pause();
  await page.getByRole('textbox', { name: 'Username:' }).fill('Tester');
  console.log;
  await page.getByRole('textbox', { name: 'Password:' }).click();
  await page.getByRole('textbox', { name: 'Password:' }).fill('test');
  await page.getByRole('button', { name: 'Login' }).click();

  await context.close();
  await browser.close();

});