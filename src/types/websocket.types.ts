export enum WebsocketSubcriptionsEnum {
  subscribeTransactions = 'subscribeTransactions',
  subscribeBlocks = 'subscribeBlocks',
  subscribePool = 'subscribePool',
  subscribeStats = 'subscribeStats',
  subscribeEvent = 'subscribeEvent'
}

export enum WebsocketEventsEnum {
  connect = 'connect',
  connect_error = 'connect_error',
  disconnect = 'disconnect',

  transactionUpdate = 'transactionUpdate',
  blocksUpdate = 'blocksUpdate',
  poolUpdate = 'poolUpdate',
  statsUpdate = 'statsUpdate',
  eventsUpdate = 'eventsUpdate'
}
