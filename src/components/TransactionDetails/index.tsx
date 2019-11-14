import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  faExchangeAlt,
  faHourglass,
  faCheckCircle,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ScAddressIcon,
  Denominate,
  TimeAgo,
  TestnetLink,
  ShardSpan,
  Loader,
} from './../../sharedComponents';
import { getTransaction } from './helpers/asyncRequests';
import { useGlobalState } from '../../context';
import { TransactionType } from '../Transactions';
import { dateFormatted, addressIsHash, truncate } from './../../helpers';

const TransactionDetails: React.FC = () => {
  let { hash: transactionId } = useParams();
  let ref = React.useRef(null);

  const {
    activeTestnet: { elasticUrl },
    timeout,
  } = useGlobalState();

  const [transaction, setTransaction] = React.useState<TransactionType | undefined>(undefined);
  const [transactionFetched, setTransactionFetched] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (transactionId && ref.current !== null) {
      getTransaction({ elasticUrl, transactionId, timeout }).then(
        ({ data, transactionFetched }) => {
          if (transactionFetched) {
            setTransaction(data);
            setTransactionFetched(true);
          } else {
            setTransactionFetched(false);
          }
        }
      );
    }
  }, [elasticUrl, transactionId, timeout]); // run the operation only once since the parameter does not change
  return (
    <div ref={ref}>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4>Transaction Details</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {!transactionFetched ? (
              <div className="card">
                <div className="card-body card-details">
                  <div className="empty">
                    <FontAwesomeIcon icon={faExchangeAlt} className="empty-icon" />
                    <span className="h4 empty-heading">Unable to locate this transaction hash</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {transaction ? (
                  <div className="card">
                    <div className="card-body card-details">
                      <div className="row">
                        <div className="col-lg-2 card-label">Transaction Hash</div>
                        <div className="col-lg-10">{transaction.hash}</div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Status</div>
                        <div className="col-lg-10">
                          {transaction.status === 'Success' ? (
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                          ) : (
                            <FontAwesomeIcon icon={faHourglass} className="mr-2" />
                          )}
                          {transaction.status}
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Timestamp</div>
                        <div className="col-lg-10">
                          <FontAwesomeIcon icon={faClock} className="mr-2" />
                          <TimeAgo value={transaction.timestamp} />
                          &nbsp;({dateFormatted(transaction.timestamp)})
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Block</div>
                        <div className="col-lg-10">{transaction.blockHash}</div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">From</div>
                        <div className="col-lg-10">
                          <ScAddressIcon value={transaction.sender} />
                          {addressIsHash(transaction.sender) ? (
                            <>
                              <TestnetLink to={`/address/${transaction.sender}`}>
                                {truncate(transaction.sender, 20)}
                              </TestnetLink>
                              <TestnetLink
                                to={`/transactions/shard-from/${transaction.senderShard}`}
                                className="small-link"
                              >
                                (<ShardSpan shardId={transaction.sender} />)
                              </TestnetLink>
                            </>
                          ) : (
                            <ShardSpan shardId={transaction.sender} />
                          )}
                          &nbsp;
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">To</div>
                        <div className="col-lg-10">
                          <ScAddressIcon value={transaction.receiver} />
                          <Link to={`/address/${transaction.receiver}`}>
                            {transaction.receiver}
                          </Link>
                          &nbsp;
                          {Boolean(transaction.receiverShard) && (
                            <Link
                              to={`shard-to/${transaction.receiverShard}`}
                              className="small-link"
                            >
                              (Shard {transaction.receiverShard})
                            </Link>
                          )}
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Value</div>
                        <div className="col-lg-10">
                          <Denominate value={transaction.value} showAllDecimals />
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Transaction Fee</div>
                        <div className="col-lg-10">
                          {transaction.gasPrice * transaction.gasLimit}
                        </div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Nonce</div>
                        <div className="col-lg-10">{transaction.nonce}</div>
                      </div>
                      <hr className="hr-space" />
                      <div className="row">
                        <div className="col-lg-2 card-label">Input Data</div>
                        <div className="col-lg-10">
                          <textarea
                            readOnly
                            className="form-control col-lg-12 cursor-text"
                            rows={2}
                            defaultValue={transaction.data}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Loader />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
