import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import {
  FormatAmount,
  NetworkLink,
  TransactionStatus,
  DetailItem,
  Trim,
  CopyButton,
  TransactionAction,
  FormatUSD,
  AccountLink,
  TransactionIcons
} from 'components';
import {
  formatAmount,
  isContract,
  getTransactionMethod,
  getTotalTxTokenUsdValue,
  getDisplayReceiver,
  getTransactionVisibleOperations
} from 'helpers';
import {
  OperationsList,
  ScResultsList,
  DataField,
  TransactionWarningMessage
} from 'pages/TransactionDetails/components';
import { activeNetworkSelector } from 'redux/selectors';
import {
  TransactionType,
  TransactionActionCategoryEnum,
  TransactionActionEnum
} from 'types';
import { TxAge, TxFee, TxFrom, TxReceiver, TxTo } from './components';

export const TransactionDetailsPanel = ({
  transaction
}: {
  transaction: TransactionType;
}) => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { receiver } = getDisplayReceiver(transaction);

  const txValue = formatAmount({
    input: transaction.value,
    showLastNonZeroDecimal: true
  });

  const transactionActionCategory = transaction?.action?.category;
  const visibleOperations = getTransactionVisibleOperations(transaction);
  const totalTxTokenUsdValue = getTotalTxTokenUsdValue(transaction);
  const showTotalTxTokenUsdValue =
    totalTxTokenUsdValue !== new BigNumber(0).toString();

  const skipDataScamCheck =
    transaction.sender === receiver &&
    transaction.function === TransactionActionEnum.transfer &&
    (!transaction.scamInfo || transaction.scamInfo?.type === 'potentialScam');

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
        <TxAge transaction={transaction} />
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
        <TxFrom transaction={transaction} />
      </DetailItem>

      <DetailItem title='To'>
        <TxTo transaction={transaction} />
      </DetailItem>

      {receiver !== transaction.receiver && (
        <DetailItem title='Destination'>
          <TxReceiver transaction={transaction} />
        </DetailItem>
      )}

      {transaction.relayer && (
        <DetailItem title='Relayer'>
          <div className='d-flex align-items-center'>
            {isContract(transaction.relayer) && (
              <span className='me-2 text-neutral-400'>Contract</span>
            )}
            <AccountLink address={transaction.relayer} hasHighlight />
            <CopyButton className='me-2' text={transaction.relayer} />
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

      {transactionActionCategory &&
        transactionActionCategory !== TransactionActionCategoryEnum.scCall && (
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
        <TxFee transaction={transaction} />
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
        <span className='text-neutral-100'>{transaction.nonce}</span>
        <TransactionWarningMessage transaction={transaction} />
      </DetailItem>

      <DataField
        data={transaction.data}
        scamInfo={transaction.scamInfo}
        skipDataScamCheck={skipDataScamCheck}
      />

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
