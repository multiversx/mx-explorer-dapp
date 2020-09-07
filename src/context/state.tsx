import { InferType } from 'yup';
import { defaultNetwork, schema, adapterSchema } from './config';
import { validatorData, brandData } from './validators';
import { CancelTokenSource } from 'axios';

export type PublicConfigType = InferType<typeof schema>;
export type AdapterType = InferType<typeof adapterSchema>;

interface BasicNetworkType {
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

export type NetworkType = BasicNetworkType & PublicConfigType;

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
  networks: NetworkType[];
  secondary: boolean;
}

export interface StateType {
  config: ConfigType;
  defaultNetwork: NetworkType;
  activeNetwork: NetworkType;
  activeNetworkId: string;
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
    defaultNetwork: config.networks.filter((network) => network.default).pop() || defaultNetwork,
    activeNetwork: config.networks.filter((network) => network.default).pop() || defaultNetwork,
    activeNetworkId: '',
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
