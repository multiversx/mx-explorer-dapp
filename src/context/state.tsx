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
  denomination: number;
  gasPrice: number;
  gasLimit: number;
  economics?: boolean;
  data?: boolean;
  wallet?: boolean;
  validatorDetails?: boolean;
  faucet: boolean;
}

interface ConfigType {
  metaChainShardId: number;
  testnets: Array<TestnetType>;
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
  economics: false,
  data: false,
  wallet: false,
  validatorDetails: false,
  faucet: false,
};

//TODO: de ce se fac multe calluri de _count ?

const configKey: any = 'CONFIG';
const windowConfig: ConfigType = window[configKey] as any;
const requireConfig = process.env.NODE_ENV === 'test' ? require('./../../public/config') : {};

const importedConfig = { ...requireConfig, ...windowConfig };

const configIsDefined =
  typeof importedConfig !== 'undefined' && Boolean(Object.keys(importedConfig)[0]);

const config = configIsDefined ? buildInitialConfig(importedConfig) : buildInitialConfig({});

const initialState: StateType = {
  config: {
    ...config,
    testnets: config.testnets
      .sort((a, b) => {
        const defaultA = a.default ? 1 : 0;
        const defaultB = b.default ? 1 : 0;
        return defaultA - defaultB;
      })
      .reverse(),
  },
  defaultTestnet: config.testnets.filter(testnet => testnet.default).pop() || defaultTestnet,
  activeTestnet: config.testnets.filter(testnet => testnet.default).pop() || defaultTestnet,
  activeTestnetId: '',
  timeout: 3 * 1000,
  refresh: {
    timestamp: Date.now(),
    intervalId: setInterval(() => {}, 100000000000),
    testnetId: 'default',
  },
};

export default initialState;
