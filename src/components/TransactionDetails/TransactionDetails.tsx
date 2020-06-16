import { faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { addressIsBech32, dateFormatted } from 'helpers';
import * as React from 'react';
import {
  Denominate,
  ScAddressIcon,
  ShardSpan,
  TestnetLink,
  TimeAgo,
  TransactionStatus,
} from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';

const getFee = (transaction: TransactionType) => {
  const web3 = new Web3();
  const bNgasPrice = new BigNumber(transaction.gasPrice);
  const bNgasUsed = new BigNumber(transaction.gasUsed);
  const output = web3.utils.toBN(bNgasPrice.times(bNgasUsed) as any).toString(10);
  return output;
};

const Details = ({ transaction }: { transaction: TransactionType }) => {
  const errorMessage =
    transaction &&
    transaction.scResults !== null &&
    transaction.scResults !== undefined &&
    transaction.scResults[0].returnMessage
      ? transaction.scResults[0].returnMessage
      : '';

  return (
    <div className="card">
      <div className="card-body card-details">
        <div className="row">
          <div className="col-lg-2 card-label">Hash</div>
          <div className="col-lg-10">
            <ScAddressIcon initiator={transaction.sender} secondInitiator={transaction.receiver} />
            {transaction.hash}
          </div>
        </div>
        <hr className="hr-space" />
        <div className="row">
          <div className="col-lg-2 card-label">Status</div>
          <div className="col-lg-10">
            <TransactionStatus status={transaction.status} />
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
          <div className="col-lg-2 card-label">Miniblock</div>
          <div className="col-lg-10">
            <TestnetLink to={`/miniblocks/${transaction.miniBlockHash}`}>
              {transaction.miniBlockHash}
            </TestnetLink>
          </div>
        </div>
        <hr className="hr-space" />
        <div className="row">
          <div className="col-lg-2 card-label">From</div>
          <div className="col-lg-10">
            <ScAddressIcon initiator={transaction.sender} />
            {addressIsBech32(transaction.sender) ? (
              <>
                <TestnetLink to={`/address/${transaction.sender}`}>
                  {transaction.sender}
                </TestnetLink>
                <TestnetLink
                  to={`/transactions/shard-from/${transaction.senderShard}`}
                  className="small-link"
                >
                  &nbsp;(
                  <ShardSpan shardId={transaction.senderShard} />)
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
            <ScAddressIcon initiator={transaction.receiver} />
            <TestnetLink to={`/address/${transaction.receiver}`}>
              {transaction.receiver}
            </TestnetLink>
            &nbsp;
            {!isNaN(transaction.receiverShard) && (
              <TestnetLink
                to={`/transactions/shard-to/${transaction.receiverShard}`}
                className="small-link"
              >
                (<ShardSpan shardId={transaction.receiverShard} />)
              </TestnetLink>
            )}
            {errorMessage && (
              <>
                <br />
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger" size="xs" />
                <small className="text-danger"> {errorMessage}</small>
              </>
            )}
          </div>
        </div>
        <hr className="hr-space" />
        <div className="row">
          <div className="col-lg-2 card-label">Value</div>
          <div className="col-lg-10">
            <Denominate value={transaction.value} showLastNonZeroDecimal />
          </div>
        </div>
        <hr className="hr-space" />
        <div className="row">
          <div className="col-lg-2 card-label">Transaction Fee</div>
          <div className="col-lg-10">
            <Denominate value={getFee(transaction)} showLastNonZeroDecimal />
          </div>
        </div>
        <hr className="hr-space" />
        <div className="row">
          <div className="col-lg-2 card-label">Gas Limit</div>
          <div className="col-lg-10">{transaction.gasLimit.toLocaleString('en')}</div>
        </div>
        <hr className="hr-space" />
        <div className="row">
          <div className="col-lg-2 card-label">Gas Used</div>
          <div className="col-lg-10">{transaction.gasUsed.toLocaleString('en')}</div>
        </div>
        <hr className="hr-space" />
        <div className="row">
          <div className="col-lg-2 card-label">Gas Price</div>
          <div className="col-lg-10">
            <Denominate value={transaction.gasPrice.toString()} showLastNonZeroDecimal />
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
  );
};

export default Details;
