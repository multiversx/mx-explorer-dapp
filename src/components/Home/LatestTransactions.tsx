import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons/faArrowRight';
import { faCube } from '@fortawesome/pro-regular-svg-icons/faCube';
import { faCalendarAlt } from '@fortawesome/pro-regular-svg-icons/faCalendarAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import { addressIsBech32, urlBuilder, dateFormatted } from 'helpers';
import * as React from 'react';
import {
  ShardSpan,
  NetworkLink,
  TimeAgo,
  adapter,
  Trim,
  Loader,
  TransactionStatus,
  Denominate,
  CopyButton,
} from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import FailedTransactions from 'sharedComponents/TransactionsTable/FailedTransactions';
import NoTransactions from 'sharedComponents/TransactionsTable/NoTransactions';

const LatestTransactions = () => {
  const ref = React.useRef(null);
  const {
    activeNetworkId,
    refresh: { timestamp },
  } = useGlobalState();
  const [transactions, setTransactions] = React.useState<TransactionType[]>([]);
  const [transactionsFetched, setTransactionsFetched] = React.useState<boolean | undefined>();

  const { getLatestTransactions } = adapter();

  const fetchTransactions = () => {
    getLatestTransactions().then(({ data, success }) => {
      if (ref.current !== null) {
        if (success) {
          const sortedTransactions = data;
          if (transactions.length === 0) {
            const newTransactions = sortedTransactions.map((transaction: TransactionType) => ({
              ...transaction,
              isNew: false,
            }));
            setTransactions(newTransactions);
          } else {
            const existingHashes = transactions.map((b) => b.txHash);
            const newTransactions = sortedTransactions.map((transaction: TransactionType) => ({
              ...transaction,
              isNew: !existingHashes.includes(transaction.txHash),
            }));
            setTransactions(newTransactions);
          }
        }
        setTransactionsFetched(success);
      }
    });
  };

  const getTxType = (transaction: TransactionType) => {
    return 'Transaction Type';
  };

  React.useEffect(fetchTransactions, [activeNetworkId, timestamp]);

  const Component = () => {
    const someNew = transactions.some((transaction) => transaction.isNew);
    return (
      <div className="card" ref={ref}>
        {transactionsFetched === undefined && <Loader dataTestId="transactionsLoader" />}
        {transactionsFetched === false && <FailedTransactions />}
        {transactionsFetched === true && transactions.length === 0 && <NoTransactions />}
        {transactionsFetched === true && transactions.length > 0 && (
          <>
            <div className="card-header">
              <div className="card-header-item d-flex justify-content-between align-items-center">
                <h6 className="m-0">Transactions</h6>
                <NetworkLink to="/transactions" className="btn btn-primary-light">
                  View All Transactions
                </NetworkLink>
              </div>
            </div>
            <div className="card-body" data-testid="transactionsList">
              <div className="p-lg-2">
                <div className="transactions-card-container d-flex flex-column">
                  {transactions.map((transaction, i) => (
                    <div
                      key={transaction.txHash}
                      className={`transactions-card d-flex flex-row p-3 ${
                        transaction.isNew && someNew ? 'new' : ''
                      }`}
                    >
                      <div className="d-flex flex-column p-2 pr-4 border-right flex-shrink-0">
                        <div className="mb-1">{getTxType(transaction)}</div>
                        <div className="mb-1">
                          <span className="text-secondary">Status:</span>{' '}
                          <TransactionStatus status={transaction.status} onlyText />
                        </div>
                        <div>
                          <NetworkLink
                            to={urlBuilder.senderShard(transaction.senderShard)}
                            className="flex-shrink-0"
                          >
                            <ShardSpan shard={transaction.senderShard} />
                          </NetworkLink>

                          <FontAwesomeIcon
                            size="sm"
                            icon={faArrowRight}
                            className="mx-2 text-secondary"
                          />

                          <NetworkLink
                            to={urlBuilder.receiverShard(transaction.receiverShard)}
                            className="flex-shrink-0"
                          >
                            <ShardSpan shard={transaction.receiverShard} />
                          </NetworkLink>
                        </div>
                      </div>

                      <div className="d-flex flex-fill p-2 pr-4 border-right overflow-hidden">
                        <div className="middle-section">
                          <div className="row mb-1">
                            <div className="col col-left">
                              <span className="text-secondary">Amount:</span>
                            </div>
                            <div className="col">
                              <Denominate value={transaction.value} showLastNonZeroDecimal />
                            </div>
                          </div>

                          <div className="row mb-1">
                            <div className="col col-left">
                              <span className="text-secondary">From:</span>
                            </div>
                            <div className="col">
                              <div className="d-flex flex-row align-items-center">
                                {addressIsBech32(transaction.sender) ? (
                                  <NetworkLink
                                    to={urlBuilder.accountDetails(transaction.sender)}
                                    className="trim-wrapper"
                                  >
                                    <Trim text={transaction.sender} />
                                  </NetworkLink>
                                ) : (
                                  <ShardSpan shard={transaction.sender} />
                                )}
                                <FontAwesomeIcon
                                  size="sm"
                                  icon={faArrowRight}
                                  className="mx-2 text-secondary"
                                />
                                <span className="text-secondary mr-2">To:</span>{' '}
                                <NetworkLink
                                  to={urlBuilder.accountDetails(transaction.receiver)}
                                  data-testid={`transactionLinkTo${i}`}
                                  className="trim-wrapper"
                                >
                                  <Trim text={transaction.receiver} />
                                </NetworkLink>
                              </div>
                            </div>
                          </div>

                          <div className="row mb-1 ">
                            <div className="col col-left">
                              <span className="text-secondary">Tx Hash:</span>
                            </div>
                            <div className="col d-flex align-items-center">
                              <NetworkLink
                                to={`/transactions/${transaction.txHash}`}
                                data-testid={`transactionLink${i}`}
                                className="trim-wrapper"
                              >
                                <Trim text={transaction.txHash} />
                              </NetworkLink>
                              <CopyButton text={transaction.txHash} />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 pl-4 d-flex flex-column flex-shrink-0">
                        <div className="d-flex align-items-center justify-content-end mb-1">
                          <NetworkLink to={`/miniblocks/${transaction.miniBlockHash}`}>
                            #{transaction.round}
                          </NetworkLink>
                          <FontAwesomeIcon className="ml-2 text-secondary" icon={faCube} />
                        </div>
                        <div className="d-flex align-items-center justify-content-end mb-1">
                          <TimeAgo value={transaction.timestamp} short tooltip />
                          <FontAwesomeIcon className="ml-2 text-secondary" icon={faClock} />
                        </div>
                        <div>
                          {dateFormatted(transaction.timestamp, true)}
                          <FontAwesomeIcon className="ml-2 text-secondary" icon={faCalendarAlt} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };
  return React.useMemo(Component, [transactions, transactionsFetched]);
};
export default LatestTransactions;
