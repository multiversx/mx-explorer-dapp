import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { GlobalProvider } from 'context';
import { ConfigType } from 'context/state';
import { createMemoryHistory, History } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { App } from '../App';

const customRender = (ui: any, options: any = {}) => render(ui, { wrapper: App, ...options });

const renderWithRouter = ({
  route = '/',
  history = createMemoryHistory({ initialEntries: ['/'] }),
  optionalConfig,
}: {
  route: string;
  history?: History;
  optionalConfig?: ConfigType;
}) => {
  history = createMemoryHistory({ initialEntries: [route] });
  return {
    ...render(
      <GlobalProvider>
        <Router history={history}>
          <App optionalConfig={optionalConfig} />
        </Router>
      </GlobalProvider>
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
