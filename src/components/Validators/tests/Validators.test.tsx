import axios from 'axios';
import {
  fireEvent,
  renderWithRouter,
  wait,
  meta,
  config as optionalConfig,
  waitForElement,
} from 'utils/test-utils';
import { heartbeatstatus, validators, validatorsdoc, epoch, statistics } from 'utils/rawData';

(global as any).document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

export const mockGet = () => {
  const mockGet = jest.spyOn(axios, 'get');
  mockGet.mockImplementation((url: string): any => {
    switch (true) {
      // --- page load ---
      case url.includes('/tps/meta'):
        return Promise.resolve({ data: meta });
      case url.includes(`/node/heartbeatstatus`):
        return Promise.resolve({ data: heartbeatstatus });
      case url.includes('/validator/statistics'):
        return Promise.resolve({ data: statistics });
      case url.endsWith('/validators'):
        return Promise.resolve({ data: validators });
      // --- page load ---
      case url.includes('/network/status'):
        return Promise.resolve({ data: epoch });
      case url.includes('/validators'):
        return Promise.resolve({ data: validatorsdoc });
    }
  });
};

const goToValidatorsPage = () => {
  mockGet();

  return renderWithRouter({
    route: '/validators/nodes',
    optionalConfig,
  });
};

describe('Validators', () => {
  test('Validators page is displaying', async () => {
    const render = goToValidatorsPage();
    await wait(async () => {
      expect(document.title).toEqual('Validators Nodes • Elrond Explorer');
      expect(render.queryByTestId('title')!.innerHTML).toBe('Validators');
    });
  });
  test('Validators page loading state', async () => {
    const render = renderWithRouter({
      route: '/validators/nodes',
      optionalConfig,
    });

    const loader = await waitForElement(() => render.getByTestId('loader'));
    expect(loader).toBeDefined();
  });
  test('Validators page failed state', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockRejectedValue(new Error('heartbeatstatus error'));

    const render = renderWithRouter({
      route: '/validators/nodes',
      optionalConfig,
    });

    const failedState = await render.findByText('Unable to load validators');
    expect(failedState).toBeInTheDocument();
  });
});

describe('Validators filters', () => {
  test('Filter by observers working', async () => {
    const render = goToValidatorsPage();

    const filterByObservers = await render.findByTestId('filterByObservers');

    fireEvent.click(filterByObservers);

    const totalPages = render.getByTestId('totalPages');
    expect(totalPages.textContent).toBe('150');
  });
  test('Validator search working', async () => {
    const render = goToValidatorsPage();

    const searchInput = await render.findByTestId('validatorSearch');
    const data = { target: { value: 'bon' } };
    fireEvent.change(searchInput, data);

    const totalPages = await render.findByTestId('totalPages');
    expect(totalPages.textContent).toBe('4');

    const resetSearch = await render.findByTestId('resetSearch');
    fireEvent.click(resetSearch);

    expect(totalPages.textContent).toBe('1,638');
  });
  test('Filter by shard working', async () => {
    const render = goToValidatorsPage();

    const searchInput = await render.findByTestId('validatorSearch');
    const data = { target: { value: 'bon' } };
    fireEvent.change(searchInput, data);

    const totalPages = await render.findByTestId('totalPages');
    expect(totalPages.textContent).toBe('4');

    const resetSearch = await render.findByTestId('resetSearch');
    fireEvent.click(resetSearch);

    expect(totalPages.textContent).toBe('1,638');
  });
});

describe('Validators links', () => {
  test('Validators public key link', async () => {
    const render = goToValidatorsPage();
    const publicKeyLink = await render.findByTestId('publicKeyLink0');
    expect(publicKeyLink.textContent).toBe('ffd9951015...e4a6f33e03');
    fireEvent.click(publicKeyLink);
    await wait(async () => {
      expect(document.title).toEqual('Node Details • Elrond Explorer');
    });
  });
  test('Validators shard link', async () => {
    const render = goToValidatorsPage();
    const publicKeyLink = await render.findByTestId('shardLink0');
    expect(publicKeyLink.textContent).toBe('Shard 1');
    fireEvent.click(publicKeyLink);
    await wait(async () => {
      expect(document.title).toEqual('Shard Details • Elrond Explorer');
    });
  });
});
