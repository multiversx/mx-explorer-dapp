export const getChartPropsFromId = (id: string) => {
  switch (id) {
    case 'daily-total-staked-egld-monthly':
    case 'total-value-locked-plus-staking-monthly':
    case 'daily-fees-captured-monthly':
      return {
        currency: 'EGLD'
      };
    case 'daily-average-apr-monthly':
    case 'daily-base-apr-monthly':
    case 'daily-topup-apr-monthly':
      return {
        percentageMultiplier: 100
      };
    case 'daily-developer-rewards-monthly':
    case 'daily-inflation-monthly':
      return {
        denomination: 18,
        currency: 'EGLD'
      };
    case 'daily-new-smart-contracts-monthly':
    case 'daily-new-fungible-esdts-monthly':
    case 'daily-new-nonfungible-esdts-monthly':
    case 'daily-new-semifungible-esdts-monthly':
    case 'daily-new-meta-esdts-monthly':
    case 'daily-new-nfts-monthly':
    case 'number-of-blocks-created-per-day-monthly':
    case 'daily-number-of-active-users-monthly':
    case 'daily-number-of-address-to-address-transactions-monthly':
    case 'daily-number-of-address-to-contract-transactions-monthly':
    case 'daily-number-of-contract-to-address-transactions-monthly':
    case 'daily-number-of-contract-to-contract-transactions-monthly':
    case 'daily-number-of-token-transfers-monthly':
    default:
      return {};
  }
};
