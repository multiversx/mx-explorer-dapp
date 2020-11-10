import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { render } from '@testing-library/react';
import { GlobalProvider } from 'context';
import { ConfigType } from 'context/state';
import { createMemoryHistory, History } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { App } from '../App';
import defaultConfig from './config';
import * as rawData from './rawData';

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
      <GlobalProvider optionalConfig={optionalConfig}>
        <Router history={history}>
          <App optionalConfig={optionalConfig || defaultConfig} />
        </Router>
      </GlobalProvider>
    ),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
};

interface MockImplementationType {
  networkRequests?: { [key: string]: () => Promise<any> };
}

const mockImplementation = ({ networkRequests }: MockImplementationType) => {
  const requests = {
    meta: () => Promise.resolve({ data: rawData.meta }),
    heartbeatstatus: () =>
      Promise.resolve({ data: { data: rawData.heartbeatstatus, code: 'successful' } }),
    validatorStatistics: () =>
      Promise.resolve({ data: { data: rawData.statistics, code: 'successful' } }),
    validators: () => Promise.resolve({ data: rawData.validators }),
    transactionsCount: () => Promise.resolve({ data: 14253408 }),
    transactions: () => Promise.resolve({ data: rawData.transactionsSearch }),
    transaction: () => Promise.resolve({ data: rawData.transactions }),
    blocksCount: () => Promise.resolve({ data: 239890 }),
    blocks: () => Promise.resolve({ data: rawData.blocks }),
    block: () => {
      return Promise.resolve({ data: rawData.block });
    },
    miniblock: () => Promise.resolve({ data: rawData.miniblock }),
    networkStatus: () => Promise.resolve({ data: { data: rawData.epoch, code: 'successful' } }),
    ratingshistory: () => Promise.resolve({ data: rawData.ratings }),
    address: () => Promise.resolve({ data: { data: rawData.address, code: 'successful' } }),
    ...networkRequests,
  };

  return (url: string): any => {
    switch (true) {
      // --- page load ---
      case url.includes('/tps/meta'):
        return requests.meta();
      case url.includes('/node/heartbeatstatus'):
        return requests.heartbeatstatus();
      case url.includes('/validator/statistics'):
        return requests.validatorStatistics();
      // --- page load ---
      case url.includes('network/status'):
        return requests.networkStatus();
      case url.includes('/validators'):
        return requests.validators();
      case url.includes('/transactions-alt/count'):
        return requests.transactionsCount();
      case url.includes('/transactions/'):
        return requests.transaction();
      case url.includes('/transactions'):
        return requests.transactions();
      case url.includes('/address/'):
        return requests.address();
      case url.includes('/blocks/count'):
        return requests.blocksCount();
      case url.includes('/miniblocks/'):
        return requests.miniblock();
      case url.includes('/blocks/'):
        return requests.block();
      case url.includes('/blocks'):
        return requests.blocks();
      case url.includes('/ratingshistory/'):
        return requests.ratingshistory();
    }
  };
};

const beforeAll = ({
  route,
  networkRequests,
  optionalConfig = defaultConfig,
}: {
  route: string;
  networkRequests?: MockImplementationType['networkRequests'];
  optionalConfig?: ConfigType;
}) => {
  const mockGet = jest.spyOn(axios, 'get');

  mockGet.mockImplementation(mockImplementation({ networkRequests }));

  return renderWithRouter({
    route,
    optionalConfig,
  });
};

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render, renderWithRouter, beforeAll };
