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
  activeTestnet: TestnetType;
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
  id: 'default-testnet',
  name: 'Default Testnet',
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
const requireConfig = process.env.NODE_ENV === 'test' ? require('./../../public/config') : {};

const importedConfig = { ...requireConfig, ...windowConfig };

const configIsDefined =
  typeof importedConfig !== 'undefined' && Boolean(Object.keys(importedConfig)[0]);

const config = configIsDefined ? buildInitialConfig(importedConfig) : buildInitialConfig({});

const initialState: StateType = {
  config,
  activeTestnet: config.testnets.filter(testnet => testnet.default).pop() || defaultTestnet,
};

export default initialState;
