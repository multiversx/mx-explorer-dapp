export interface TestnetType {
  /*
    Legend:
        decimals: number of displayed ERD decimals in explorer
        denomination: number by which transaction are divided
    Possbile flags:
        wallet: (default) true
        validators: (default) true
        validatorInfos: (default) false
        economics: (default) false
        data: (default) false
        requestTokens: (default) false (faucet)
  */
  default: boolean;
  id: string;
  name: string;
  nodeUrl: string;
  elasticUrl: string;
  decimals: number;
  denomination: number;
  gasPrice: number;
  gasLimit: number;
  economics?: boolean;
  data?: boolean;
  wallet?: boolean;
  validatorInfos?: boolean;
  requestTokens: boolean;
}

interface ConfigType {
  storageKeyDerivation: string;
  storageAccountData: string;
  metaChainShardId: number;
  blockSize: number;
  testnets: Array<TestnetType>;
}

export interface StateType {
  config: ConfigType;
}

const buildInitialConfig = (config: any): ConfigType => {
  return {
    storageKeyDerivation: config.storageKeyDerivation || 'kd',
    storageAccountData: config.storageAccountData || 'account',
    metaChainShardId: config.metaChainShardId || 4294967295,
    blockSize: config.blockSize || 6,
    testnets:
      config.testnets && config.testnets.length
        ? config.testnets.map((testnet: any) => ({ ...defaultTestnet, ...testnet }))
        : [defaultTestnet],
  };
};

export const defaultTestnet = {
  default: false,
  id: 'testnet-1036',
  name: 'Testnet-1036',
  nodeUrl: 'https://wallet-api.elrond.com',
  elasticUrl: 'https://elastic-aws.elrond.com',
  decimals: 0,
  denomination: 0,
  gasPrice: 10,
  gasLimit: 1000,
  economics: false,
  data: false,
  wallet: true,
  validatorInfos: false,
  requestTokens: false,
};

const configKey: any = 'CONFIG';
const windowConfig: ConfigType = window[configKey] as any;
const requireConfig = ['test', 'development'].includes(process.env.NODE_ENV)
  ? require('./../../public/config')
  : {};
const config = { ...requireConfig, ...windowConfig };

const configIsDefined = typeof config !== 'undefined' && Boolean(Object.keys(config)[0]);

const initialState: StateType = {
  config: configIsDefined ? buildInitialConfig(config) : buildInitialConfig({}),
};

export default initialState;
