import { defaultTestnet } from './config';
import { validatorData, brandData } from './validators';

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
  validatorData: typeof validatorData;
  brandData: typeof brandData;
}

const initialState = (config: ConfigType, optionalConfig?: ConfigType): StateType => {
  const configObject = optionalConfig !== undefined ? optionalConfig : config;

  return {
    config: configObject,
    defaultTestnet: config.testnets.filter(testnet => testnet.default).pop() || defaultTestnet,
    activeTestnet: config.testnets.filter(testnet => testnet.default).pop() || defaultTestnet,
    activeTestnetId: '',
    timeout: 3 * 1000,
    refresh: {
      timestamp: Date.now(),
      intervalId: setInterval(() => null, 10000000),
      testnetId: 'default',
    },
    validatorData,
    brandData,
  };
};

export default initialState;
