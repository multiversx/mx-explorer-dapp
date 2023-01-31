export type HeadersBlocksType = {
  blockHeight?: number;
  totalApplicationsDeployed?: number;
  totalNetworkFees?: number;
  totalDeveloperRewards?: number;
};

export type HeadersAccountsType = {
  totalAccounts?: number;
  activeAccountsToday?: number;
  newAccountsToday?: number;
  usersStaking?: number;
  accountsBalanceGt1000?: number;
};

export type HeadersCollectionsType = {
  totalCollections?: number;
  totalNFTsCreated?: number;
  totalHolders?: number;
  newNFTsInLast30d?: number;
};

export type HeadersTokensType = {
  ecosystemMarketCap?: number;
  totalTokens?: number;
  newTokensInLast30d?: number;
  tokenTransfersInLast30d?: number;
};

export type PageHeaderStatsType = {
  blocks?: HeadersBlocksType;
  accounts?: HeadersAccountsType;
  collections?: HeadersCollectionsType;
  tokens?: HeadersTokensType;
};
