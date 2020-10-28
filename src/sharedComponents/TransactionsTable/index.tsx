import TransactionRow from './TransactionRow';
import Pager from '../Pager';
import * as React from 'react';

export interface TransactionType {
  blockHash: string;
  data: string;
  gasLimit: number;
  gasPrice: number;
  gasUsed: number;
  txHash: string;
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
  scResults?: {
    returnMessage: string;
  }[];
}

interface TransactionsTableType {
  transactions: TransactionType[];
  addressId?: string;
  totalTransactions: number | '...';
  size: number;
}

const TransactionsTable = ({
  transactions,
  addressId,
  totalTransactions,
  size,
}: TransactionsTableType) => {
  return (
    <div className="card" style={{ height: 'auto' }}>
      <div className="card-body card-list">
        {totalTransactions > 10000 && (
          <p className="mb-0">
            Showing last 10,000 of {totalTransactions.toLocaleString('en')} transactions
          </p>
        )}

        <div className="table-responsive">
          <table className="table mt-3" data-testid="transactionsTable">
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
              {transactions.map((transaction) => (
                <TransactionRow
                  transaction={transaction}
                  key={transaction.txHash}
                  addressId={addressId}
                />
              ))}
            </tbody>
          </table>
        </div>

        <Pager
          itemsPerPage={50}
          page={String(size)}
          total={
            totalTransactions !== '...' ? Math.min(totalTransactions, 10000) : totalTransactions
          }
          show={transactions.length > 0}
        />
      </div>
    </div>
  );
};

export default TransactionsTable;
