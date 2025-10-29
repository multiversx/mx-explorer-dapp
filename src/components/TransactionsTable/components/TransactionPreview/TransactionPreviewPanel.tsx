import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import {
  Trim,
  CopyButton,
  NetworkLink,
  TransactionIcons,
  TransactionStatus
} from 'components';
import { urlBuilder } from 'helpers';
import { useAdapter } from 'hooks';
import { faSearch, faArrowUpRightFromSquare } from 'icons/regular';
import { TransactionErrorDisplay } from 'pages/TransactionDetails/components';
import { refreshSelector } from 'redux/selectors';
import { addTransactionDetails } from 'redux/slices';
import { TransactionApiStatusEnum, TransactionType } from 'types';

import { TransactionPreviewCards } from './TransactionPreviewCards';

export const TransactionPreviewPanel = ({
  transaction
}: {
  transaction: TransactionType;
}) => {
  const dispatch = useDispatch();
  const { timestamp } = useSelector(refreshSelector);
  const { getTransaction } = useAdapter();

  const fetchTransaction = async () => {
    const { data, success } = await getTransaction(transaction.txHash);
    if (data && success) {
      dispatch(addTransactionDetails({ transactionDetails: data }));
    }
  };

  // opening the preview panel will pause the tx table refresh in order to keep the panel active, will keep checking for status here
  const checkRefetch = () => {
    const isTxStatusPending = Boolean(
      transaction.status &&
        transaction.status?.toLowerCase() === TransactionApiStatusEnum.pending
    );
    if (isTxStatusPending || transaction.pendingResults) {
      fetchTransaction();
    }
  };

  useEffect(checkRefetch, [timestamp]);

  return (
    <>
      <Popover.Header>
        <div className='d-flex flex-wrap gap-3 align-items-center justify-content-between'>
          <span>Transaction</span>
          <div className='d-flex align-items-center'>
            <TransactionStatus transaction={transaction} />
          </div>
        </div>
        <div className='preview-small preview-hash d-flex align-items-center gap-2'>
          <TransactionIcons transaction={transaction} showStatus={false} />
          <Trim text={transaction.txHash} />
          <CopyButton text={transaction.txHash} className='side-action ms-0' />
          <NetworkLink
            to={urlBuilder.transactionDetails(transaction.txHash)}
            className='side-action ms-0'
          >
            <FontAwesomeIcon icon={faSearch} />
          </NetworkLink>
          <NetworkLink
            to={urlBuilder.transactionDetails(transaction.txHash)}
            className='side-action mx-0'
            target='_blank'
            rel='noreferrer nofollow noopener'
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </NetworkLink>
        </div>
        <div className='d-flex flex-column gap-1 w-100'>
          <TransactionErrorDisplay transaction={transaction} />
        </div>
        <span>
          Nonce: <span className='text-neutral-100'>{transaction.nonce}</span>
        </span>
      </Popover.Header>
      <Popover.Body>
        <TransactionPreviewCards transaction={transaction} />
        <div className='mb-2'>
          <hr className='my-2' />
          <NetworkLink
            to={urlBuilder.transactionDetails(transaction.txHash)}
            target='_blank'
            className='ps-2 text-underline'
          >
            See more details <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </NetworkLink>
        </div>
      </Popover.Body>
    </>
  );
};
