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
  NetworkLink,
  TimeAgo,
  TransactionStatus,
  DetailItem,
  Trim,
  CopyButton,
} from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import ScResultsList from './ScResultsList';

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
    <div className="card">
      <div className="card-body p-0">
        <div className="container-fluid">
          <DetailItem title="Hash">
            <div className="d-flex align-items-center text-break-all">
              <ScAddressIcon
                initiator={transaction.sender}
                secondInitiator={transaction.receiver}
              />
              {transaction.txHash}
              <CopyButton text={transaction.txHash} />
            </div>
          </DetailItem>

          <DetailItem title="Status">
            <TransactionStatus status={transaction.status} />
          </DetailItem>

          <DetailItem title="Age">
            {transaction.timestamp !== undefined ? (
              <>
                <FontAwesomeIcon icon={faClock} className="mr-2 text-muted" />
                <TimeAgo value={transaction.timestamp} />
                &nbsp;
                <span className="text-secondary">({dateFormatted(transaction.timestamp)})</span>
              </>
            ) : (
              <span className="text-muted">N/A</span>
            )}
          </DetailItem>

          <DetailItem title="Miniblock">
            <div className="d-flex align-items-center">
              {transaction.miniBlockHash ? (
                <NetworkLink
                  to={`/miniblocks/${transaction.miniBlockHash}`}
                  className="trim-wrapper"
                >
                  <Trim text={transaction.miniBlockHash} />
                </NetworkLink>
              ) : (
                <span className="text-muted">N/A</span>
              )}
            </div>
          </DetailItem>

          <DetailItem title="From">
            <div className="d-flex align-items-center">
              <ScAddressIcon initiator={transaction.sender} />
              {addressIsBech32(transaction.sender) ? (
                <>
                  <NetworkLink to={`/address/${transaction.sender}`} className="trim-wrapper">
                    <Trim text={transaction.sender} />
                  </NetworkLink>
                  <NetworkLink
                    to={urlBuilder.senderShard(transaction.senderShard)}
                    className="flex-shrink-0"
                  >
                    &nbsp;(
                    <ShardSpan shardId={transaction.senderShard} />)
                  </NetworkLink>
                </>
              ) : (
                <ShardSpan shardId={transaction.sender} />
              )}
            </div>
          </DetailItem>

          <DetailItem title="To">
            <div className="d-flex align-items-center">
              <ScAddressIcon initiator={transaction.receiver} />
              <NetworkLink to={`/address/${transaction.receiver}`} className="trim-wrapper">
                <Trim text={transaction.receiver} />
              </NetworkLink>
              &nbsp;
              {!isNaN(transaction.receiverShard) && (
                <NetworkLink
                  to={urlBuilder.receiverShard(transaction.receiverShard)}
                  className="flex-shrink-0"
                >
                  (<ShardSpan shardId={transaction.receiverShard} />)
                </NetworkLink>
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
          {transaction.scResults && transaction.scResults?.length > 0 && (
            <DetailItem title="Smart&nbsp;Contract Results">
              <ScResultsList scResults={transaction.scResults} />
            </DetailItem>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;
