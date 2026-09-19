import { useEffect } from 'react';
import { UAParser } from 'ua-parser-js';

import { formatClassName } from 'helpers';

export const useSetBrowserClassNames = () => {
  const browser = UAParser();

  useEffect(() => {
    if (browser?.browser?.name) {
      document.body.classList.add(formatClassName(browser.browser.name));
    }
    if (browser?.engine?.name) {
      document.body.classList.add(formatClassName(browser.engine.name));
    }
    if (browser?.os?.name) {
      document.body.classList.add(formatClassName(browser.os.name));
    }
  }, []);
};
