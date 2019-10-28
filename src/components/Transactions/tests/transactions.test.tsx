import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';
import { renderWithRouter, waitForElement, fireEvent } from '../../../utils/test-utils';
import response from './_search';

test('Transactions page is displaying', () => {
  const { queryByTestId } = renderWithRouter({
    route: '/transactions/page/1',
  });
  expect(queryByTestId(/title/)!.innerHTML).toBe('Transactions');
});

const mock = jest.spyOn(axios, 'get');

test('Fetch makes an API call and displays the greeting', async () => {
  mock.mockReturnValueOnce(Promise.resolve(response));

  const { queryByTestId } = renderWithRouter({
    route: '/transactions/page/1',
  });

  expect(axios.get).toHaveBeenCalledTimes(2);

  const nextButton = await waitForElement(() => queryByTestId('nextPageButton'));
  expect(nextButton).toBeInTheDocument();

  const leftClick = { button: 0 };
  fireEvent.click(nextButton!, leftClick);

  const pageNumber = await waitForElement(() => queryByTestId('pageNumber'));
  expect(pageNumber!.innerHTML).toBe('2');
});
