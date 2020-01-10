export interface TestnetType {
  /*
    Legend:
        decimals: number of displayed ERD decimals in explorer
        denomination: number by which transaction are divided
        numInitCharactersForScAddress: number of zeros to hide
    Possbile flags:
        wallet: (default) true
        validators: (default) true
        validatorDetails: (default) false
        economics: (default) false
        gasLimitEditable: (default) false
        data: (default) false
        faucet: (default) false (faucet)
  */
  default: boolean;
  id: string;
  name: string;
  nodeUrl: string;
  numInitCharactersForScAddress: number;
  elasticUrl: string;
  refreshRate: number;
  decimals: number;
  validators?: boolean;
  denomination: number;
  gasPrice: number;
  gasLimit: number;
  gasPerDataByte: number;
  gasLimitEditable?: boolean;
  economics?: boolean;
  data?: boolean;
  validatorDetails?: boolean;
  wallet?: boolean;
  faucet: boolean;
  validatorStatistics: boolean;
}

type AppIdType = 'wallet' | 'explorer' | 'studio' | 'docs';

interface AppsType {
  id: AppIdType;
  name: string;
  to: string;
}

interface ConfigType {
  metaChainShardId: number;
  elrondApps: AppsType[];
  testnets: TestnetType[];
}

export interface StateType {
  config: ConfigType;
  defaultTestnet: TestnetType;
  activeTestnet: TestnetType;
  activeTestnetId: string;
  timeout: number; // axios
  refresh: {
    timestamp: number;
    intervalId: ReturnType<typeof setInterval>;
    testnetId: string;
  };
}

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
    testnets:
      config.testnets && config.testnets.length
        ? config.testnets.map((testnet: any) => ({ ...defaultTestnet, ...testnet }))
        : [defaultTestnet],
  };
};

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

const configKey: any = 'CONFIG';
const windowConfig: ConfigType = window[configKey] as any;
const requireConfig = process.env.NODE_ENV === 'test' ? require('./../../public/config') : {};

const importedConfig = { ...requireConfig, ...windowConfig };

const configIsDefined =
  typeof importedConfig !== 'undefined' && Boolean(Object.keys(importedConfig)[0]);

const config = configIsDefined ? buildInitialConfig(importedConfig) : buildInitialConfig({});

const extendedConfig = {
  ...config,
  testnets: [
    ...config.testnets,
    ...(process.env.REACT_APP_WALLET && process.env.NODE_ENV === 'development'
      ? [
          {
            default: true,
            id: 'ireland',
            name: 'Ireland',
            nodeUrl: 'http://108.129.20.194',
            elasticUrl: 'http://18.200.142.29',
            refreshRate: 6000,
            numInitCharactersForScAddress: 20,
            decimals: 4,
            denomination: 4,
            gasPrice: 10,
            gasLimit: 1000,
            gasPerDataByte: 1500,
            gasLimitEditable: true,
            economics: true,
            data: true,
            validatorDetails: true,
            faucet: true,
            validatorStatistics: false,
          },
        ]
      : []),
  ],
};

const stateConfig = {
  ...extendedConfig,
  testnets: extendedConfig.testnets
    .sort((a, b) => {
      const defaultA = a.default ? 1 : 0;
      const defaultB = b.default ? 1 : 0;
      return defaultA - defaultB;
    })
    .reverse(),
};

const initialState: StateType = {
  config: stateConfig,
  defaultTestnet: config.testnets.filter(testnet => testnet.default).pop() || defaultTestnet,
  activeTestnet: config.testnets.filter(testnet => testnet.default).pop() || defaultTestnet,
  activeTestnetId: '',
  timeout: 3 * 1000,
  refresh: {
    timestamp: Date.now(),
    intervalId: setInterval(() => null, 100000000000),
    testnetId: 'default',
  },
};

export default initialState;
