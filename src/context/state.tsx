import { AsyncConfigType } from './getAsyncConfig';
import localTestnets from './localTestnets';
import config, { defaultTestnet } from './config';

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
        validatorStatistics: (default) false
        hasBach32: (default) false
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

type AppIdType = 'wallet' | 'explorer' | 'studio' | 'docs' | string;

interface AppsType {
  id: AppIdType;
  name: string;
  to: string;
}

export interface ConfigType {
  metaChainShardId: number;
  elrondApps: AppsType[];
  explorerApi: string;
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

let configTestnets = [...config.testnets];

if (localTestnets.some(testnet => testnet.default) && !process.env.REACT_APP_USE_GLOBAL_DEFAULT) {
  configTestnets = configTestnets.map(testnet => ({ ...testnet, default: false }));
}

const extendedConfig = {
  ...config,
  testnets: [...configTestnets, ...localTestnets],
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

export interface InitialStateType {
  asyncConfig?: Array<{
    id: string;
    config: AsyncConfigType['message']['config'];
  }>;
  optionalConfig?: ConfigType;
}

const initialState = (
  asyncConfig?: InitialStateType['asyncConfig'],
  optionalConfig?: InitialStateType['optionalConfig']
): StateType => {
  let configObject = optionalConfig !== undefined ? optionalConfig : stateConfig;

  if (asyncConfig !== undefined && asyncConfig.length) {
    configObject = {
      ...configObject,
      testnets: configObject.testnets.map(testnet => {
        const config: any = asyncConfig.find(entry => entry.id === testnet.id);
        return config
          ? {
              ...testnet,
              gasLimit: config.erd_min_gas_limit,
              gasPrice: config.erd_min_gas_price,
              gasPerDataByte: config.erd_gas_per_data_byte,
              refreshRate: config.erd_round_duration,
            }
          : testnet;
      }),
    };
  }

  return {
    config: configObject,
    defaultTestnet: stateConfig.testnets.filter(testnet => testnet.default).pop() || defaultTestnet,
    activeTestnet: stateConfig.testnets.filter(testnet => testnet.default).pop() || defaultTestnet,
    activeTestnetId: '',
    timeout: 3 * 1000,
    refresh: {
      timestamp: Date.now(),
      intervalId: setInterval(() => null, 100000000000),
      testnetId: 'default',
    },
  };
};

export default initialState;
