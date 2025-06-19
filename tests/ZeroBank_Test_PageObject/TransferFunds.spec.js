const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../../page-objects/LoginPage");
const { HomePage } = require("../../page-objects/HomePage");
const { Navbar } = require("../../page-objects/components/Navbar");
const { TransferFundPage } = require("../../page-objects/TransferFundPage");
const transferFunds = require("../ZeroBank_Test_PageObject/TestData/transferFund.json");

test.describe("Transfer Funds and Make Payment", () => {
  let page;
  let context;
  let homePage = HomePage;
  let loginPage = LoginPage;
  let navbar = Navbar;
  let transferFundPage = TransferFundPage;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.waitForTimeout(2000);
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    navbar = new Navbar(page);
    transferFundPage = new transferFundPage(page);

    await homePage.visit();
    await homePage.clickOnSignIn();
    await loginPage.login("username", "password");
    //This is to bypass SSL error
    await page.goto("http://zero.webappsecurity.com/bank/transfer-funds.html");
  });
  for (let funds of transferFunds) {
    test(`Transfer Funds ${funds.TC}`, async ({ page }) => {
      //await homePage.clickOnOnlineBankingLink()
      await navbar.clickOnTab("Transfer Funds");
      await transferFundPage.makePayment(
        funds.fromAccount,
        funds.toAccount,
        funds.amount,
        funds.description
      );
      if (funds.amount == "") {
        await transferFundPage.assertSamePage();
      } else {
        await transferFundPage.verifyAndSubmit();
        await transferFundPage.assertSuccessMessage();
      }
    });
  }
});