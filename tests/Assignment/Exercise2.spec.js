import { test, expect } from '@playwright/test'
// Class to represent note data
class NoteData {
  constructor(category) {
    this.username = 'sudipta989@gmail.com';
    this.password = 'test123';
    this.category = category;
    const timestamp = Date.now();
    this.title = `Title - ${category}- ${timestamp}`;
    this.description = `Description - This is a ${category} note.`;
  }
}
// Parameterized test data using class instances
const notesData = [
  new NoteData("Personal"),
  new NoteData("Work"),
  new NoteData("Home")
];
test.describe('Notes Creation functionality', () => {
    let context;
    let page;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('https://practice.expandtesting.com/notes/app/login');
    await page.getByTestId('login-email').fill(notesData[0].username);
    console.log(notesData[0].username);
    console.log(notesData[0].password);
    await page.getByTestId('login-password').fill(notesData[0].password);
    await page.getByTestId('login-submit').click();
  })

  for (const note of notesData) {
  test(`Create and verify note in category: ${note.category}`, async ({ }) => {
    await page.getByTestId('add-new-note').click();
    await page.getByTestId('note-category').selectOption(note.category);
    await page.getByTestId('note-completed').check();
    await page.getByTestId('note-title').fill(note.title);
    console.log(note.title);
    await page.getByTestId('note-description').fill(note.description);
    await page.getByTestId('note-submit').click();
    await page.waitForTimeout(3000);

    // Verify note appears
    await expect(
      await page.getByTestId('note-card-title').filter({ hasText: note.title })).toHaveCount(1);
  });
  }
  test.afterEach(async ({  }) => {
        await page.click('text=Logout');
        await page.getByRole('link', { name: 'Login' }).click();
        await page.getByTestId('login-email').fill(notesData[0].username);
        await page.getByTestId('login-password').fill(notesData[0].password);
        await page.getByTestId('login-submit').click();
   })
    
  test.afterAll(async ({  }) => {
    await page.close();
    await context.close();
   })
});

