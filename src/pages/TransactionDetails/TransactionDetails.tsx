import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Loader, PageState } from 'components';
import { useAdapter } from 'hooks';
import { faExchangeAlt } from 'icons/regular';
import { refreshSelector } from 'redux/selectors/refresh';
import { TransactionType, TransactionApiStatusEnum } from 'types';

import { TransactionInfo } from './components/TransactionInfo';

export const TransactionDetails = () => {
  const params: any = useParams();
  const { hash: transactionId } = params;
  const ref = useRef(null);

  const { timestamp } = useSelector(refreshSelector);

  const { getTransaction } = useAdapter();

  const [transaction, setTransaction] = useState<TransactionType | undefined>();
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchTransaction = () => {
    if (transactionId) {
      getTransaction(transactionId).then(({ data, success }) => {
        if (ref.current !== null) {
          setTransaction(data);
          setDataReady(success);
        }
      });
    }
  };

  const checkRefetch = () => {
    if (
      transaction &&
      ((transaction?.status &&
        transaction.status.toLowerCase() ===
          TransactionApiStatusEnum.pending) ||
        transaction.pendingResults) &&
      dataReady
    ) {
      fetchTransaction();
    }
  };

  useEffect(fetchTransaction, [transactionId]);

  useEffect(checkRefetch, [timestamp]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState
          icon={faExchangeAlt}
          title='Unable to locate this transaction hash'
          description={
            <div className='px-spacer'>
              <span className='text-break-all'>{transactionId}</span>
            </div>
          }
          className='py-spacer my-auto'
          data-testid='errorScreen'
        />
      )}
      <div ref={ref}>
        {dataReady === true && transaction && (
          <div className='container page-content'>
            <div className='row'>
              <div className='col-12'>
                <TransactionInfo transaction={transaction} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
