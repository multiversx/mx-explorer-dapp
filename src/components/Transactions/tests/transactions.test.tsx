import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';
import { renderWithRouter, waitForElement, fireEvent, wait } from '../../../utils/test-utils';
import response from './_search';

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
    route: '/transactions/page/1',
  });

  expect(mockGet).toHaveBeenCalledTimes(2);
  expect(mockGet).toHaveBeenLastCalledWith('https://elastic-aws.elrond.com/tps/_doc/meta');

  const nextButton = await waitForElement(() => queryByTestId('nextPageButton'));
  expect(nextButton).toBeInTheDocument();

  const leftClick = { button: 0 };
  fireEvent.click(nextButton!, leftClick);

  const pageNumber = await waitForElement(() => queryByTestId('pageNumber'));
  expect(pageNumber!.innerHTML).toBe('2');

  const table = queryByTestId('transactionsTable');
  const numberOfRows = table!.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
  expect(numberOfRows).toHaveLength(2);
});
