import { object, string, number, boolean } from 'yup';
import { ConfigType, TestnetType } from './state';
import localTestnets from './localTestnets';

export const schema = object({
  default: boolean(),
  id: string().defined().required(),
  name: string().defined().required(),
  numInitCharactersForScAddress: number().defined().required(),
  adapter: string().defined().oneOf(['api', 'elastic']),
  apiUrl: string().when('adapter', {
    is: 'api',
    then: string().required(),
  }),
  elasticUrl: string().when('adapter', {
    is: 'elastic',
    then: string().required(),
  }),
  proxyUrl: string().when('adapter', {
    is: 'elastic',
    then: string().required(),
  }),
  validatorDetails: boolean(),
}).required();

export const defaultTestnet: TestnetType = {
  default: false,
  id: 'not-configured',
  name: 'NOT CONFIGURED',
  numInitCharactersForScAddress: 0,
  adapter: 'api',
  apiUrl: 'https://api.elrond.com',
  refreshRate: 0,
  decimals: 0,
  denomination: 0,
  gasPrice: 0,
  gasLimit: 0,
  gasPerDataByte: 0,
  validatorDetails: false,
  nrOfShards: 0,
  versionNumber: '',
};

export const buildInitialConfig = (config?: any): ConfigType => {
  return {
    metaChainShardId: config.metaChainShardId || 4294967295,
    erdLabel: config.erdLabel,
    secondary: Boolean(config.secondary),
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
        ? config.testnets.map((testnet: any) => {
            schema.validate(testnet, { strict: true }).catch(({ errors }) => {
              console.error(`Wrong config for ${testnet.name} network.`, errors);
            });
            return { ...defaultTestnet, ...testnet };
          })
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

let configTestnets = [...config.testnets];

if (
  localTestnets.some((testnet) => testnet.default) &&
  process.env.REACT_APP_USE_GLOBAL_DEFAULT === 'false'
) {
  configTestnets = configTestnets.map((testnet) => ({ ...testnet, default: false }));
}

const extendedConfig = {
  ...config,
  testnets: [
    ...configTestnets,
    ...localTestnets.map((t: any) => ({
      ...defaultTestnet,
      ...t,
    })),
  ],
};

export const stateConfig = {
  ...extendedConfig,
  testnets: extendedConfig.testnets
    .sort((a, b) => {
      const defaultA = a.default ? 1 : 0;
      const defaultB = b.default ? 1 : 0;
      return defaultA - defaultB;
    })
    .reverse(),
};

export default stateConfig;
