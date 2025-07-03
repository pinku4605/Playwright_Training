const fs = require('fs');
const { test, expect } = require('@playwright/test');
const { Console } = require('console');

// Reads the JSON file and saves it  
let objects = fs.readFileSync('./tests/Assignment/Exercise1.json');
const users = JSON.parse(objects);
for (const record of users) {
test(`Blazedemo Purchase Flight Functionality: ${record.test_case}`, async ({ page }) => {
  const choose_flight = 'Choose This Flight '+ record.flight+' '+ record.airline;
  console.log('flight details : '+choose_flight);
  await page.goto('https://blazedemo.com/index.php');
  await page.selectOption('select[name="fromPort"]', record.departure_city);
  await page.selectOption('select[name="toPort"]', record.destination_city);
  await page.getByRole('button', { name: 'Find Flights' }).click();
  await page.getByRole('row', { name: choose_flight }).getByRole('button').click();
  await page.getByRole('textbox', { name: 'Name', exact: true }).fill(record.name);
  await page.getByRole('textbox', { name: 'Address' }).fill(record.address);
  await page.getByRole('textbox', { name: 'City' }).fill(record.address);
  await page.getByRole('textbox', { name: 'State' }).fill(record.state);
  await page.getByRole('textbox', { name: 'Zip Code' }).fill(record.zip_code);
  await page.locator('#cardType').selectOption(record.card_type);
  await page.getByRole('textbox', { name: 'Credit Card Number' }).fill(record.credit_card_number);
  await page.getByRole('textbox', { name: 'Month' }).fill(record.month);
  await page.getByRole('textbox', { name: 'Year' }).fill(record.year);
  await page.getByRole('textbox', { name: 'Name on Card' }).fill(record.name_on_card);
  await page.getByRole('checkbox', { name: ' Remember me' }).setChecked(record.remember_me);
  await page.getByRole('button', { value: 'Purchase Flight' }).click();
  await expect(page.getByRole('heading')).toContainText('Thank you for your purchase today!');


});

  }
