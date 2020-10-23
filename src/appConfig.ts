export const explorerApi = 'https://explorer-api.elrond.com';
export const metaChainShardId = 4294967295;

export const elrondApps = [
  {
    id: 'main-site',
    name: 'Main site',
    to: 'https://elrond.com/',
  },
  {
    id: 'wallet',
    name: 'Wallet',
    to: '', // fetched from config
  },
  {
    id: 'explorer',
    name: 'Explorer',
    to: '', // fetched from config
  },
  {
    id: 'bridge',
    name: 'Bridge',
    to: 'https://bridge.elrond.com/',
  },
  {
    id: 'docs',
    name: 'Docs',
    to: 'https://docs.elrond.com/',
  },
];

export const gasLimit = 50000;
export const gasPrice = 1000000000;
export const gasPerDataByte = 1500;
export const refreshRate = 6000;
export const nrOfShards = 3;
export const versionNumber = 'v1.1.0.0';
export const denomination = 18;
export const decimals = 4;
export const numInitCharactersForScAddress = 14;
