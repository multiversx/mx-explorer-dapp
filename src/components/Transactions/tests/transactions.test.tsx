// import { renderWithRouter, fireEvent } from 'utils/test-utils';
import { renderWithRouter, fireEvent } from '../../../utils/test-utils';
import '@testing-library/jest-dom/extend-expect';

test('full app rendering/navigating', () => {
  const { container, getByText, queryByTestId } = renderWithRouter({
    route: '/transactions/page/1',
  });
  // normally I'd use a data-testid, but just wanted to show this is also possible
  expect(queryByTestId(/title/)!.innerHTML).toBe('Transactions');
  const leftClick = { button: 0 };
  //   fireEvent.click(getByText(/about/i), leftClick);
  // normally I'd use a data-testid, but just wanted to show this is also possible
  //   expect(container.innerHTML).toMatch('You are on the about page');
});
