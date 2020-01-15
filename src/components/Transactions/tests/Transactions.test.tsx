import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { fireEvent, renderWithRouter, waitForElement } from '../../../utils/test-utils';
import errorResponse from './_errorResponse';
import response from './_search';
import searchPage2 from './_searchPage2';

describe('Transactions', () => {
  test('Transactions page is displaying', () => {
    const { queryByTestId } = renderWithRouter({
      route: '/transactions/page/1',
    });
    expect(queryByTestId('title')!.innerHTML).toBe('Transactions');
  });

  test('Transactions data is displayed correctly', async () => {
    const mockGet = jest.spyOn(axios, 'get');
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValueOnce(Promise.resolve({ data: response }));
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
    mockPost.mockReturnValueOnce(Promise.resolve({ data: response }));
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

    const nextButton = await waitForElement(() => queryByTestId('nextPageButton'));
    expect(nextButton).toBeInTheDocument();

    const leftClick = { button: 0 };
    fireEvent.click(nextButton!, leftClick);

    const pageInterval = await waitForElement(() => queryByTestId('pageInterval'));
    expect(pageInterval!.innerHTML).toBe('50-100');
  });

  test('Transactions errorScreen showing', async () => {
    const mockPost = jest.spyOn(axios, 'post');
    mockPost.mockReturnValue(Promise.resolve({ data: errorResponse }));

    const { queryByTestId } = renderWithRouter({
      route: '/transactions/page/1',
    });

    const errorScreen = await waitForElement(() => queryByTestId('errorScreen'));
    expect(errorScreen).toBeInTheDocument();
  });
});
