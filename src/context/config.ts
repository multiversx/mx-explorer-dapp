import { ConfigType } from './state';

export const defaultTestnet = {
  default: false,
  id: 'not-configured',
  name: 'NOT CONFIGURED',
  numInitCharactersForScAddress: 0,
  nodeUrl: '',
  refreshRate: 0,
  elasticUrl: '',
  decimals: 0,
  denomination: 0,
  gasPrice: 0,
  gasLimit: 0,
  gasPerDataByte: 0,
  gasLimitEditable: false,
  economics: false,
  data: false,
  wallet: true,
  validatorDetails: false,
  faucet: false,
  validatorStatistics: false,
};

const buildInitialConfig = (config: any): ConfigType => {
  return {
    metaChainShardId: config.metaChainShardId || 4294967295,
    elrondApps: config.elrondApps.length
      ? config.elrondApps
      : [
          {
            id: 'studio',
            name: 'Empty',
            to: 'https://elrond.com/',
          },
        ],
    explorerApi: config.explorerApi,
    testnets:
      config.testnets && config.testnets.length
        ? config.testnets.map((testnet: any) => ({ ...defaultTestnet, ...testnet }))
        : [defaultTestnet],
  };
};

const configKey: any = 'CONFIG';
const windowConfig: ConfigType = window[configKey] as any;
const requireConfig = process.env.NODE_ENV === 'test' ? require('./../../public/config') : {};

const importedConfig = { ...requireConfig, ...windowConfig };

const configIsDefined =
  typeof importedConfig !== 'undefined' && Boolean(Object.keys(importedConfig)[0]);

const config = configIsDefined ? buildInitialConfig(importedConfig) : buildInitialConfig({});

export default config;
