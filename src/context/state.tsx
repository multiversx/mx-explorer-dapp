import { InferType } from 'yup';
import config, { defaultNetwork, schema, adapterSchema } from './config';
import { validatorData, brandData } from './validators';
import { CancelTokenSource } from 'axios';

export type NetworkType = InferType<typeof schema>;
export type AdapterType = InferType<typeof adapterSchema>;

export interface ConfigType {
  networks: NetworkType[];
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

const initialState = (optionalConfig?: ConfigType): StateType => {
  const configObject = optionalConfig !== undefined ? optionalConfig : config;

  return {
    config: configObject,
    defaultNetwork:
      configObject.networks.filter((network) => network.default).pop() || defaultNetwork,
    activeNetwork:
      configObject.networks.filter((network) => network.default).pop() || defaultNetwork,
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
