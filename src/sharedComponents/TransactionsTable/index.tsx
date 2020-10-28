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
    <div className="transactions-table">
      <div className="card card-small d-flex">
        <div className="card-header border-0 p-0">
          {/* {true && ( */}
          {totalTransactions > 10000 && (
            <div className="card-header-item border-bottom p-3">
              Showing last 10,000 of {totalTransactions.toLocaleString('en')} transactions
            </div>
          )}
          {false && <div className="card-header-item border-bottom p-3">extra content</div>}
        </div>

        <div className="card-body p-0">
          <div className="table-wrapper">
            <table className="table m-0" data-testid="transactionsTable">
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
        </div>

        <div className="card-footer bg-light py-1">
          <Pager
            slug={slug}
            total={
              !isNaN(parseInt(totalTransactions.toString()))
                ? Math.min(parseInt(totalTransactions.toString()), 10000)
                : totalTransactions
            }
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
    </div>
  );
};

export default TransactionsTable;
