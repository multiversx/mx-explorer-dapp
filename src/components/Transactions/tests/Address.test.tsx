import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { renderWithRouter, wait, meta } from '../../../utils/test-utils';
import search from './_search';

const address = {
  account: {
    address: 'erd1s5zs68g3j463rgqjskueh9288qhv3w2l7xac4g78vn9jue88ddds6alj03',
    nonce: 0,
    balance: '74200000000000000000000',
    code: '',
    codeHash: null,
    rootHash: null,
  },
};

const count = { count: 6107, _shards: { total: 5, successful: 5, skipped: 0, failed: 0 } };

describe('Address', () => {
  test('Address page is displaying', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    const mockPost = jest.spyOn(axios, 'post');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockGet.mockReturnValueOnce(Promise.resolve({ data: address }));
    mockPost.mockReturnValueOnce(Promise.resolve({ data: search }));
    mockPost.mockReturnValueOnce(Promise.resolve({ data: count }));

    const render = renderWithRouter({
      route: `/address/${address.account.address}`,
    });
    expect(document.title).toEqual('Address Details • Elrond Explorer');

    await wait(async () => {
      expect(render.getByText(address.account.address)).toBeInTheDocument();
      const pageInterval = render.getByTestId('pageInterval');
      expect(pageInterval!.innerHTML).toBe('1-50');
    });
  });
  test('Address page loading state', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    const mockPost = jest.spyOn(axios, 'post');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    mockPost.mockReturnValueOnce(Promise.resolve({ data: search }));
    mockPost.mockReturnValueOnce(Promise.resolve({ data: count }));

    const render = renderWithRouter({
      route: `/address/${address.account.address}`,
    });

    const loader = await render.findByTestId('loader');
    expect(loader).toBeDefined();
  });

  test('Transactions errorScreen showing', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    mockGet.mockReturnValueOnce(Promise.resolve({ data: meta }));
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockRejectedValue(new Error('transaction error'));

    const render = renderWithRouter({
      route: '/transactions/page/1',
    });

    const errorScreen = await render.findByTestId('errorScreen');
    expect(errorScreen).toBeInTheDocument();
  });
});
