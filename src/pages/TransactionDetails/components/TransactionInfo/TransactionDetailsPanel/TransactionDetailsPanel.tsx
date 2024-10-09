import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import {
  FormatAmount,
  ShardSpan,
  NetworkLink,
  TimeAgo,
  TransactionStatus,
  DetailItem,
  Trim,
  CopyButton,
  TransactionAction,
  FormatUSD,
  AccountLink,
  ShardLink,
  TransactionIcons
} from 'components';
import {
  addressIsBech32,
  formatAmount,
  formatDate,
  isContract,
  getTransactionMethod,
  getTotalTxTokenUsdValue,
  getDisplayReceiver,
  getTransactionVisibleOperations
} from 'helpers';
import { faClock, faSpinner } from 'icons/regular';
import {
  OperationsList,
  ScResultsList,
  DataField,
  TransactionErrorDisplay,
  TransactionWarningMessage
} from 'pages/TransactionDetails/components';
import { activeNetworkSelector } from 'redux/selectors';
import {
  TransactionType,
  TransactionActionCategoryEnum,
  TransactionApiStatusEnum
} from 'types';

export const getFee = (transaction: TransactionType) => {
  const bNgasPrice = new BigNumber(transaction.gasPrice);
  const bNgasUsed = new BigNumber(transaction.gasUsed);
  const output = bNgasPrice.times(bNgasUsed).toString();

  return output;
};

