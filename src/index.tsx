import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

import './index.css';

if (
  process.env.NODE_ENV === 'development' &&
  process.env.REACT_APP_MSW === 'true'
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  // const { worker } = require('./__mocks__/server');
  // worker.start({
  //   onUnhandledRequest: 'bypass'
  // });
}

const container: any = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
