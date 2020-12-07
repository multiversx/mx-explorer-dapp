const analytics = {
  sendEvent: ({
    action,
    label,
    explorerVersion,
  }: {
    action: string;
    label: string;
    explorerVersion: string;
  }) => {
    try {
      const erdAddressRegex = new RegExp(/erd1\w+/, 'g');
      const hashRegex = new RegExp(/([a-z0-9]){64}/, 'g');

      let cleanLabel = label.replace(erdAddressRegex, 'erd1...');
      cleanLabel = cleanLabel.replace(hashRegex, 'hash...');

      if ((window as any).ga) {
        (window as any).ga('send', 'event', action, cleanLabel, explorerVersion);
      }
    } catch (err) {
      console.error(err);
    }
  },
};

export default analytics;
