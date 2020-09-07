import { object, string, number, boolean } from 'yup';
import { ConfigType, NetworkType } from './state';
import localTestnets from './localTestnets';

export const adapterSchema = object({
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
}).required();

const baseSchema = object({
  default: boolean(),
  id: string().defined().required(),
  name: string().defined().required(),
  numInitCharactersForScAddress: number().defined().required(),
  validatorDetails: boolean(),
}).required();

export const schema = baseSchema.concat(adapterSchema);

export const defaultNetwork: NetworkType = {
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
    networks:
      config.networks && config.networks.length
        ? config.networks.map((network: any) => {
            schema.validate(network, { strict: true }).catch(({ errors }) => {
              console.error(`Wrong config for ${network.name} network.`, errors);
            });
            return { ...defaultNetwork, ...network };
          })
        : [defaultNetwork],
  };
};

const configKey: any = 'CONFIG';
const windowConfig: ConfigType = window[configKey] as any;
const requireConfig = process.env.NODE_ENV === 'test' ? require('./../../public/config') : {};

const importedConfig = { ...requireConfig, ...windowConfig };

const configIsDefined =
  typeof importedConfig !== 'undefined' && Boolean(Object.keys(importedConfig)[0]);

const config = configIsDefined ? buildInitialConfig(importedConfig) : buildInitialConfig({});

let configNetworks = [...config.networks];

if (
  localTestnets.some((testnet) => testnet.default) &&
  process.env.REACT_APP_USE_GLOBAL_DEFAULT === 'false'
) {
  configNetworks = configNetworks.map((network) => {
    schema.validate(network, { strict: true }).catch(({ errors }) => {
      console.error(`Wrong config for ${network.name} network.`, errors);
    });
    return { ...network, default: false };
  });
}

const extendedConfig = {
  ...config,
  networks: [
    ...configNetworks,
    ...localTestnets.map((t: any) => ({
      ...defaultNetwork,
      ...t,
    })),
  ],
};

export const stateConfig = {
  ...extendedConfig,
  networks: extendedConfig.networks
    .sort((a, b) => {
      const defaultA = a.default ? 1 : 0;
      const defaultB = b.default ? 1 : 0;
      return defaultA - defaultB;
    })
    .reverse(),
};

export default stateConfig;
