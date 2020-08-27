import { useGlobalState } from 'context';
import elastic from './elastic';
import api from './api';

const providers = {
  api,
  elastic,
};

export default function useAdapter() {
  const {
    activeTestnet: { elasticUrl, adapter },
    timeout,
  } = useGlobalState();

  const provider = providers[adapter];

  return {
    getLatestBlocks: async () => {
      try {
        const params = {
          size: 25,
        };

        const { data } = await provider({
          elasticUrl,
          url: `/blocks`,
          params,
          timeout,
        });

        const blocks = data.map((block: any) => ({ hash: block.id, ...block }));

        return {
          data: blocks,
          blocksFetched: data.length > 0,
        };
      } catch {
        return {
          data: [],
          blocksFetched: false,
        };
      }
    },
    getLatestTransactions: async () => {
      try {
        const params = {
          size: 20,
        };

        const { data } = await provider({
          elasticUrl,
          url: `/transactions`,
          params,
          timeout,
        });

        const transactions = data.map((transaction: any) => ({
          hash: transaction.id,
          ...transaction,
        }));

        return {
          data: transactions,
          transactionsFetched: data.length > 0,
        };
      } catch (e) {
        return {
          data: [],
          transactionsFetched: false,
        };
      }
    },
  };
}
