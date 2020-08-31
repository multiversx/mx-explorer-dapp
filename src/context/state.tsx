import { InferType } from 'yup';
import { defaultTestnet, schema } from './config';
import { validatorData, brandData } from './validators';
import { CancelTokenSource } from 'axios';

export type PublicConfigType = InferType<typeof schema>;

interface BasicTestnetType {
  refreshRate: number;
  decimals: number;
  validators?: boolean;
  denomination: number;
  gasPrice: number;
  gasLimit: number;
  gasPerDataByte: number;
  nrOfShards: number;
  versionNumber: string;
  fetchedFromNetworkConfig?: boolean;
}

export type TestnetType = BasicTestnetType & PublicConfigType;

type AppIdType = 'wallet' | 'explorer' | 'studio' | 'docs' | string;

interface AppsType {
  id: AppIdType;
  name: string;
  to: string;
}

export interface ConfigType {
  metaChainShardId: number;
  erdLabel: string;
  elrondApps: AppsType[];
  explorerApi: string;
  testnets: TestnetType[];
  secondary: boolean;
}

export interface StateType {
  config: ConfigType;
  defaultTestnet: TestnetType;
  activeTestnet: TestnetType;
  activeTestnetId: string;
  timeout: number; // axios
  cancelToken: CancelTokenSource | undefined;
  refresh: {
    timestamp: number;
  };
  validatorData: typeof validatorData;
  brandData: typeof brandData;
}

const initialState = (config: ConfigType, optionalConfig?: ConfigType): StateType => {
  const configObject = optionalConfig !== undefined ? optionalConfig : config;

  return {
    config: configObject,
    defaultTestnet: config.testnets.filter((testnet) => testnet.default).pop() || defaultTestnet,
    activeTestnet: config.testnets.filter((testnet) => testnet.default).pop() || defaultTestnet,
    activeTestnetId: '',
    timeout: 3 * 1000,
    cancelToken: undefined,
    refresh: {
      timestamp: Date.now(),
    },
    validatorData,
    brandData,
  };
};

export default initialState;
