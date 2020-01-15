import axios from 'axios';
import { fireEvent, renderWithRouter, wait } from './../../../utils/test-utils';
import addressResponse from './address';
import blocksResponse from './blocks';
import transactionsResponse from './transactions';

describe('Search', () => {
  test('Seach finds validator', async () => {
    const render = renderWithRouter({
      route: '/search',
    });

    const search = render.getByTestId('search');
    const data = {
      target: {
        value:
          '8f2756c3dbe37c9a249f0e1472f80f8142126c09ee77608e1e61e6e1aa2b6d786ef891653db163e3fa55e70e94cdf37f359c25edccd44773e6acd3a2c9ebb1154c758845a6034625104427bd9343b5db7c65e4df13a7cbe2b123e461e3deeccb3b79594d347a3cad1a8ce0162ed3aa2995bfd455f3fbe9a94b37e699523b8cc5',
      },
    };
    fireEvent.change(search, data);

    const searchButton = render.getByTestId('searchButton');
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Validator Details • Elrond Explorer');
    });
  });
  test('Seach finds block', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(
      Promise.resolve({
        data: blocksResponse,
      })
    );

    const render = renderWithRouter({
      route: '/search',
    });

    const search = render.getByTestId('search');
    const data = {
      target: { value: '901e887c820aaf651f87c0c8b65aadb41d9bfb652c6d47be3575395307324d5c' },
    };
    fireEvent.change(search, data);

    const searchButton = render.getByTestId('searchButton');
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Block Details • Elrond Explorer');
    });
  });
  test('Seach finds transaction', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockRejectedValueOnce(new Error('blocks error'));
    mockGet.mockReturnValueOnce(
      Promise.resolve({
        data: transactionsResponse,
      })
    );

    const render = renderWithRouter({
      route: '/search',
    });

    const search = render.getByTestId('search');
    const data = {
      target: { value: '41fa1461ac134ee095dbee60c3cc2848255181aaa2bdd6f5aae386d58e0d4a80' },
    };
    fireEvent.change(search, data);

    const searchButton = render.getByTestId('searchButton');
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Transaction Details • Elrond Explorer');
    });
  });
  test('Seach finds address', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockRejectedValueOnce(new Error('blocks error'));
    mockGet.mockRejectedValueOnce(new Error('transactions error'));
    mockGet.mockReturnValueOnce(
      Promise.resolve({
        data: addressResponse,
      })
    );

    const render = renderWithRouter({
      route: '/search',
    });

    const search = render.getByTestId('search');
    const data = {
      target: { value: '28096662d4639f2da12984c62f5a0ef92e8eb7cbb81d9a7dc6a8b250f001834c' },
    };
    fireEvent.change(search, data);

    const searchButton = render.getByTestId('searchButton');
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Address Details • Elrond Explorer');
    });
  });
  test('Seach does not find anyting', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockRejectedValueOnce(new Error('blocks error'));
    mockGet.mockRejectedValueOnce(new Error('transactions error'));
    mockGet.mockRejectedValueOnce(new Error('address error'));

    const render = renderWithRouter({
      route: '/search',
    });

    const search = render.getByTestId('search');
    const data = {
      target: { value: 'random1234' },
    };
    fireEvent.change(search, data);

    const searchButton = render.getByTestId('searchButton');
    fireEvent.click(searchButton);

    await wait(async () => {
      expect(document.title).toEqual('Search • Elrond Explorer');
      expect(render.getByText('random1234').innerHTML).toBe('random1234');
    });
  });
});
