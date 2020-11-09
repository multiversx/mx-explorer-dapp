import React from 'react';
import { StateInspector } from 'reinspect';
import ReactDOM from 'react-dom';
import App from './App';

let MountedApp = <App />;

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js');
  whyDidYouRender(React);
  MountedApp = (
    <StateInspector name="App">
      <App />
    </StateInspector>
  );
}

ReactDOM.render(MountedApp, document.getElementById('root'));
