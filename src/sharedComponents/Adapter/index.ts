import { useGlobalState } from 'context';
import elastic from './elastic';
import api from './api';
import {
  getLatestBlocks,
  getLatestTransactions,
  getBlocks,
  GetBlocksType,
  getBlocksCount,
  getTransaction,
  getPendingTransaction,
} from './functions';

const providers = {
  api,
  elastic,
};

// TODO: daca pun ruta de elastic default

export default function useAdapter() {
  const {
    activeTestnet: { elasticUrl, adapter, nodeUrl },
    timeout,
  } = useGlobalState();

  const provider = providers[adapter];

  return {
    getLatestBlocks: () => getLatestBlocks({ provider, elasticUrl, timeout }),
    getLatestTransactions: () => getLatestTransactions({ provider, elasticUrl, timeout }),
    getBlocks: ({ size, shardId, epochId }: GetBlocksType) =>
      getBlocks({ provider, elasticUrl, size, shardId, epochId, timeout }),
    getBlocksCount: ({ size, shardId, epochId }: GetBlocksType) =>
      getBlocksCount({ provider, elasticUrl, size, shardId, epochId, timeout }),
    getTransaction: ({ transactionId }: { transactionId: string }) =>
      getTransaction({ provider, elasticUrl, transactionId, timeout }),
    getPendingTransaction: ({ transactionId }: { transactionId: string }) =>
      getPendingTransaction({ nodeUrl, transactionId, timeout }),
  };
}
