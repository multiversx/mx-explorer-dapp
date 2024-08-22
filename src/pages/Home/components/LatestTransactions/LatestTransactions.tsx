import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  ShardSpan,
  NetworkLink,
  TimeAgo,
  Trim,
  Loader,
  LatestItem,
  PulsatingLed,
  TransactionIcon,
  TransactionGuardianIcon,
  TransactionSovereignBridgeIcon,
  AccountLink,
  ShardLink
} from 'components';
import { FailedTransactions } from 'components/TransactionsTable/components/FailedTransactions';
import { NoTransactions } from 'components/TransactionsTable/components/NoTransactions';
import { TransactionValue } from 'components/TransactionsTable/components/TransactionValue';
import {
  addressIsBech32,
  getDisplayReceiver,
  getTransactionStatusIconAndColor
} from 'helpers';
import { useAdapter } from 'hooks';
import { refreshSelector } from 'redux/selectors';
import { UITransactionType } from 'types';

export const LatestTransactions = () => {
  const ref = useRef(null);
  const { timestamp } = useSelector(refreshSelector);

  const [transactions, setTransactions] = useState<UITransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = useState<
    boolean | undefined
  >();
  const { getLatestTransactions } = useAdapter();
  const size = 5;

  const fetchTransactions = () => {
    getLatestTransactions({ size, withUsername: true }).then(
      ({ data, success }) => {
        if (ref.current !== null) {
          if (success) {
            const existingHashes = transactions.map((b) => b.txHash);

            // keep previous transactions, reset isNew and update status
            const oldTransactions: UITransactionType[] = [
              ...transactions.slice(0, size)
            ];
            oldTransactions.forEach((oldTx) => {
              oldTx.isNew = false;

              if (oldTx.status === 'pending') {
                const newStatusTx = (data as UITransactionType[]).find(
                  (newStatusTx) => newStatusTx.txHash === oldTx.txHash
                );
                oldTx.status = newStatusTx ? newStatusTx.status : oldTx.status;
              }
            });

            let newTransactions: UITransactionType[] = [];
            data.forEach((transaction: UITransactionType) => {
              const isNew = !existingHashes.includes(transaction.txHash);
              if (isNew) {
                newTransactions.push({
                  ...transaction,
                  isNew
                });
              }
            });

            newTransactions = [...newTransactions, ...oldTransactions];

            const allNew =
              newTransactions.filter((a) => a.isNew === true).length ===
              newTransactions.length;

            if (allNew) {
              newTransactions.forEach(
                (transaction) => (transaction.isNew = false)
              );
            }

            setTransactions(newTransactions);
          }
          setTransactionsFetched(success);
        }
      }
    );
  };

  useEffect(fetchTransactions, [timestamp]);

  const Component = () => {
    return (
      <div className='card card-lg card-black latest-transactions' ref={ref}>
        {transactionsFetched === undefined && (
          <Loader data-testid='transactionsLoader' />
        )}
        {transactionsFetched === false && <FailedTransactions />}
        {transactionsFetched === true && transactions.length === 0 && (
          <NoTransactions />
        )}
        {transactionsFetched === true && transactions.length > 0 && (
          <>
            <div className='card-header'>
              <div className='d-flex justify-content-between align-items-center flex-wrap'>
                <div className='h5 mb-0 d-flex align-items-center'>
                  Recent Transactions
                  <PulsatingLed className='ms-2 mt-1' />
                </div>
                <NetworkLink to='/transactions' className='btn btn-sm btn-dark'>
                  View All
                </NetworkLink>
              </div>
            </div>
            <div className='card-body' data-testid='transactionsList'>
              <div className='latest-items-container'>
                {transactions.map((transaction, i) => {
                  const { receiver, receiverAssets } =
                    getDisplayReceiver(transaction);

                  return (
                    <LatestItem
                      totalItems={transactions.length}
                      key={transaction.txHash}
                      isNew={transaction.isNew}
                      index={i + 1}
                    >
                      <div
                        className={`latest-item-card p-4 status-${
                          getTransactionStatusIconAndColor({ transaction })
                            .color
                        }`}
                      >
                        <TransactionIcon
                          transaction={transaction}
                          showGuardian={false}
                          showSovereignBridge={false}
                          showSuccess
                          withBadge
                        />

                        <div className='d-flex flex-column overflow-hidden min-w-0'>
                          <div className='d-flex flex-row mb-2 align-items-center justify-content-between'>
                            <div className='d-flex align-items-center me-2'>
                              <div className='transaction-value'>
                                <TransactionValue
                                  transaction={transaction}
                                  hideMultipleBadge
                                />
                              </div>
                            </div>

                            <div className='text-neutral-400 flex-shrink-0'>
                              <TimeAgo value={transaction.timestamp} short />{' '}
                              ago
                            </div>
                          </div>

                          <div className='mb-2'>
                            <div className='d-flex flex-row align-items-center text-neutral-400'>
                              <span className='me-2'>To:</span>
                              <AccountLink
                                address={receiver}
                                assets={receiverAssets}
                                data-testid={`transactionLinkTo${i}`}
                              />
                              <span className='px-2 text-muted ms-auto'>•</span>
                              <ShardLink
                                shard={transaction.receiverShard}
                                transactionReceiverShard
                                className='flex-shrink-0'
                              />
                            </div>
                          </div>

                          <div className='mb-2'>
                            <div className='d-flex flex-row align-items-center text-neutral-400'>
                              <span className='me-2'>From:</span>
                              {addressIsBech32(transaction.sender) ? (
                                <>
                                  <AccountLink
                                    address={transaction.sender}
                                    assets={transaction.senderAssets}
                                    data-testid={`transactionLinkTo${i}`}
                                  />
                                  <span className='px-2 text-muted ms-auto'>
                                    •
                                  </span>
                                  <ShardLink
                                    shard={transaction.senderShard}
                                    transactionSenderShard
                                    className='flex-shrink-0'
                                  />
                                </>
                              ) : (
                                <ShardSpan shard={transaction.sender} />
                              )}
                            </div>
                          </div>

                          <div>
                            <div className='d-flex align-items-center'>
                              <span className='text-neutral-400 me-2'>
                                Hash:
                              </span>

                              <TransactionGuardianIcon
                                transaction={transaction}
                              />
                              <TransactionSovereignBridgeIcon
                                transaction={transaction}
                              />

                              <NetworkLink
                                to={`/transactions/${transaction.txHash}`}
                                data-testid={`transactionLink${i}`}
                                className='trim-wrapper'
                              >
                                <Trim text={transaction.txHash} />
                              </NetworkLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </LatestItem>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
  return React.useMemo(Component, [transactions, transactionsFetched]);
};
