import { io } from 'socket.io-client';

import {
  WebsocketConnectionStatusEnum,
  websocketConnection,
  initialWebsocketClientConfigs
} from 'appConstants';
import { isUpdatesWebsocketConnected } from 'helpers';
import { WebsocketEventsEnum, WebsocketSubcriptionsEnum } from 'types';

const TIMEOUT = 3000;
const RECONNECTION_ATTEMPTS = 3;
const RETRY_INTERVAL = 500;
const MESSAGE_DELAY = 1000;

type TimeoutType = ReturnType<typeof setTimeout> | null;

export async function initializeWebsocketConnection() {
  let messageTimeout: TimeoutType = null;
  const isWebsocketConnected = isUpdatesWebsocketConnected();
  const config = initialWebsocketClientConfigs[0];

  // Update socket status in store for status subscription
  const updateSocketStatus = (status: WebsocketConnectionStatusEnum) => {
    websocketConnection.status = status;
    console.log('----status', status);
    //setWebsocketStatus(status);
  };

  const handleMessageReceived = (message: string) => {
    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }
    messageTimeout = setTimeout(() => {
      console.log('---message', message);
      //setWebsocketEvent(message);
    }, MESSAGE_DELAY);
  };

  const closeConnection = () => {
    const instance = websocketConnection.instance;
    if (instance) {
      instance.off(WebsocketEventsEnum.connect);
      instance.off(WebsocketEventsEnum.connect_error);
      instance.off(WebsocketEventsEnum.disconnect);
      instance.close();
      console.info('Updates Websocket disconnected.');
    }

    updateSocketStatus(WebsocketConnectionStatusEnum.NOT_INITIALIZED);
    websocketConnection.instance = null;

    if (messageTimeout) {
      clearTimeout(messageTimeout);
    }
  };

  const initializeConnection = async () => {
    updateSocketStatus(WebsocketConnectionStatusEnum.PENDING);

    // const websocketUrl =
    //   customWebsocketUrl ?? (await getWebsocketUrl(apiAddress));

    const websocketUrl = 'https://devnet-socket-api.multiversx.com';

    if (!websocketUrl) {
      updateSocketStatus(WebsocketConnectionStatusEnum.NOT_INITIALIZED);
      return;
    }

    websocketConnection.instance = io(websocketUrl, {
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: RECONNECTION_ATTEMPTS,
      reconnectionDelay: RETRY_INTERVAL,
      timeout: TIMEOUT,
      path: '/ws/subscription'
    });

    websocketConnection.instance.onAny(handleMessageReceived);

    websocketConnection.instance.on(WebsocketEventsEnum.connect, () => {
      console.info('Updates Websocket connected.');
      updateSocketStatus(WebsocketConnectionStatusEnum.COMPLETED);

      const instance = websocketConnection.instance;

      if (!instance) {
        return;
      }

      // Transactions
      instance.emit(
        WebsocketSubcriptionsEnum.subscribeTransactions,
        config.transactions,
        (response: any) => {
          console.log(`Client ${config} subscribeTransactions =>`, response);
        }
      );

      // Blocks
      instance.emit(
        WebsocketSubcriptionsEnum.subscribeBlocks,
        config.blocks,
        (response: any) => {
          console.log(`Client ${config} subscribeBlocks =>`, response);
        }
      );

      // Pool
      instance.emit(
        WebsocketSubcriptionsEnum.subscribePool,
        config.pool,
        (response: any) => {
          console.log(`Client ${config} subscribePool =>`, response);
        }
      );

      // Stats
      if (config.stats) {
        instance.emit(
          WebsocketSubcriptionsEnum.subscribeStats,
          undefined,
          (response: any) => {
            console.log(`Client ${config} subscribeStats =>`, response);
          }
        );
      }

      // Events
      if (config.events) {
        instance.emit(
          WebsocketSubcriptionsEnum.subscribeEvent,
          config.events,
          (response: any) => {
            console.log(`Client ${config} subscribeEvents =>`, response);
          }
        );
      }
    });

    websocketConnection.instance.on(
      WebsocketEventsEnum.transactionUpdate,
      (txs) => {
        console.log(
          `Client ${config} transactions:`,
          txs.map((tx: any) => ({
            txHash: tx.txHash,
            function: tx.function
          }))
        );
      }
    );

    websocketConnection.instance.on(
      WebsocketEventsEnum.blocksUpdate,
      (blocks) => {
        console.log(
          `Client ${config} blocks:`,
          blocks.map((b: any) => ({
            hash: b.hash,
            proposer: b.proposer
          }))
        );
      }
    );

    websocketConnection.instance.on(WebsocketEventsEnum.poolUpdate, (pools) => {
      console.log(
        `Client ${config} pool:`,
        pools.map((p: any) => ({
          hash: p.hash,
          proposer: p.proposer
        }))
      );
    });

    websocketConnection.instance.on(
      WebsocketEventsEnum.statsUpdate,
      (stats) => {
        console.log(`Client ${config} stats:`, stats);
      }
    );

    websocketConnection.instance.on(
      WebsocketEventsEnum.eventsUpdate,
      (events) => {
        console.log(
          `Client ${config} events:`,
          events.map((e: any) => ({
            address: e.address,
            identifier: e.identifier,
            topics: e.topics
          }))
        );
      }
    );

    websocketConnection.instance.on(
      WebsocketEventsEnum.connect_error,
      (error) => {
        console.warn('Updates Websocket Connect Error: ', error.message);
      }
    );

    websocketConnection.instance.on(
      WebsocketEventsEnum.disconnect,
      (reason) => {
        console.info('Updates Websocket Disconnected: ', reason);
        updateSocketStatus(WebsocketConnectionStatusEnum.PENDING);
      }
    );
  };

  if (isWebsocketConnected) {
    await initializeConnection();
  }

  return {
    closeConnection
  };
}
