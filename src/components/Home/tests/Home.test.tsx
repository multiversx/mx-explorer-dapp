import { beforeAll } from 'utils/test-utils';

describe('Homepage tests', () => {
  test('Home page is displaying', async () => {
    const render = beforeAll({
      route: '/',
    });
    const mainPageContent = await render.findByTestId('mainPageContent');
    expect(mainPageContent).toBeDefined();
  });
  test('Application offline', async () => {
    const onLine = jest.spyOn(window.navigator, 'onLine', 'get');
    onLine.mockReturnValue(false);
    const render = beforeAll({
      route: '/',
    });
    const offline = await render.findByText('No internet connection');
    expect(offline).toBeDefined();
  });
});
