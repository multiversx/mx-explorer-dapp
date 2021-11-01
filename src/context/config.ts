import { object, string, array, boolean, InferType } from 'yup';
import { ConfigType, NetworkType } from './state';
import localTestnets from './localTestnets';

export const networkLink = object({
  id: string().defined().required(),
  name: string().defined().required(),
  url: string().required(),
}).required();

const networkBaseSchema = object({
  default: boolean(),
  id: string().defined().required(),
  erdLabel: string().defined().required(),
  name: string().defined().required(),
  theme: string(),
  walletAddress: string(),
  explorerAddress: string(),
  accessToken: boolean(),
}).required();

export const adapterSchema = object({
  adapter: string().defined().oneOf(['api', 'elastic']),
  apiUrl: string().when('adapter', {
    is: 'api',
    then: string().required(),
  }),
  delegationApi: string().when('adapter', {
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

export const schema = networkBaseSchema.concat(adapterSchema);

export const configSchema = object({
  links: array().of(networkLink),
  elrondApps: array().of(networkLink).required(),
  networks: array().of(schema).required(),
}).required();

export const defaultNetwork: NetworkType = {
  default: false,
  id: 'not-configured',
  name: 'NOT CONFIGURED',
  adapter: 'api',
  erdLabel: '',
  apiUrl: 'https://api.elrond.com',
  delegationApi: 'https://delegation-api.elrond.com',
  theme: 'default',
  accessToken: false,
};

type ImportedConfigType = InferType<typeof configSchema>;

export const buildInitialConfig = (config: ImportedConfigType): ConfigType => {
  configSchema.validate(config, { strict: true }).catch(({ errors }) => {
    console.error(`Config invalid format`, errors);
  });

  return {
    links: config.links || [],
    elrondApps: config.elrondApps,
    networks: config.networks.map((network: any) => ({ ...defaultNetwork, ...network })),
  };
};

const configKey: any = 'CONFIG';
const windowConfig: ConfigType = window[configKey] as any;
const requireConfig = process.env.NODE_ENV === 'test' ? require('./../../public/config') : {};

let config = { ...requireConfig, ...windowConfig };

config = buildInitialConfig(config);

const extendedConfig: ConfigType = {
  ...config,
  networks: [
    ...config.networks,
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
