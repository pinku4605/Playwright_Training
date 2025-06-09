const fs = require('fs');
const { test, expect } = require('@playwright/test');

const users = JSON.parse(fs.readFileSync('./tests/TestData/ReadData_From_JSON_Order.json'));

for (const record of users) {
  test(`Read data from Orders: ${record.test_case}`, async ({ page }) => {
    await page.goto('http://secure.smartbearsoftware.com/samples/TestComplete11/WebOrders/Login.aspx?ReturnUrl=%2fsamples%2fTestComplete11%2fWebOrders%2fDefault.aspx');

    // Login
    await page.getByRole('textbox', { name: 'Username' }).fill(record.uname);
    await page.getByRole('textbox', { name: 'Password' }).fill(record.password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Navigate to Order page
    await page.getByRole('link', { name: 'Order', exact: true }).click();

    // Click Process button to submit
    await page.getByRole('link', { name: 'Process' }).click();

    // Use switch to check expected result and act accordingly
    switch (record.exp_res) {
      case 'Product Information':
        // Validate heading text
        await expect(page.getByRole('heading', { name: 'Product Information' })).toHaveText(record.exp_res);

        // Validate error messages 
        // if (Array.isArray(record.expectedErrors)) {
        //   for (const errorMsg of record.expectedErrors) {
        //     await expect(page.getByText(errorMsg)).toBeVisible();
        //   }
        // }

    if ('Quantity must be greater than zero.' == record.exp_res) {
        await expect(page.getByText('Quantity must be greater than zero.')).toHaveText(record.exp_res)
        await expect(page.getByText('Quantity must be greater than')).toBeVisible();
        await expect(page.getByText("Field 'Customer name' cannot")).toBeVisible();
        await expect(page.getByText("Field 'Street' cannot be")).toBeVisible();
        await expect(page.getByText("Field 'City' cannot be empty.")).toBeVisible();
        await expect(page.getByText("Field 'Zip' cannot be empty.")).toBeVisible();
        await expect(page.getByText('Select a card type.')).toBeVisible();
        await expect(page.getByText("Field 'Card Nr' cannot be")).toBeVisible();
        await expect(page.getByText("Field 'Expire date' cannot be")).toBeVisible();
     }
      default:
      // fill the address and payment info
        if (record.customerName) {
          await page.getByRole('textbox', { name: 'Customer name:*' }).fill(record.customerName);
        }
        if (record.street) {
          await page.getByRole('textbox', { name: 'Street:*' }).fill(record.street);
        }
        if (record.city) {
          await page.getByRole('textbox', { name: 'City:*' }).fill(record.city);
        }
        if (record.state) {
          await page.getByRole('textbox', { name: 'State:' }).fill(record.state);
        }
        if (record.zip) {
          await page.getByRole('textbox', { name: 'Zip:*' }).fill(record.zip);
        }
        if (record.cardType) {
          await page.getByRole('radio', { name: record.cardType }).check();
        }
        if (record.cardNumber) {
          await page.getByRole('textbox', { name: 'Card Nr:*' }).fill(record.cardNumber);
        }
        if (record.expiry) {
          await page.getByRole('textbox', { name: 'Expire date (mm/yy):*' }).fill(record.expiry);
        }

        // Click Process again after filling
        await page.getByRole('link', { name: 'Process' }).click();

        // You can add assertions here to check for success messages or other validations
        break;
    }
  });
}
