export type HeadersBlocksType = {
  blockHeight?: number | string;
  totalApplicationsDeployed?: number | string;
  totalNetworkFees?: number | string;
  totalDeveloperRewards?: number | string;
};

export type HeadersAccountsType = {
  totalAccounts?: number | string;
  activeAccountsToday?: number | string;
  // newAccountsToday?: number | string;
  usersStaking?: number | string;
};

export type HeadersCollectionsType = {
  totalCollections?: number | string;
  totalNFTsCreated?: number | string;
  totalHolders?: number | string;
  newNFTsInLast30d?: number | string;
};

export type HeadersTokensType = {
  ecosystemMarketCap?: number | string;
  totalTokens?: number | string;
  newTokensInLast30d?: number | string;
  tokenTransfersInLast30d?: number | string;
};

export type PageHeaderStatsType = {
  blocks?: HeadersBlocksType;
  accounts?: HeadersAccountsType;
  collections?: HeadersCollectionsType;
  tokens?: HeadersTokensType;
};
