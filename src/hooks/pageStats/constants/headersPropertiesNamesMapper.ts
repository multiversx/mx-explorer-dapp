export const headersPropertiesNamesMapper: Record<string, any> = {
  blocks: {
    blockHeight: 'Block Height',
    totalApplicationsDeployed: 'Total Applications Deployed',
    totalDeveloperRewards: 'Total Developer Rewards',
    totalNetworkFees: 'Total Network Fees'
  },
  collections: {
    newNFTsInLast30d: 'New NFTs Created in last 30 days',
    totalCollections: 'Total Collections',
    totalHolders: 'Total NFT Holders',
    totalNFTsCreated: 'Total NFTs'
  },
  tokens: {
    ecosystemMarketCap: 'Ecosystem Market Cap',
    newTokensInLast30d: 'New Tokens Created In Last 30 days',
    tokenTransfersInLast30d: 'Token Transfers In Last 30 days',
    totalTokens: 'Total Tokens'
  },
  accounts: {
    // accountsBalanceGt1000: 'Accounts Balance GT1000',
    activeAccountsToday: 'Accounts Active Today',
    newAccountsToday: 'New Accounts Today',
    totalAccounts: 'Total Accounts',
    usersStaking: 'Users Staking'
  }
};

export const headersPropertiesOrderMapper: Record<string, any> = {
  blocks: {
    blockHeight: 0,
    totalApplicationsDeployed: 1,
    totalDeveloperRewards: 2,
    totalNetworkFees: 3
  },
  collections: {
    totalNFTsCreated: 0,
    totalCollections: 1,
    totalHolders: 2,
    newNFTsInLast30d: 3
  },
  tokens: {
    ecosystemMarketCap: 0,
    totalTokens: 1,
    newTokensInLast30d: 2,
    tokenTransfersInLast30d: 3
  },
  accounts: {
    totalAccounts: 0,
    usersStaking: 1,
    activeAccountsToday: 2,
    newAccountsToday: 3
    // accountsBalanceGt1000: 4
  }
};
