import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { fireEvent, renderWithRouter, wait, waitForElement } from 'utils/test-utils';
import search from './_search';
import searchPage2 from './_searchPage2';

describe('Transactions Page', () => {
  test('Transactions page is displaying', () => {
    const { queryByTestId } = renderWithRouter({
      route: '/transactions/page/1',
    });
    expect(queryByTestId('title')!.innerHTML).toBe('Transactions');
  });

  test('Transactions data is displayed correctly', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data: search }));
    mockPost.mockReturnValue(
      Promise.resolve({
        data: { count: 6538186, _shards: { total: 1, successful: 1, skipped: 0, failed: 0 } },
      })
    );

    const { queryByTestId } = renderWithRouter({
      route: '/transactions/page/1',
    });

    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(mockGet).toHaveBeenLastCalledWith('https://elastic-aws.elrond.com/tps/_doc/meta', {
      timeout: 3000,
    });

    const pageInterval = await waitForElement(() => queryByTestId('pageInterval'));
    expect(pageInterval!.innerHTML).toBe('1-50');

    const table = queryByTestId('transactionsTable');
    const numberOfRows = table!.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    expect(numberOfRows).toHaveLength(2);
  });

  test('Transactions pager working', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data: search }));
    mockPost.mockReturnValueOnce(
      Promise.resolve({
        data: { count: 6538186, _shards: { total: 1, successful: 1, skipped: 0, failed: 0 } },
      })
    );
    mockPost.mockReturnValueOnce(Promise.resolve({ data: searchPage2 }));
    mockPost.mockReturnValueOnce(
      Promise.resolve({
        data: { count: 6538186, _shards: { total: 1, successful: 1, skipped: 0, failed: 0 } },
      })
    );

    const { queryByTestId } = renderWithRouter({
      route: '/transactions/page/1',
    });

    const nextButton = await waitForElement(() => queryByTestId('disabledNextPageButton'));
    expect(nextButton).toBeInTheDocument();

    const pageInterval = await waitForElement(() => queryByTestId('pageInterval'));
    expect(pageInterval!.innerHTML).toBe('1-50');
  });

  test('Transactions errorScreen showing', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockRejectedValue(new Error('transaction error'));

    const render = renderWithRouter({
      route: '/transactions/page/1',
    });

    // await wait(async () => {
    const errorScreen = await render.findByTestId('errorScreen');
    expect(errorScreen).toBeInTheDocument();
    // });
  });
});

describe('Transactions Page Links', () => {
  test('Transaction link', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data: search }));
    mockPost.mockReturnValue(
      Promise.resolve({
        data: { count: 6538186, _shards: { total: 1, successful: 1, skipped: 0, failed: 0 } },
      })
    );

    const render = renderWithRouter({
      route: '/transactions',
    });

    const links = await render.findAllByTestId('transactionLink');
    expect(links[0].textContent).toBe('e4cb2e0faaca38982...');

    fireEvent.click(links[0]);
    await wait(async () => {
      expect(document.title).toEqual('Transaction Details • Elrond Explorer');
    });
  });
  test('Shard from link', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data: search }));
    mockPost.mockReturnValue(
      Promise.resolve({
        data: { count: 6538186, _shards: { total: 1, successful: 1, skipped: 0, failed: 0 } },
      })
    );

    const render = renderWithRouter({
      route: '/transactions',
    });

    const links = await render.findAllByTestId('shardFromLink');
    expect(links[0].textContent).toBe('Shard 4');

    fireEvent.click(links[0]);
    await wait(async () => {
      expect(document.title).toEqual('Shard Details • Elrond Explorer');
    });
  });
  test('Shard to link', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data: search }));
    mockPost.mockReturnValue(
      Promise.resolve({
        data: { count: 6538186, _shards: { total: 1, successful: 1, skipped: 0, failed: 0 } },
      })
    );

    const render = renderWithRouter({
      route: '/transactions',
    });

    const links = await render.findAllByTestId('shardToLink');
    expect(links[0].textContent).toBe('Shard 2');

    fireEvent.click(links[0]);
    await wait(async () => {
      expect(document.title).toEqual('Shard Details • Elrond Explorer');
    });
  });
  test('Receiver link', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data: search }));
    mockPost.mockReturnValue(
      Promise.resolve({
        data: { count: 6538186, _shards: { total: 1, successful: 1, skipped: 0, failed: 0 } },
      })
    );

    const render = renderWithRouter({
      route: '/transactions',
    });

    const links = await render.findAllByTestId('receiverLink');
    expect(links[0].textContent).toBe('f03c105f05dc...08260085333a');

    fireEvent.click(links[0]);
    await wait(async () => {
      expect(document.title).toEqual('Address Details • Elrond Explorer');
    });
  });
});
