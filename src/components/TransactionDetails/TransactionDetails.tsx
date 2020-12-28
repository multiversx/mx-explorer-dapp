import * as React from 'react';
import { faClock } from '@fortawesome/pro-regular-svg-icons/faClock';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons/faAngleDown';
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
import ScResultsList, { ScResultType } from './ScResultsList';

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
  scResults?: ScResultType[];
}

const getFee = (transaction: TransactionType) => {
  const bNgasPrice = new BigNumber(transaction.gasPrice);
  const bNgasUsed = new BigNumber(transaction.gasUsed);
  const output = bNgasPrice.times(bNgasUsed).toString();
  return output;
};

const getScResultsMessages = (transaction: TransactionType) => {
  const messages: string[] = [];

  if (transaction.scResults) {
    transaction.scResults.forEach((result) => {
      if (result.returnMessage) {
        messages.push(result.returnMessage);
      }
    });
  }

  return messages;
};

const Details = ({ transaction }: { transaction: TransactionType }) => {
  const scResultsMessages = getScResultsMessages(transaction);

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
                <FontAwesomeIcon icon={faClock} className="mr-2 text-secondary" />
                <TimeAgo value={transaction.timestamp} />
                &nbsp;
                <span className="text-secondary">({dateFormatted(transaction.timestamp)})</span>
              </>
            ) : (
              <span className="text-secondary">N/A</span>
            )}
          </DetailItem>

          <DetailItem title="Miniblock">
            <div className="d-flex align-items-center">
              {transaction.miniBlockHash ? (
                <>
                  <NetworkLink
                    to={`/miniblocks/${transaction.miniBlockHash}`}
                    className="trim-wrapper"
                  >
                    <Trim text={transaction.miniBlockHash} />
                  </NetworkLink>
                  <CopyButton text={transaction.miniBlockHash} />
                </>
              ) : (
                <span className="text-secondary">N/A</span>
              )}
            </div>
          </DetailItem>

          <DetailItem title="From">
            <div className="d-flex align-items-center">
              <ScAddressIcon initiator={transaction.sender} />
              {addressIsBech32(transaction.sender) ? (
                <>
                  <NetworkLink
                    to={urlBuilder.accountDetails(transaction.sender)}
                    className="trim-wrapper"
                  >
                    <Trim text={transaction.sender} />
                  </NetworkLink>
                  &nbsp;
                  <NetworkLink
                    to={urlBuilder.senderShard(transaction.senderShard)}
                    className="flex-shrink-0"
                  >
                    (<ShardSpan shard={transaction.senderShard} />)
                  </NetworkLink>
                  <CopyButton text={transaction.sender} />
                </>
              ) : (
                <ShardSpan shard={transaction.sender} />
              )}
            </div>
          </DetailItem>

          <DetailItem title="To">
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center">
                <ScAddressIcon initiator={transaction.receiver} />
                <NetworkLink
                  to={urlBuilder.accountDetails(transaction.receiver)}
                  className="trim-wrapper"
                >
                  <Trim text={transaction.receiver} />
                </NetworkLink>
                &nbsp;
                {!isNaN(transaction.receiverShard) && (
                  <NetworkLink
                    to={urlBuilder.receiverShard(transaction.receiverShard)}
                    className="flex-shrink-0"
                  >
                    (<ShardSpan shard={transaction.receiverShard} />)
                  </NetworkLink>
                )}
                <CopyButton text={transaction.receiver} />
              </div>
              {scResultsMessages.map((msg, i) => (
                <div key={i} className="d-flex ml-1 text-break-all">
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="text-secondary"
                    style={{ marginTop: '2px' }}
                    transform={{ rotate: 45 }}
                  />
                  &nbsp;
                  <small className="text-danger ml-1"> {msg}</small>
                </div>
              ))}
            </div>
          </DetailItem>

          <DetailItem title="Value">
            <Denominate value={transaction.value} showLastNonZeroDecimal />
          </DetailItem>

          <DetailItem title="Transaction Fee">
            {transaction.gasUsed !== undefined ? (
              <Denominate value={getFee(transaction)} showLastNonZeroDecimal />
            ) : (
              <span className="text-secondary">N/A</span>
            )}
          </DetailItem>

          <DetailItem title="Gas Limit">{transaction.gasLimit.toLocaleString('en')}</DetailItem>

          <DetailItem title="Gas Used">
            {transaction.gasUsed ? (
              <>{transaction.gasUsed.toLocaleString('en')}</>
            ) : (
              <span className="text-secondary">N/A</span>
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
                transaction.data ? Buffer.from(transaction.data, 'base64').toString() : 'N/A'
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
