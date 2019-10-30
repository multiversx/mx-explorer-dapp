import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';

it('shows validators in navbar', () => {
  const { getByText } = render(<App />);
  expect(getByText('transactions')).toBeInTheDocument();
});
