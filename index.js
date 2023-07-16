const puppeteer = require('puppeteer');

class SwapFormAutomation {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  async launchBrowser() {
    this.browser = await puppeteer.launch({
      headless: false, // Set to true for headless mode
      defaultViewport: null, // Use the default viewport size
    });
  }

  /**
   * Opens a new page and navigates to the swap website.
   */
  async openPage() {
    this.page = await this.browser.newPage();
    await this.page.goto('https://swap.defillama.com');
  }

  async fillChainName(chainName) {
    await this.page.waitForTimeout(1000);
    await this.page.click('.css-ern9ru'); // Click the dropdown to open the chain selection
    await this.page.waitForTimeout(1000);
    await this.page.type('.css-ern9ru', chainName); // Type the chain name in the input field
    await this.page.waitForTimeout(1000);
    const element = await this.page.$x(`//div[contains(text(), '${chainName}')]`); // Find the element with the desired chain name
    await element[0].click(); // Click the element to select it
    await this.page.waitForTimeout(500);
  }

  /**
   * Clears the "You Sell" input field.
   */
  async clearSellInput() {
    const inputElement = await this.page.$('.css-lv0ed5');
    await inputElement.click({ clickCount: 3 }); // Select all existing text in the input field
    await inputElement.press('Backspace'); // Clear the selected text
    await this.page.waitForTimeout(500);
  }

  async fillSellInput(value) {
    await this.page.type('.css-lv0ed5', value); // Type the value in the "You Sell" input field
    await this.page.waitForTimeout(500);
  }

  async selectSellToken(tokenName) {
    await this.page.click('.css-qjhap'); // Click the "select token" field in the "You Sell" section
    await this.page.waitForTimeout(500);
    await this.page.type('.css-qjhap', tokenName); // Type the token name in the field
    await this.page.waitForTimeout(1000);
    const elementSell = await this.page.$x(`//span[contains(text(), '${tokenName}')]`); // Find the element with the desired token name
    await elementSell[0].click(); // Click the element to select it
  }

  async selectBuyToken(tokenName) {
    const buttons = await this.page.$$('.css-qjhap'); // Find all elements with the class name ".css-qjhap" (buttons)
    await buttons[1].click(); // Click the second button
    await this.page.waitForTimeout(1000);
    await this.page.type('.css-qjhap', tokenName); // Type the token name in the field
    await this.page.waitForTimeout(1000);
    const elementBuy = await this.page.$x(`//span[contains(text(), '${tokenName}')]`); // Find the element with the desired token name
    await elementBuy[1].click(); // Click the element to select it
    await this.page.waitForTimeout(500);
  }

  /**
   * Selects the route in the "Select a route to perform a swap" section.
   */
  async selectRoute() {
    await this.page.waitForNetworkIdle(); // Wait for the network to be idle
    const buttonsRoute = await this.page.$$('.sc-d413ea6e-0'); // Find all elements with the class name ".sc-18d0abec-0" (buttons)
    await buttonsRoute[1].click(); // Click the second button
  }

  async keepBrowserOpen() {
    await new Promise(() => {}); // Create a promise to keep the browser window open
  }

  async run() {
    try {
      await this.launchBrowser(); // Launch the browser
      await this.openPage(); // Open the page and navigate to the swap website
      await this.fillChainName('Arbitrum'); // Fill the chain name
      await this.clearSellInput(); // Clear the "You Sell" input field
      await this.fillSellInput('12'); // Fill the "You Sell" input field
      await this.selectSellToken('Wrapped BTC'); // Select the token in the "You Sell" section
      await this.selectBuyToken('USD Coin'); // Select the token in the "You Buy" section
      await this.selectRoute(); // Select the route in the "Select a route to perform a swap" section
      await this.keepBrowserOpen(); // Keep the browser window open
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      await this.browser.close(); // Close the browser
    }
  }
}

// Create an instance of the SwapFormAutomation class and run the automation
const automation = new SwapFormAutomation();
automation.run();
