import { formatTimestamp } from 'helpers/formatValue';
import { AccountAssetType, TransactionType } from 'types';

interface GetAccountTopNeighborsProps {
  transactions: TransactionType[];
  target: string;
  results?: number;
  range?: '30' | '90' | '365' | 'all';
}

export interface NeighborType {
  address: string;
  sent: number;
  received: number;
  total: number;
  assets?: AccountAssetType;
}

export const getAccountTopNeighbors = ({
  transactions,
  target,
  results = 10,
  range = 'all'
}: GetAccountTopNeighborsProps) => {
  const nowMs = Date.now();
  const rangeMs = range === 'all' ? 0 : Number(range) * 24 * 60 * 60 * 1000;

  const neighbours = {} as Record<string, NeighborType>;

  for (const tx of transactions) {
    if (range !== 'all' && nowMs - formatTimestamp(tx.timestamp) > rangeMs) {
      continue;
    }

    if (tx.sender === target) {
      const addr = tx.receiver;

      if (!neighbours[addr]) {
        neighbours[addr] = {
          address: addr,
          sent: 0,
          received: 0,
          total: 0,
          assets: tx?.receiverAssets
        };
      }

      neighbours[addr].sent += 1;
      neighbours[addr].total += 1;
    } else if (tx.receiver === target) {
      const addr = tx.sender;

      if (!neighbours[addr]) {
        neighbours[addr] = {
          address: addr,
          sent: 0,
          received: 0,
          total: 0,
          assets: tx?.senderAssets
        };
      }

      neighbours[addr].received += 1;
      neighbours[addr].total += 1;
    }
  }

  return Object.values(neighbours)
    .sort((a, b) => b.total - a.total)
    .filter((neighbor) => neighbor.address !== target)
    .slice(0, results);
};
