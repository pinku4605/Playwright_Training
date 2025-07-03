import { readFileSync } from 'fs';
import { join } from 'path';
import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';

// Load records from CSV
const records = parse(
  readFileSync(join('./tests/Assignment', 'Exercise3.csv')),
  { columns: true, skip_empty_lines: true }
);

test('Create and verify notes from CSV with cleanup', async ({ browser }) => {
  for (const record of records) {
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      // Login
      await page.goto('https://practice.expandtesting.com/notes/app/login');
      await page.getByTestId('login-email').fill(record.uname);
      await page.getByTestId('login-password').fill(record.pass);
      await page.getByTestId('login-submit').click();
      console.log(`Logged in as ${record.uname}`);
      await page.waitForTimeout(2000);

      // Delete existing notes with matching title
      const deleteButtons = page.locator(
        `//*[text()='${record.title}']/following-sibling::div/following-sibling::div/div/button[text()='Delete']`
      );
      const count = await deleteButtons.count();
      console.log(`Found ${count} notes to delete`);

      for (let i = 0; i < count; i++) {
        await deleteButtons.nth(i).click();
        await page.locator("//button[text()='Cancel']/preceding-sibling::button").click();
        await page.waitForTimeout(500);
      }

      // Add new note
      await page.getByTestId('add-new-note').click();
      await page.getByTestId('note-category').selectOption(record.category);
      await page.getByTestId('note-completed').check();
      await page.getByTestId('note-title').fill(record.title);
      await page.getByTestId('note-description').fill(record.description);
      await page.getByTestId('note-submit').click();
      await page.waitForTimeout(1000);

      // Verify note exists using exact match
      await expect(
        page.getByTestId('note-card-title').filter({
          hasText: new RegExp(`^${record.title}$`)
        })
      ).toHaveCount(1);

      console.log(` Verified note: ${record.title}`);
    } finally {
      await page.close();
      await context.close();
    }
  }
});
