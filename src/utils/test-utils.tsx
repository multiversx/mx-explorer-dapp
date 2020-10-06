import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { GlobalProvider } from 'context';
import { ConfigType } from 'context/state';
import { createMemoryHistory, History } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';
import { App } from '../App';
import defaultConfig from './config';

export const config = defaultConfig;

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
          <App optionalConfig={optionalConfig || config} />
        </Router>
      </GlobalProvider>
    ),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
};

const meta = {
  id: 'meta',
  liveTPS: 125,
  peakTPS: 858,
  nrOfShards: 5,
  nrOfNodes: 100,
  blockNumber: 9480,
  roundNumber: 11502,
  roundTime: 6,
  averageBlockTxCount: 351,
  lastBlockTxCount: 755,
  totalProcessedTxCount: 3332899,
  shardID: 0,
  averageTPS: null,
  currentBlockNonce: 0,
};

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render, renderWithRouter, meta };
