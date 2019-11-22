import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { fireEvent, renderWithRouter, waitForElement } from '../../../utils/test-utils';
import errorResponse from './_errorResponse';
import response from './_search';

// TODO */
/**
 * good data, bad data, timeout (sa facem macar pe view timeoutul sa renunte dupa o vreme)
 * sa raspunda componenta la ele
 * mockuim pe teste
 *
 * - sa testez ca am next page
 */

// TODO: timeout axios 0 si testez cu asta (apare screenul de Unable to load in cazul in care se expira timeoutul)

test('Transactions page is displaying', () => {
  const { queryByTestId } = renderWithRouter({
    route: '/transactions/page/1',
  });
  expect(queryByTestId('title')!.innerHTML).toBe('Transactions');
});

test('Transactions data is displayed correctly', async () => {
  const mockGet = jest.spyOn(axios, 'get');
  const mockPost = jest.spyOn(axios, 'post');
  mockPost.mockReturnValue(Promise.resolve({ data: response }));

  const { queryByTestId } = renderWithRouter({
    route: '/transactions/page/1',
  });

  expect(mockGet).toHaveBeenCalledTimes(1);
  expect(mockGet).toHaveBeenLastCalledWith('https://elastic-aws.elrond.com/tps/_doc/meta', {
    timeout: 3000,
  });

  const pageNumber = await waitForElement(() => queryByTestId('pageNumber'));
  expect(pageNumber!.innerHTML).toBe('1');

  const table = queryByTestId('transactionsTable');
  const numberOfRows = table!.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  expect(numberOfRows).toHaveLength(2);
});

test('Transactions pager working', async () => {
  const mockPost = jest.spyOn(axios, 'post');
  mockPost.mockReturnValue(Promise.resolve({ data: response }));

  const { queryByTestId } = renderWithRouter({
    route: '/transactions/page/1',
  });

  const nextButton = await waitForElement(() => queryByTestId('nextPageButton'));
  expect(nextButton).toBeInTheDocument();

  const leftClick = { button: 0 };
  fireEvent.click(nextButton!, leftClick);

  const nextPageNumber = await waitForElement(() => queryByTestId('pageNumber'));
  expect(nextPageNumber!.innerHTML).toBe('2');
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
