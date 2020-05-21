import TransactionRow from './TransactionRow';
import Pager from '../Pager';
import * as React from 'react';

export interface TransactionType {
  blockHash: string;
  data: string;
  gasLimit: number;
  gasPrice: number;
  gasUsed: number;
  hash: string;
  miniBlockHash: string;
  nonce: number;
  receiver: string;
  receiverShard: number;
  round: number;
  sender: string;
  senderShard: number;
  signature: string;
  status: string;
  timestamp: number;
  value: string;
}

interface TransactionsTableType {
  transactions: TransactionType[];
  addressId: string | undefined;
  totalTransactions: number | string;
  slug: string;
  size: number;
}

const TransactionsTable = ({
  transactions,
  addressId,
  totalTransactions,
  slug,
  size,
}: TransactionsTableType) => {
  return (
    <div className="card" style={{ height: 'auto' }}>
      <div className="card-body card-list">
        <div className="table-responsive">
          <table className="table mt-4" data-testid="transactionsTable">
            <thead>
              <tr>
                <th scope="col">Txn Hash</th>
                <th scope="col">Age</th>
                <th scope="col">Shard</th>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th scope="col" className="text-right">
                  Value
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <TransactionRow
                  transaction={transaction}
                  key={transaction.hash}
                  addressId={addressId}
                />
              ))}
            </tbody>
          </table>
        </div>

        <Pager
          slug={slug}
          total={totalTransactions}
          start={(size - 1) * 50 + (size === 1 ? 1 : 0)}
          end={
            (size - 1) * 50 +
            (parseInt(totalTransactions.toString()) < 50
              ? parseInt(totalTransactions.toString())
              : 50)
          }
          show={transactions.length > 0}
        />
      </div>
    </div>
  );
};

export default TransactionsTable;
