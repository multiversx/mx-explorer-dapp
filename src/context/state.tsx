import BigNumber from 'bignumber.js';
import { InferType } from 'yup';
import config, { defaultNetwork, schema, adapterSchema, networkLink } from './config';
// import { storage } from 'helpers';
import {
  AccountType,
  TokenType,
  // NetworkIdType,
  NodesVersionsType,
  ShardType,
  DelegationLegacyType,
  DelegationType,
  StakeType,
  IdentityType,
  ProviderType,
  CollectionType,
  NftEnumType,
  NetworkLinkType,
  NetworkType,
  AdapterType,
  ConfigType,
  GlobalStakeType,
  EconomicsType,
  StatsType,
  NotificationType,
  AccountStakingDetailsType,
  StateType,
} from 'types';

export const initialState = (optionalConfig?: ConfigType): StateType => {
  const configObject = optionalConfig !== undefined ? optionalConfig : config;

  return {
    config: configObject,
    defaultNetwork:
      configObject.networks.filter((network) => network.default).pop() || defaultNetwork,
    activeNetwork:
      configObject.networks.filter((network) => network.default).pop() || defaultNetwork,
    activeNetworkId: '',
    timeout: 10 * 1000,
    refresh: {
      timestamp: Date.now(),
    },
    theme: getTheme(),
    shards: [],
    globalStake: undefined,
    accountDetails: {
      address: '',
      balance: '',
      nonce: 0,
      txCount: 0,
      scrCount: 0,
      claimableRewards: '',
    },
    accountStakingDetails: {
      stakingDataReady: undefined,
      showDelegation: false,
      showDelegationLegacy: false,
      showStake: false,
      bNtotalStaked: new BigNumber(0),
      bNtotalDelegation: new BigNumber(0),
      bNtotalLegacyDelegation: new BigNumber(0),
      bNtotalLocked: new BigNumber(0),
      bNtotalClaimable: new BigNumber(0),
      providerDataReady: undefined,
      delegationProviders: [],
      delegationLegacyIdentity: undefined,
    },
    tokenDetails: {
      identifier: '',
      ticker: '',
      name: '',
      owner: '',
      minted: '',
      burnt: '',
      supply: '',
      circulatingSupply: '',
      canBurn: false,
      canChangeOwner: false,
      canFreeze: false,
      canMint: false,
      canPause: false,
      canUpgrade: false,
      canWipe: false,
      isPaused: false,
      accounts: 0,
      transactions: 0,
    },
    collectionDetails: {
      collection: '',
      type: NftEnumType.NonFungibleESDT,
      name: '',
      ticker: '',
      timestamp: 0,
      canFreeze: false,
      canWipe: false,
      canPause: false,
      canTransferNftCreateRole: false,
      canChangeOwner: false,
      canUpgrade: false,
      canAddSpecialRoles: false,
      canTransfer: false,
      owner: '',
    },
    usd: undefined,

    urlBlacklist: undefined,
    notifications: [],
    economics: {
      totalSupply: '',
      circulatingSupply: '',
      staked: '',
      price: '',
      marketCap: '',
      apr: '',
      topUpApr: '',
      baseApr: '',
      tokenMarketCap: '',
      totalStakedPercent: '',
      ecosystemMarketCap: '',
    },
    stats: {
      statsFetched: false,
      shards: '',
      blocks: '',
      accounts: '',
      transactions: '',
      epoch: 0,
      epochPercentage: 0,
      epochTotalTime: '',
      epochTimeElapsed: '',
      epochTimeRemaining: '',
      roundsPerEpoch: 0,
      roundsPassed: 0,
    },
  };
};

const getTheme = (): StateType['theme'] => {
  // temoporary always use the dark theme

  // const defaultNetwork = config.networks.find((network) => network.default);
  // const isMainnet = defaultNetwork && defaultNetwork.id === NetworkIdType.mainnet;

  // let theme = defaultNetwork && defaultNetwork.theme ? defaultNetwork.theme : 'light';

  // if (isMainnet) {
  //   const savedTheme = storage.getFromLocal('theme');
  //   const systemDarkThemeOn = window.matchMedia('(prefers-color-scheme: dark)').matches;

  //   if (!savedTheme && systemDarkThemeOn) {
  //     theme = 'dark';
  //   } else {
  //     theme = savedTheme === 'dark' ? 'dark' : theme;
  //   }
  // }

  return 'dark'; // theme;
};
