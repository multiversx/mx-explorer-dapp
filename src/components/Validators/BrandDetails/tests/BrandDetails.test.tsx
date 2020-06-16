import { renderWithRouter, waitForElement, config as optionalConfig } from 'utils/test-utils';
import { mockGet } from 'components/Validators/tests/Validators.test';

const goToBrandDetailsPage = () => {
  mockGet();
  return renderWithRouter({
    route: '/validators/elrondcom',
    optionalConfig,
  });
};

describe('Validators brand', () => {
  test('Validators brand page is displaying', async () => {
    const render = goToBrandDetailsPage();
    expect(document.title).toEqual('Validator Details • Elrond Explorer');
    const title = await waitForElement(() => render.getByTestId('title'));
    expect(title.innerHTML).toBe('Validator Details');
    const name = render.getByText('Elrond Foundational Nodes');
    expect(name).toBeDefined();
  });
  test('Validators brand page loading', async () => {
    const render = goToBrandDetailsPage();
    const loader = await waitForElement(() => render.getByTestId('loader'));
    expect(loader).toBeDefined();
  });
  test('Validators brand page failed', async () => {
    const render = renderWithRouter({
      route: '/validators/elrondcom1',
      optionalConfig,
    });
    const name = await render.findByText('/validators/elrondcom1');
    expect(name).toBeDefined();
  });
});
