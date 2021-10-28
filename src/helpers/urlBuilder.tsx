const urlBuilder = {
  shard: (shard: number | string) => `/blocks?shard=${shard}`,
  receiverShard: (shard: number | string) => `/transactions?receivershard=${shard}`,
  senderShard: (shard: number | string) => `/transactions?sendershard=${shard}`,
  transactionDetails: (hash: number | string) => `/transactions/${hash}`,
  transactionDetailsScResults: (hash: string) => `/transactions/${hash}/sc-results`,
  transactionDetailsLogs: (hash: string) => `/transactions/${hash}/logs`,
  nodeDetails: (publicKey: string) => `/nodes/${publicKey}`,
  accountDetails: (address: string) => `/accounts/${address}`,
  accountDetailsContractCode: (address: string) => `/accounts/${address}/code`,
  accountDetailsTokens: (address: string) => `/accounts/${address}/tokens`,
  accountDetailsNfts: (address: string) => `/accounts/${address}/nfts`,
  identityDetails: (id: string) => `/identities/${id}`,
  tokenDetails: (tokenId: string) => `/tokens/${tokenId}`,
  tokenDetailsAccounts: (tokenId: string) => `/tokens/${tokenId}/accounts`,
  providerDetails: (address: string) => `/providers/${address}`,
  providerDetailsTransactions: (address: string) => `/providers/${address}/transactions`,
};

export default urlBuilder;
