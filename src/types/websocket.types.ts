export enum WebsocketSubcriptionsEnum {
  subscribeTransactions = 'subscribeTransactions',
  subscribeBlocks = 'subscribeBlocks',
  subscribePool = 'subscribePool',
  subscribeStats = 'subscribeStats',
  subscribeEvent = 'subscribeEvent'
}

export enum WebsocketEventsEnum {
  transactionUpdate = 'transactionUpdate',
  blocksUpdate = 'blocksUpdate',
  poolUpdate = 'poolUpdate',
  statsUpdate = 'statsUpdate',
  eventsUpdate = 'eventsUpdate'
}
