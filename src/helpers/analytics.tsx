const analytics = {
  send: ({ action, label }: { action: string; label: string }) => {
    try {
      const erdAddressRegex = new RegExp(/erd1\w+/, 'g');
      const hashRegex = new RegExp(/([a-z0-9]){64}/, 'g');

      let cleanLabel = label.replace(erdAddressRegex, 'erd1...');
      cleanLabel = cleanLabel.replace(hashRegex, 'hash...');

      if ((window as any).ga) {
        (window as any).ga('send', 'event', action, cleanLabel);
      }
    } catch (err) {
      console.error(err);
    }
  },
};

export default analytics;
