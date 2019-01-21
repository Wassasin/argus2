import puppeteer from 'puppeteer';

export default class Browser {
  constructor(baseUrl) {
    this.browser = null;
    this.page = null;
    this.baseUrl = baseUrl;
    this.settings = {
      headless: false,
      // slowMo: 50,
      // ignoreHTTPSErrors: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };
  }

  async init() {
    this.browser = await puppeteer.launch(this.settings);
    this.page = await this.browser.newPage();
    this.page.setViewport({ width: 1600, height: 800 });
    return this.page;
  }

  goto(path, options) {
    return this.page.goto(`${this.baseUrl}${path}`, options);
  }

  async getTextContent(selector) {
    await this.page.waitForSelector(selector);
    return this.page.evaluate(s => document.querySelector(s).textContent.trim(), selector);
  }

  async getPropertyText(selector, property) {
    await this.page.waitForSelector(selector);
    return this.page.evaluate((s, p) => document.querySelector(s)[p], selector, property);
  }

  close() {
    this.browser.close();
  }
}
