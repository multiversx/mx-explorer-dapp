import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';
import { renderWithRouter, waitForElement, fireEvent, wait } from '../../../utils/test-utils';
import response from './_search';

// TODO */
/**
 * good data, bad data, timeout (sa facem macar pe view timeoutul sa renunte dupa o vreme)
 * sa raspunda componenta la ele
 * mockuim pe teste
 *
 * - sa testez ca am next page
 */

test('Transactions page is displaying', () => {
  const { queryByTestId } = renderWithRouter({
    route: '/transactions/page/1',
  });
  expect(queryByTestId(/title/)!.innerHTML).toBe('Transactions');
});

const mockGet = jest.spyOn(axios, 'get');
const mockPost = jest.spyOn(axios, 'post');

test('Fetch makes an API call and displays the greeting', async () => {
  mockPost.mockReturnValue(Promise.resolve({ data: response }));

  const { queryByTestId } = renderWithRouter({
    route: '/cryptobubbles/transactions/page/1',
  });

  expect(mockGet).toHaveBeenCalledTimes(2);
  expect(mockGet).toHaveBeenLastCalledWith('https://elastic-aws-game.elrond.com/tps/_doc/meta');

  const pageNumber = await waitForElement(() => queryByTestId('pageNumber'));
  expect(pageNumber!.innerHTML).toBe('1');

  const table = queryByTestId('transactionsTable');
  const numberOfRows = table!.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  expect(numberOfRows).toHaveLength(2);

  const nextButton = await waitForElement(() => queryByTestId('nextPageButton'));
  expect(nextButton).toBeInTheDocument();

  const leftClick = { button: 0 };
  fireEvent.click(nextButton!, leftClick);

  const nextPageNumber = await waitForElement(() => queryByTestId('pageNumber'));
  expect(nextPageNumber!.innerHTML).toBe('2');
});
