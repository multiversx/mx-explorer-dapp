import * as React from 'react';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { addressIsBech32, dateFormatted, urlBuilder } from 'helpers';
import {
  Denominate,
  ScAddressIcon,
  ShardSpan,
  TestnetLink,
  TimeAgo,
  TransactionStatus,
  DetailItem,
  Trim,
} from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';

const getFee = (transaction: TransactionType) => {
  const bNgasPrice = new BigNumber(transaction.gasPrice);
  const bNgasUsed = new BigNumber(transaction.gasUsed);
  const output = bNgasPrice.times(bNgasUsed).toString();
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
    <div className="card card-small">
      <div className="card-body p-0">
        <div className="container-fluid">
          <DetailItem title="Hash">
            <div className="d-flex align-items-center text-break-all">
              <ScAddressIcon
                initiator={transaction.sender}
                secondInitiator={transaction.receiver}
              />
              {transaction.txHash}
            </div>
          </DetailItem>

          <DetailItem title="Status">
            <TransactionStatus status={transaction.status} />
          </DetailItem>

          <DetailItem title="Timestamp">
            {transaction.timestamp !== undefined ? (
              <>
                <FontAwesomeIcon icon={faClock} className="mr-2 text-muted" />
                <TimeAgo value={transaction.timestamp} />
                &nbsp;({dateFormatted(transaction.timestamp)})
              </>
            ) : (
              <span className="text-muted">N/A</span>
            )}
          </DetailItem>

          <DetailItem title="Miniblock">
            {transaction.miniBlockHash ? (
              <TestnetLink to={`/miniblocks/${transaction.miniBlockHash}`} className="trim-wrapper">
                <Trim text={transaction.miniBlockHash} />
              </TestnetLink>
            ) : (
              <span className="text-muted">N/A</span>
            )}
          </DetailItem>

          <DetailItem title="From">
            <div className="d-flex align-items-center">
              <ScAddressIcon initiator={transaction.sender} />
              {addressIsBech32(transaction.sender) ? (
                <>
                  <TestnetLink to={`/address/${transaction.sender}`} className="trim-wrapper">
                    <Trim text={transaction.sender} />
                  </TestnetLink>
                  <TestnetLink
                    to={urlBuilder.senderShard(transaction.senderShard)}
                    className="flex-shrink-0"
                  >
                    &nbsp;(
                    <ShardSpan shardId={transaction.senderShard} />)
                  </TestnetLink>
                </>
              ) : (
                <ShardSpan shardId={transaction.sender} />
              )}
            </div>
          </DetailItem>

          <DetailItem title="To">
            <div className="d-flex align-items-center">
              <ScAddressIcon initiator={transaction.receiver} />
              <TestnetLink to={`/address/${transaction.receiver}`} className="trim-wrapper">
                <Trim text={transaction.receiver} />
              </TestnetLink>
              &nbsp;
              {!isNaN(transaction.receiverShard) && (
                <TestnetLink
                  to={urlBuilder.receiverShard(transaction.receiverShard)}
                  className="flex-shrink-0"
                >
                  (<ShardSpan shardId={transaction.receiverShard} />)
                </TestnetLink>
              )}
            </div>
            {errorMessage && (
              <div>
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger" size="xs" />
                <small className="text-danger"> {errorMessage}</small>
              </div>
            )}
          </DetailItem>

          <DetailItem title="Value">
            <Denominate value={transaction.value} showLastNonZeroDecimal />
          </DetailItem>

          <DetailItem title="Transaction Fee">
            {transaction.gasUsed !== undefined ? (
              <Denominate value={getFee(transaction)} showLastNonZeroDecimal />
            ) : (
              <span className="text-muted">N/A</span>
            )}
          </DetailItem>

          <DetailItem title="Gas Limit">{transaction.gasLimit.toLocaleString('en')}</DetailItem>

          <DetailItem title="Gas Used">
            {transaction.gasUsed ? (
              <>{transaction.gasUsed.toLocaleString('en')}</>
            ) : (
              <span className="text-muted">N/A</span>
            )}
          </DetailItem>

          <DetailItem title="Gas Price">
            <Denominate value={transaction.gasPrice.toString()} showLastNonZeroDecimal />
          </DetailItem>

          <DetailItem title="Nonce">{transaction.nonce}</DetailItem>

          <DetailItem title="Input Data">
            <textarea
              readOnly
              className="form-control col cursor-text mt-1"
              rows={2}
              defaultValue={
                transaction.data
                  ? Buffer.from(transaction.data, 'base64').toString()
                  : transaction.data
              }
            />
          </DetailItem>
        </div>
      </div>
    </div>
  );
};

export default Details;
