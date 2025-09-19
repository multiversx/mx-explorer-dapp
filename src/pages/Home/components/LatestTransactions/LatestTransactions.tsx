import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  ShardSpan,
  NetworkLink,
  TimeAgo,
  Trim,
  Loader,
  LatestItem,
  PulsatingLed,
  TransactionIcons,
  TransactionStatusIcon,
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
import { useAdapter, useFetchTransactions, useIsSovereign } from 'hooks';
import { refreshSelector } from 'redux/selectors';
import { WebsocketEventsEnum, WebsocketSubcriptionsEnum } from 'types';

export const LatestTransactions = () => {
  const isSovereign = useIsSovereign();
  const { timestamp } = useSelector(refreshSelector);

  const { getTransactions } = useAdapter();

  const { fetchTransactions, transactions, isDataReady } = useFetchTransactions(
    {
      dataPromise: getTransactions,
      filters: { ...(isSovereign ? { withCrossChainTransfers: true } : {}) },
      subscription: WebsocketSubcriptionsEnum.subscribeTransactions,
      event: WebsocketEventsEnum.transactionUpdate
    }
  );

  useEffect(fetchTransactions, [timestamp]);

  const Component = () => {
    return (
      <div className='card card-lg card-black latest-transactions'>
        {isDataReady === undefined && (
          <Loader data-testid='transactionsLoader' />
        )}
        {isDataReady === false && <FailedTransactions />}
        {isDataReady === true && transactions.length === 0 && (
          <NoTransactions />
        )}
        {isDataReady === true && transactions.length > 0 && (
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
                        <TransactionStatusIcon
                          transaction={transaction}
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
                              <TransactionIcons
                                transaction={transaction}
                                showStatus={false}
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
  return React.useMemo(Component, [transactions]);
};
