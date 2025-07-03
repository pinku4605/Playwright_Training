const fs = require('fs');
const { test, expect } = require('@playwright/test');

// Reads the JSON file and saves it  
let objects = fs.readFileSync('./tests/Assignment/Exercise4.json')
const users = JSON.parse(objects);

for (const record of users) {
  test(`WebOrder Login Functionality: ${record.test_case}`, async ({ page }) => {
    let actualResult;
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.getByRole('textbox', { name: 'Username' }).fill(record.username);
    await page.getByRole('textbox', { name: 'Password' }).fill(record.password);
    await page.getByRole('button', { name: 'Login' }).click();
    if (await page.locator('text=Dashboard').isVisible()) {
      actualResult = "Success";
      console.log(actualResult);
    }else if (await page.locator('text=Required').first().isVisible()){
      actualResult = "Required";
      console.log(actualResult);

    }else {
      actualResult = "Invalid credentials";
      console.log(actualResult);

    }

    switch (record.expectedResult) {
      case "Success":
        expect(actualResult).toBe(record.expectedResult);
        break;
      case "Invalid credentials":
        expect(actualResult).toContain(record.expectedResult);
        break;
      case "Required":
        expect(actualResult).toBe(record.expectedResult);
        break;
      
    }

    });

}
