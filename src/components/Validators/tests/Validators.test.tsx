import axios from 'axios';
import { fireEvent, renderWithRouter, wait, meta } from 'utils/test-utils';
import optionalConfig from 'utils/config';
import heartbeatstatus from './heartbeatstatus';
import statistics from './statistics';
import validators from './validators';
import doc from './doc';
import epoch from './epoch';

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
      case url.includes('/tps/_doc/meta'):
        return Promise.resolve({ data: meta });
      case url.includes(`/node/heartbeatstatus`):
        return Promise.resolve({ data: heartbeatstatus });
      case url.includes('/validator/statistics'):
        return Promise.resolve({ data: statistics });
      case url.endsWith('/validators'):
        return Promise.resolve({ data: validators });
      case url.includes('/network/status'):
        return Promise.resolve({ data: epoch });
      case url.includes('/validators/_doc'):
        return Promise.resolve({ data: doc });
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
    });

    const loader = render.getByTestId('loader');
    expect(loader).toBeInTheDocument();
  });
  test('Validators page failed state', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockRejectedValue(new Error('heartbeatstatus error'));

    const render = renderWithRouter({
      route: '/validators/nodes',
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
    expect(totalPages.textContent).toBe('62');
  });
  test('Validator search working', async () => {
    const render = goToValidatorsPage();

    const searchInput = await render.findByTestId('validatorSearch');
    const data = { target: { value: 'bonw' } };
    fireEvent.change(searchInput, data);

    const totalPages = await render.findByTestId('totalPages');
    expect(totalPages.textContent).toBe('138');

    const resetSearch = await render.findByTestId('resetSearch');
    fireEvent.click(resetSearch);

    expect(totalPages.textContent).toBe('1,640');
  });
  test('Filter by shard working', async () => {
    const render = goToValidatorsPage();

    const searchInput = await render.findByTestId('validatorSearch');
    const data = { target: { value: 'bonw' } };
    fireEvent.change(searchInput, data);

    const totalPages = await render.findByTestId('totalPages');
    expect(totalPages.textContent).toBe('138');

    const resetSearch = await render.findByTestId('resetSearch');
    fireEvent.click(resetSearch);

    expect(totalPages.textContent).toBe('1,640');
  });

  test('Filter by status working', async () => {
    const render = goToValidatorsPage();

    const filterByStatus = await render.findByTestId('filterByStatus');
    fireEvent.click(filterByStatus);

    const offline = await render.findByTestId('filterByStatusOffline');
    fireEvent.click(offline);

    const totalPages = await render.findByTestId('totalPages');
    expect(totalPages.textContent).toBe('1,203');
  });
});

describe('Validators links', () => {
  test('Validators public key link', async () => {
    const render = goToValidatorsPage();
    const publicKeyLink = await render.findByTestId('publicKeyLink0');
    expect(publicKeyLink.textContent).toBe('360a9de7dd...d4f3dee28d');
    fireEvent.click(publicKeyLink);
    await wait(async () => {
      expect(document.title).toEqual('Node Details • Elrond Explorer');
    });
  });
  test('Validators shard link', async () => {
    const render = goToValidatorsPage();
    const publicKeyLink = await render.findByTestId('shardLink0');
    expect(publicKeyLink.textContent).toBe('Metachain');
    fireEvent.click(publicKeyLink);
    await wait(async () => {
      expect(document.title).toEqual('Shard Details • Elrond Explorer');
    });
  });
});
