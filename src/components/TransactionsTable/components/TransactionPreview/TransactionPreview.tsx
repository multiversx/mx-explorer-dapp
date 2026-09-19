import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { PreviewPanelWrapper } from 'components';
import { useAdapter } from 'hooks';
import { faEye } from 'icons/regular';
import { transactionOverviewSelector } from 'redux/selectors';
import {
  addTransactionDetails,
  pauseTxRefresh,
  resumeTxRefresh
} from 'redux/slices';
import { TransactionType, WithClassnameType } from 'types';
import { TransactionPreviewPanel } from './TransactionPreviewPanel';

export interface TransactionPreviewUIType extends WithClassnameType {
  transaction: TransactionType;
}

export const TransactionPreview = ({
  transaction,
  className
}: TransactionPreviewUIType) => {
  const dispatch = useDispatch();
  const { txHash, status } = transaction;
  const { transactionsDetails } = useSelector(transactionOverviewSelector);
  const { getTransaction } = useAdapter();

  const currentTransaction = transactionsDetails?.[txHash];

  const handleOnMouseEnter = () => {
    dispatch(pauseTxRefresh());
  };

  const handleOnMouseLeave = () => {
    dispatch(resumeTxRefresh());
  };

  return (
    <PreviewPanelWrapper
      hash={txHash}
      fetchData={() => getTransaction(txHash)}
      cachedPreviews={transactionsDetails ?? {}}
      preview={
        currentTransaction && (
          <TransactionPreviewPanel transaction={currentTransaction} />
        )
      }
      onApiData={(data) => {
        dispatch(addTransactionDetails({ transactionDetails: data }));
      }}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      trigger={['click']}
    >
      <button
        type='button'
        className={classNames(
          'cursor-context btn btn-sm btn-dark tx-preview-btn',
          status,
          className
        )}
        aria-description={`${txHash}: ${status}`}
      >
        <FontAwesomeIcon icon={faEye} size='xs' />
      </button>
    </PreviewPanelWrapper>
  );
};
