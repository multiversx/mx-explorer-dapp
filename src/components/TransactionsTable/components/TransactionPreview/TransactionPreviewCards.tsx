import { useSelector } from 'react-redux';

import {
  FormatAmount,
  FormatUSD,
  InfoTooltip,
  PreviewPanelCard,
  TransactionAction
} from 'components';
import {
  formatAmount,
  formatBigNumber,
  getDisplayReceiver,
  getTransactionMethod
} from 'helpers';
import {
  TxAge,
  TxFee,
  TxFrom,
  TxReceiver,
  TxTo
} from 'pages/TransactionDetails/components/TransactionInfo/TransactionDetailsPanel';
import { activeNetworkSelector } from 'redux/selectors';
import { TransactionActionCategoryEnum, TransactionType } from 'types';

export const TransactionPreviewCards = ({
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

  return (
    <>
      <dl className='preview-panel-cards gap-0'>
        {transaction.action?.category &&
          transaction.action?.category !==
            TransactionActionCategoryEnum.scCall && (
            <PreviewPanelCard
              title='Action'
              className='text-neutral-100'
              fullWidth
              featured
            >
              <TransactionAction transaction={transaction} />
            </PreviewPanelCard>
          )}
        <PreviewPanelCard title='From' halfWidth>
          <TxFrom transaction={transaction} showShard={false} />
        </PreviewPanelCard>
        <PreviewPanelCard title='To' halfWidth>
          <TxTo
            transaction={transaction}
            showError={false}
            showShard={false}
            showContractLabel={false}
          />
        </PreviewPanelCard>
        {receiver !== transaction.receiver && (
          <PreviewPanelCard title='Receiver' fullWidth>
            <TxReceiver transaction={transaction} />
          </PreviewPanelCard>
        )}
        <PreviewPanelCard title='Age' fullWidth>
          <TxAge transaction={transaction} />
        </PreviewPanelCard>
      </dl>
      <dl className='preview-panel-cards'>
        <PreviewPanelCard title='Value' featured halfWidth>
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
        </PreviewPanelCard>
        <PreviewPanelCard title='Method' featured halfWidth>
          <div className='badge badge-outline badge-outline-green-alt text-truncate mw-inherit'>
            {getTransactionMethod(transaction)}
          </div>
        </PreviewPanelCard>
        {Boolean(
          transaction.gasLimit !== undefined &&
            transaction.gasUsed !== undefined
        ) && (
          <PreviewPanelCard title='Gas Info' featured fullWidth>
            <div className='d-flex flex-column'>
              <div>
                <span className='text-neutral-100'>
                  {formatBigNumber({ value: transaction.gasUsed })}
                </span>{' '}
                gas used from{' '}
                <span className='text-neutral-100'>
                  {formatBigNumber({ value: transaction.gasLimit })}
                </span>{' '}
                gas limit
                <InfoTooltip
                  title={
                    <div className='text-start'>
                      {transaction.gasPrice !== undefined && (
                        <p className='mb-0'>
                          Gas Price:{' '}
                          <FormatAmount
                            value={transaction.gasPrice.toString()}
                            usd={transaction.price}
                            showLastNonZeroDecimal
                          />
                        </p>
                      )}
                      {transaction.price !== undefined && (
                        <p className='mb-0 mt-1'>
                          {egldLabel} Price:{' '}
                          <FormatUSD
                            value={1}
                            usd={transaction.price}
                            showPrefix={false}
                            className='text-neutral-100'
                          />
                        </p>
                      )}
                    </div>
                  }
                />
              </div>
              {Boolean(
                transaction.fee !== undefined &&
                  transaction.gasUsed !== undefined
              ) && (
                <div>
                  Transaction Fee:{' '}
                  <span className='text-neutral-100'>
                    <TxFee transaction={transaction} />
                  </span>
                </div>
              )}
            </div>
          </PreviewPanelCard>
        )}
      </dl>
    </>
  );
};
