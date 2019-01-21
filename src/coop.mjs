export default class Coop {
  constructor(browser) {
    this.browser = browser;
  }

  async login(username, password) {
    await this.browser.goto('actions/ViewAuthorization-Authorize');
    await this.browser.page.type('#email', username);
    await this.browser.page.type('#wachtwoord', password);
    await this.browser.page.click('#submitForm');
    await this.browser.page.waitForSelector('.account-greet');

    console.log(`Logged in as ${username}`);
  }

  async listCollections() {
    await this.browser.goto('favorietenlijsten');
    await this.browser.page.waitForSelector('.productLineInner a');
    return await this.browser.page.evaluate(() => [...document.querySelectorAll('.productLineInner a')]
      .filter(a => a.dataset['remove'] !== "")
      .map(a => ({ href: a.href, name: a.innerText }))
    );
  }

  async getCollection(collection) {
    await this.browser.page.goto(collection.href);
    await this.browser.page.waitForSelector('.productItem');

    const elements = await this.browser.page.evaluate(
      () => [...document.querySelectorAll('.productItem')]
        .filter(x => x.querySelector('.productTitle'))
        .map(x => ({ title: x.querySelector('.productTitle').innerText, subtitle: x.querySelector('.productSubTitle').innerText }))
    );

    return {...collection, elements};
  }
}
