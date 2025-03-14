import { DEFAULT_HRP } from 'appConstants';

export const analytics = {
  sendEvent: ({
    action,
    label,
    explorerVersion,
    hrp = DEFAULT_HRP
  }: {
    action: string;
    label: string;
    explorerVersion: string;
    hrp?: string;
  }) => {
    try {
      const addressRegex = new RegExp(`${hrp}\\w+`, 'g');
      const hashRegex = new RegExp(/([a-z0-9]){64}/, 'g');

      let cleanLabel = label.replace(addressRegex, `${hrp}...`);
      cleanLabel = cleanLabel.replace(hashRegex, 'hash...');

      if ((window as any).ga) {
        (window as any).ga(
          'send',
          'event',
          action,
          cleanLabel,
          explorerVersion
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
};
