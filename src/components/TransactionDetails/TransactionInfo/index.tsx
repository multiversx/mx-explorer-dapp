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
  adapter,
} from 'sharedComponents';
import { getStatusIconAndColor } from 'sharedComponents/TransactionStatus';
import ScResultsList, { ScResultType } from '../ScResultsList';
import denominate from 'sharedComponents/Denominate/denominate';
import { denomination, decimals } from 'appConfig';

export interface TransactionType {
  fee?: string;
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

const TransactionInfo = ({ transaction }: { transaction: TransactionType }) => {
  const { getEgldClosingPrice } = adapter();
  const ref = React.useRef(null);
  const [closingPrice, setClosingPrice] = React.useState();
  const [transactionValuePrice, setTransactionValuePrice] = React.useState<string>('...');
  const [transactionFeePrice, setTransactionFeePrice] = React.useState<string>('...');

  const formattedUsdValue = (bNvalue: BigNumber, usd: string, digits: number) => {
    const amount = denominate({
      input: bNvalue.toString(),
      denomination,
      decimals,
      showLastNonZeroDecimal: true,
      addCommas: false,
    });
    const sum = (parseFloat(amount) * Number(usd)).toFixed(digits);
    const formattedValue = parseFloat(sum).toLocaleString('en', {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    });
    return ` ${bNvalue.isGreaterThan(new BigNumber(0)) ? '≈' : '='} $${formattedValue}`;
  };

  const fetchClosingPrice = () => {
    const { timestamp } = transaction;
    if (timestamp) {
      getEgldClosingPrice({ timestamp }).then(({ data, success }) => {
        if (ref.current !== null && data && success) {
          const bNvalue = new BigNumber(transaction.value);
          if (transaction.fee) {
            const bNfee = new BigNumber(transaction.fee ? transaction.fee : getFee(transaction));
            setTransactionFeePrice(formattedUsdValue(bNfee, data, 4));
          }
          setTransactionValuePrice(formattedUsdValue(bNvalue, data, 2));
          setClosingPrice(data);
        }
      });
    }
  };

  const scResultsMessages = getScResultsMessages(transaction);

  React.useEffect(fetchClosingPrice, [transaction]);

  return (
    <div className="transaction-info card" ref={ref}>
      <div className={`card-header status-${getStatusIconAndColor(transaction.status).color}`}>
        <div className="card-header-item d-flex align-items-center">
          <h6 data-testid="title">Transaction Details</h6>
        </div>
      </div>

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
              <div className="d-flex align-items-center">
                <FontAwesomeIcon icon={faClock} className="mr-2 text-secondary" />
                <TimeAgo value={transaction.timestamp} />
                &nbsp;
                <span className="text-secondary">({dateFormatted(transaction.timestamp)})</span>
              </div>
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
                  <CopyButton className="mr-2" text={transaction.sender} />
                  <NetworkLink
                    to={urlBuilder.senderShard(transaction.senderShard)}
                    className="flex-shrink-0"
                  >
                    (<ShardSpan shard={transaction.senderShard} />)
                  </NetworkLink>
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
                <CopyButton className="mr-2" text={transaction.receiver} />
                {!isNaN(transaction.receiverShard) && (
                  <NetworkLink
                    to={urlBuilder.receiverShard(transaction.receiverShard)}
                    className="flex-shrink-0"
                  >
                    (<ShardSpan shard={transaction.receiverShard} />)
                  </NetworkLink>
                )}
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
            <Denominate value={transaction.value} showLastNonZeroDecimal />{' '}
            <span className="text-secondary">({transactionValuePrice})</span>
          </DetailItem>

          <DetailItem title="Transaction Fee">
            {transaction.gasUsed !== undefined ? (
              <>
                <Denominate
                  value={transaction.fee ? transaction.fee : getFee(transaction)}
                  showLastNonZeroDecimal
                />{' '}
                <span className="text-secondary">({transactionFeePrice})</span>
              </>
            ) : (
              <span className="text-secondary">N/A</span>
            )}
          </DetailItem>

          <DetailItem title="EGLD Price">
            {closingPrice
              ? `$${Number(closingPrice).toLocaleString('en', {
                  minimumFractionDigits: 2,
                })}`
              : '...'}
          </DetailItem>

          <DetailItem title="Gas Limit">
            {transaction.gasLimit !== undefined ? (
              <>{transaction.gasLimit.toLocaleString('en')}</>
            ) : (
              <span className="text-secondary">N/A</span>
            )}
          </DetailItem>

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

export default TransactionInfo;
