import { browser, element, by } from 'protractor';

export class PublicPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('km-root h1')).getText();
  }
}
