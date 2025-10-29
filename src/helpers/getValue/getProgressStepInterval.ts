import BigNumber from 'bignumber.js';

export const getProgressStepInterval = (refreshInterval: number) => {
  switch (refreshInterval) {
    case 6000:
      return new BigNumber(1000);
    case 3000:
      return new BigNumber(500);
    case 2000:
      return new BigNumber(500);
    case 1000:
      return new BigNumber(200);
    case 600:
      return new BigNumber(100);

    default:
      const bNrefreshInterval = new BigNumber(refreshInterval);
      const stepInterval = bNrefreshInterval.isGreaterThan(1000)
        ? bNrefreshInterval.minus(1000)
        : bNrefreshInterval;

      return stepInterval.dividedBy(5);
  }
};
