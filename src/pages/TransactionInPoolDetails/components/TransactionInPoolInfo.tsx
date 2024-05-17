import BigNumber from 'bignumber.js';

import {
  FormatAmount,
  ShardSpan,
  DetailItem,
  CopyButton,
  LoadingDots,
  AccountLink
} from 'components';
import { addressIsBech32, isContract } from 'helpers';
import { DataField } from 'pages/TransactionDetails/components/TransactionInfo/DataField';
import { TransactionWarningMessage } from 'pages/TransactionDetails/components/TransactionInfo/TransactionWarningMessage';
import { TransactionInPoolType } from 'types';

export const TransactionInPoolInfo = ({
  transaction
}: {
  transaction: TransactionInPoolType;
}) => {
  return (
    <div className='transaction-info card'>
      <div className='card-header'>
        <div className='card-header-item d-flex align-items-center'>
          <div className='d-flex align-items-center ms-auto'>
            <LoadingDots />
          </div>
        </div>
      </div>

      <div className='card-body'>
        <DetailItem title='Hash'>
          <div className='d-flex align-items-center text-break-all text-neutral-100'>
            {transaction.txHash}
            <CopyButton text={transaction.txHash} />
          </div>
        </DetailItem>

        <DetailItem title='From'>
          <div className='d-flex align-items-center'>
            {addressIsBech32(transaction.sender) ? (
              <>
                <AccountLink address={transaction.sender} hasHighlight />
                <CopyButton className='me-2' text={transaction.sender} />
              </>
            ) : (
              <>
                {transaction.sender ? (
                  <ShardSpan shard={transaction.sender} />
                ) : (
                  '-'
                )}
              </>
            )}
          </div>
        </DetailItem>

        <DetailItem title='To'>
          <div className='d-flex flex-column'>
            <div className='d-flex align-items-center'>
              {isContract(transaction.receiver) ? (
                <span className='me-2 text-neutral-400'>Contract</span>
              ) : (
                ''
              )}
              <AccountLink
                address={transaction.receiver}
                username={transaction.receiverUsername}
                hasHighlight
              />
              <CopyButton className='me-2' text={transaction.receiver} />
            </div>
          </div>
        </DetailItem>

        <DetailItem title='Value' className='text-neutral-100'>
          <FormatAmount
            value={transaction.value.toString()}
            showUsdValue={false}
            showLastNonZeroDecimal
          />
        </DetailItem>

        <DetailItem title='Type'>
          <div className='badge badge-outline badge-outline-green-alt text-truncate mw-inherit'>
            {transaction.type}
          </div>
        </DetailItem>

        <DetailItem title='Gas Limit'>
          {transaction.gasLimit !== undefined ? (
            <span className='text-neutral-100'>
              {new BigNumber(transaction.gasLimit).toFormat()}
            </span>
          ) : (
            <span>N/A</span>
          )}
        </DetailItem>

        <DetailItem title='Gas Price' className='text-neutral-100'>
          {transaction.gasPrice !== undefined ? (
            <FormatAmount
              value={transaction.gasPrice.toString()}
              showLastNonZeroDecimal
            />
          ) : (
            <span>N/A</span>
          )}
        </DetailItem>

        <DetailItem title='Nonce'>
          <>
            <span className='text-neutral-100'>{transaction.nonce}</span>
            <TransactionWarningMessage
              transaction={transaction}
              isPoolTransaction
            />
          </>
        </DetailItem>

        <DataField data={transaction.data} />
      </div>
    </div>
  );
};