export const TransactionDetailsPanel = ({
  transaction
}: {
  transaction: TransactionType;
}) => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { receiver, receiverAssets } = getDisplayReceiver(transaction);

  const isTxPending =
    (transaction?.status &&
      transaction.status.toLowerCase() === TransactionApiStatusEnum.pending) ||
    transaction.pendingResults;

  const transactionFee =
    transaction.fee === undefined && transaction.gasUsed === undefined
      ? 'N/A'
      : formatAmount({
          input: transaction.fee ? transaction.fee : getFee(transaction),
          showLastNonZeroDecimal: true
        });

  const txValue = formatAmount({
    input: transaction.value,
    showLastNonZeroDecimal: true
  });

  const transactionActionCategory = transaction?.action?.category;
  const visibleOperations = getTransactionVisibleOperations(transaction);
  const totalTxTokenUsdValue = getTotalTxTokenUsdValue(transaction);
  const showTotalTxTokenUsdValue =
    totalTxTokenUsdValue !== new BigNumber(0).toString();

  return (
    <>
      <DetailItem title='Hash'>
        <div className='d-flex align-items-center text-break-all text-neutral-100'>
          <TransactionIcons transaction={transaction} showStatus={false} />
          {transaction.txHash}
          <CopyButton text={transaction.txHash} />
        </div>
      </DetailItem>

      {transaction?.status && (
        <DetailItem title='Status'>
          <div className='d-flex flex-wrap align-items-center'>
            <TransactionStatus transaction={transaction} />
          </div>
        </DetailItem>
      )}

      <DetailItem title='Age' className='text-neutral-400'>
        {transaction.timestamp ? (
          <div className='d-flex flex-wrap align-items-center'>
            {isTxPending ? (
              <FontAwesomeIcon
                icon={faSpinner}
                className='me-2  fa-spin slow-spin'
              />
            ) : (
              <FontAwesomeIcon icon={faClock} className='me-2 ' />
            )}
            <TimeAgo value={transaction.timestamp} />
            &nbsp;
            <span>({formatDate(transaction.timestamp, false, true)})</span>
          </div>
        ) : (
          <span>N/A</span>
        )}
      </DetailItem>

      <DetailItem title='Miniblock'>
        <div className='d-flex align-items-center'>
          {transaction.miniBlockHash ? (
            <>
              <NetworkLink
                to={`/miniblocks/${transaction.miniBlockHash}`}
                className='trim-wrapper'
              >
                <Trim text={transaction.miniBlockHash} />
              </NetworkLink>
              <CopyButton text={transaction.miniBlockHash} />
            </>
          ) : (
            <span>N/A</span>
          )}
        </div>
      </DetailItem>

      <DetailItem title='From'>
        <div className='d-flex align-items-center'>
          {addressIsBech32(transaction.sender) ? (
            <>
              <AccountLink
                address={transaction.sender}
                assets={transaction.senderAssets}
                hasHighlight
              />
              <CopyButton className='me-2' text={transaction.sender} />
              <ShardLink
                shard={transaction.senderShard}
                className='flex-shrink-0'
                transactionSenderShard
                hasParanthesis
              />
            </>
          ) : (
            <ShardSpan shard={transaction.sender} />
          )}
        </div>
      </DetailItem>

      <DetailItem title='To'>
        <div className='d-flex flex-column'>
          <div className='d-flex align-items-center'>
            {isContract(transaction.receiver) && (
              <span className='me-2 text-neutral-400'>Contract</span>
            )}
            <AccountLink
              address={transaction.receiver}
              assets={transaction.receiverAssets}
              hasHighlight
            />
            <CopyButton className='me-2' text={transaction.receiver} />
            {!isNaN(transaction.receiverShard) && (
              <ShardLink
                shard={transaction.receiverShard}
                className='flex-shrink-0'
                transactionReceiverShard
                hasParanthesis
              />
            )}
          </div>
          <div className='d-flex flex-column gap-1'>
            <TransactionErrorDisplay transaction={transaction} />
          </div>
        </div>
      </DetailItem>

      {receiver !== transaction.receiver && (
        <DetailItem title='Destination'>
          <div className='d-flex flex-column'>
            <div className='d-flex align-items-center'>
              {isContract(receiver) && (
                <span className='me-2 text-neutral-400'>Contract</span>
              )}
              <AccountLink
                address={receiver}
                assets={receiverAssets}
                hasHighlight
              />
              <CopyButton className='me-2' text={receiver} />
            </div>
          </div>
        </DetailItem>
      )}

      <DetailItem title='Value' className='text-neutral-100'>
        <FormatAmount
          value={transaction.value.toString()}
          showUsdValue={false}
          showLastNonZeroDecimal
        />
        {transaction.price && (
          <>
            {' '}
            <FormatUSD
              value={txValue}
              usd={transaction.price}
              className='text-neutral-400'
            />
          </>
        )}
      </DetailItem>

      <DetailItem title='Method'>
        <div className='badge badge-outline badge-outline-green-alt text-truncate mw-inherit'>
          {getTransactionMethod(transaction)}
        </div>
      </DetailItem>

      {transactionActionCategory !== TransactionActionCategoryEnum.scCall && (
        <DetailItem title='Transaction Action' className='text-lh-24'>
          <TransactionAction transaction={transaction} />
        </DetailItem>
      )}

      {Boolean(visibleOperations.length) && (
        <DetailItem
          title={
            <>
              <span className='me-2 text-lh-24'>Token Operations</span>
              <span className='badge badge-outline badge-outline-grey'>
                {visibleOperations.length}
              </span>
            </>
          }
          verticalCenter
        >
          <OperationsList
            transaction={transaction}
            operations={visibleOperations}
          />
        </DetailItem>
      )}

      {showTotalTxTokenUsdValue && (
        <DetailItem title='Total Token Value'>
          <span className='text-neutral-100'>
            <FormatUSD value={totalTxTokenUsdValue} usd={1} digits={4} />
          </span>
        </DetailItem>
      )}

      <DetailItem title='Transaction Fee' className='text-neutral-100'>
        {transaction.fee !== undefined && transaction.gasUsed !== undefined ? (
          <>
            <FormatAmount
              value={transaction.fee ?? getFee(transaction)}
              showUsdValue={false}
              showLastNonZeroDecimal
            />
            {transaction.price !== undefined && (
              <>
                {' '}
                <FormatUSD
                  value={transactionFee}
                  usd={transaction.price}
                  className='text-neutral-400'
                />
              </>
            )}
          </>
        ) : (
          <span>N/A</span>
        )}
      </DetailItem>

      {transaction.price !== undefined && (
        <DetailItem title={`${egldLabel} Price`}>
          <FormatUSD
            value={1}
            usd={transaction.price}
            showPrefix={false}
            className='text-neutral-100'
          />
        </DetailItem>
      )}

      <DetailItem title='Gas Limit'>
        {transaction.gasLimit !== undefined ? (
          <span className='text-neutral-100'>
            {new BigNumber(transaction.gasLimit).toFormat()}
          </span>
        ) : (
          <span>N/A</span>
        )}
      </DetailItem>

      <DetailItem title='Gas Used'>
        {transaction.gasUsed !== undefined ? (
          <span className='text-neutral-100'>
            {new BigNumber(transaction.gasUsed).toFormat()}
          </span>
        ) : (
          <span>N/A</span>
        )}
      </DetailItem>

      <DetailItem title='Gas Price' className='text-neutral-100'>
        {transaction.gasPrice !== undefined ? (
          <FormatAmount
            value={transaction.gasPrice.toString()}
            usd={transaction.price}
            showLastNonZeroDecimal
          />
        ) : (
          <span>N/A</span>
        )}
      </DetailItem>

      <DetailItem title='Nonce'>
        <>
          <span className='text-neutral-100'>{transaction.nonce}</span>
          <TransactionWarningMessage transaction={transaction} />
        </>
      </DetailItem>

      <DataField data={transaction.data} scamInfo={transaction.scamInfo} />

      {transaction.results && transaction.results?.length > 0 && (
        <DetailItem
          title={<div className='item-title'>Smart Contract Results</div>}
        >
          <ScResultsList results={transaction.results} />
        </DetailItem>
      )}
    </>
  );
};
