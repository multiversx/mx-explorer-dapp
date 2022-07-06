import { GrowthBlockType } from '../GrowthBlock';
import { GrowthMetricsType, GrowthDataType } from 'context/state';

export type GrowthBlockSettingsType = keyof GrowthMetricsType['metrics'];

const getGrowthBlockSettings = ({
  type,
  data,
}: {
  type: GrowthBlockSettingsType;
  data?: GrowthDataType;
}): GrowthBlockType => {
  if (!data) {
    return {
      title: '',
      value: {
        text: '',
      },
    };
  }

  switch (type) {
    case 'egldUsdPrice':
      return {
        title: 'EGLD / USD Price',
        value: {
          text: data.primaryValue,
          isUsd: true,
        },
        description: {
          text: data.secondaryValue,
          showPercentage: true,
        },
        size: 'sm',
        color: 'primary',
      };
    case 'egldEurPrice':
      return {
        title: 'EGLD / EUR Price',
        value: { text: data.primaryValue, isEur: true },
        description: { text: data.secondaryValue, showPercentage: true },
        size: 'sm',
        color: 'primary',
      };
    case 'egldBtcPrice':
      return {
        title: 'EGLD / BTC Price',
        value: { text: data.primaryValue },
        description: { text: data.secondaryValue, showPercentage: true },
        size: 'sm',
        color: 'warning',
      };
    case 'egldEthPrice':
      return {
        title: 'EGLD / ETH Price',
        value: { text: data.primaryValue },
        description: { text: data.secondaryValue, showPercentage: true },
        size: 'sm',
        color: 'primary',
      };
    case 'allTimeHigh':
      return {
        title: 'All-Time High',
        value: { text: data.primaryValue, isUsd: true },
        description: { text: data.secondaryValue },
        size: 'sm',
      };
    case 'marketCapitalization':
      return {
        title: 'Market Capitalization',
        value: { text: data.primaryValue },
        description: { text: data.secondaryValue },
        size: 'sm',
      };
    case 'change24h':
      return {
        title: '24H Change',
        value: { text: data.primaryValue },
        description: { text: data.secondaryValue },
        size: 'sm',
        usePercentageColor: 'value',
      };
    case 'change7Day':
      return {
        title: '7-Day Change',
        value: { text: data.primaryValue },
        size: 'sm',
        usePercentageColor: 'value',
      };
    case 'change14Day':
      return {
        title: '14-Day Change',
        value: { text: data.primaryValue },
        description: { text: data.secondaryValue },
        size: 'sm',
        usePercentageColor: 'value',
      };
    case 'change30Day':
      return {
        title: '30-Day Change',
        value: { text: data.primaryValue },
        description: { text: data.secondaryValue },
        size: 'sm',
        usePercentageColor: 'value',
      };
    case 'change200Day':
      return {
        title: '200-Day Change',
        value: { text: data.primaryValue },
        description: { text: data.secondaryValue },
        size: 'sm',
        usePercentageColor: 'value',
      };
    case 'change1Year':
      return {
        title: '1-Year Change',
        value: { text: data.primaryValue },
        description: { text: data.secondaryValue },
        size: 'sm',
        usePercentageColor: 'value',
      };
    case 'exchangeVolume24h':
      return {
        title: '24H Exchange Volume',
        value: { text: data.secondaryValue, isEgld: true },
        description: { text: data.primaryValue, isUsd: true },
        size: 'lg',
      };
    case 'exchangeWithdraw24h':
      return {
        title: '24H Exchange Withdraw',
        value: { text: data.primaryValue, isEgld: true, prefix: '-' },
        description: { text: data.secondaryValue, isUsd: true },
        size: 'lg',
      };
    case 'exchangeDeposits24h':
      return {
        title: '24H Exchange Deposits',
        value: { text: data.primaryValue, isEgld: true, prefix: '+' },
        description: { text: data.secondaryValue, isUsd: true },
        size: 'lg',
      };
    case 'currentEgldSupply':
      return {
        title: 'Current EGLD Supply',
        value: { text: data.primaryValue, isEgld: true },
        description: { text: data.secondaryValue, isUsd: true },
        size: 'md',
      };
    case 'lockedEgld':
      return {
        title: 'Locked EGLD',
        value: { text: data.primaryValue, isEgld: true },
        description: { text: data.secondaryValue },
        size: 'md',
      };
    case 'freeFloatingEgld':
      return {
        title: 'Free Floating EGLD',
        value: { text: data.primaryValue, isEgld: true },
        description: { text: data.secondaryValue },
        size: 'md',
      };
    case 'egldLeftPerUser':
      return {
        title: 'EGLD Left Per User',
        value: { text: data.primaryValue, isEgld: true },
        description: { text: data.secondaryValue, isUsd: true },
        size: 'md',
      };
    case 'addresses':
      return {
        title: 'Addresses',
        value: { text: data.primaryValue },

        size: 'md',
      };
    case 'newAddresses':
      return {
        title: 'New Addresses',
        value: { text: data.primaryValue, prefix: '+' },
        color: 'primary',
        size: 'md',
      };
    case 'maiarUsers':
      return {
        title: 'Maiar Users',
        value: { text: data.primaryValue },
        size: 'md',
      };
    case 'newMaiarUsers':
      return {
        title: 'New Maiar Users',
        value: { text: data.primaryValue, prefix: '+' },
        size: 'md',
        color: 'primary',
      };

    default:
      return {
        title: '',
        value: {
          text: '',
        },
      };
  }
};

export default getGrowthBlockSettings;
