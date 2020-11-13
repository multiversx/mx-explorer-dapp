import { fireEvent, wait, beforeAll } from 'utils/test-utils';

import addressResponse from './rawData/address';

describe('Search', () => {
  test('Search finds block', async () => {
    const render = beforeAll({
      route: '/search',
      networkRequests: {
        address: () => Promise.resolve(new Error('error')),
      },
    });

    const search = render.getAllByTestId('search')[0];
    const data = {
      target: { value: 'c51471d4b6a439af44c51bff7372c4f02a8c98ba3bf81e7e080fe461c074d1c1' },
    };
    fireEvent.change(search, data);

    const searchButton = render.getAllByTestId('searchButton')[0];
    await wait(async () => {
      expect(searchButton).toBeEnabled();
    });
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
  test('Search finds transaction', async () => {
    const render = beforeAll({
      route: '/search',
      networkRequests: {
        block: () => Promise.resolve(new Error('error')),
      },
    });

    const search = render.getAllByTestId('search')[0];
    const data = {
      target: { value: '41fa1461ac134ee095dbee60c3cc2848255181aaa2bdd6f5aae386d58e0d4a80' },
    };
    fireEvent.change(search, data);

    const searchButton = render.getAllByTestId('searchButton')[0];
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Transaction Details • Elrond Explorer');
    });
  });
  test('Seach finds address', async () => {
    const render = beforeAll({
      route: '/search',
      networkRequests: {
        block: () => Promise.resolve(new Error('error')),
        transaction: () => Promise.resolve(new Error('error')),
      },
    });

    const search = render.getAllByTestId('search')[0];
    const data = {
      target: { value: addressResponse.account.address },
    };
    fireEvent.change(search, data);

    const searchButton = render.getAllByTestId('searchButton')[0];
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Address Details • Elrond Explorer');
    });
  });
  test('Seach does not find anything', async () => {
    const render = beforeAll({
      route: '/search',
      networkRequests: {
        block: () => Promise.resolve(new Error('error')),
        transaction: () => Promise.resolve(new Error('error')),
        address: () => Promise.resolve(new Error('error')),
      },
    });

    const search = render.getAllByTestId('search')[0];
    const data = {
      target: { value: 'random1234' },
    };
    fireEvent.change(search, data);

    const searchButton = render.getAllByTestId('searchButton')[0];
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(render.getByText('random1234')).toBeDefined();
    });
  });
});
