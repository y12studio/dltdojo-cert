import { NgredPage } from './app.po';

describe('ngred App', () => {
  let page: NgredPage;

  beforeEach(() => {
    page = new NgredPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
