import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { App } from '../index';

const customRender = (ui: any, options: any = {}) => render(ui, { wrapper: App, ...options });

const renderWithRouter = ({
  route = '/',
  history = createMemoryHistory({ initialEntries: ['/'] }),
}) => {
  history = createMemoryHistory({ initialEntries: [route] });
  return {
    ...render(
      <Router history={history}>
        <App />
      </Router>
    ),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
};

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render, renderWithRouter };
