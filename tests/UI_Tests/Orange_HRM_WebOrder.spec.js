const fs = require('fs');
const { test, expect } = require('@playwright/test');

// Reads the JSON file and saves it  
let objects = fs.readFileSync('./tests/TestData/Orange_HRM_WebOrder.json')
const users = JSON.parse(objects);

for (const record of users) {
  test(`WebOrder Login Functionality: ${record.test_case}`, async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill(record.uname);
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(record.password);
    await page.getByRole('button', { name: 'Login' }).click();


    if ('Dashboard' == record.exp_res) {
      await page.waitForTimeout(5000)
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toHaveText(record.exp_res)
      
      //await page.getByRole('link', { name: 'Logout' }).click();
      // await page.click('text=Logout');
      //await page.waitForLoadState(); // The promise resolves after 'load' event.

    }
    else if ('Invalid credentials' == record.exp_res) {
      await expect(page.getByText('Invalid credentials')).toHaveText(record.exp_res)
    }
    else {
      //const name = await page.$eval("#ctl00_MainContent_status", el => el.textContent.trim())
      //expect(name).toBe('Invalid Login or Password.')
      //expect(name).toBe(record.exp_res)
      await expect(page.getByText('Required')).toHaveText(record.exp_res)

    }


  });
}