import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { Loader, PageState } from 'components';
import { isHash, urlBuilder } from 'helpers';
import { useAdapter, useNetworkRoute } from 'hooks';
import { faExchangeAlt } from 'icons/regular';
import { refreshSelector } from 'redux/selectors/refresh';
import { TransactionType, TransactionApiStatusEnum } from 'types';

import { TransactionInfo } from './components/TransactionInfo';

export const TransactionDetails = () => {
  const params: any = useParams();
  const { hash: transactionId } = params;
  const navigate = useNavigate();
  const networkRoute = useNetworkRoute();

  const { timestamp } = useSelector(refreshSelector);
  const { getTransaction, getScResult } = useAdapter();

  const [transaction, setTransaction] = useState<TransactionType | undefined>();
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchTransaction = async () => {
    if (transactionId && isHash(transactionId)) {
      const { data, success } = await getTransaction(transactionId);
      let originalTxHash = data?.originalTxHash;

      if (!success && !data) {
        const { data: scData, success: scSuccess } = await getScResult(
          transactionId
        );
        if (scSuccess) {
          originalTxHash = scData?.originalTxHash;
        }
      }

      if (originalTxHash) {
        const options = {
          pathname: networkRoute(urlBuilder.transactionDetails(originalTxHash)),
          hash: transactionId
        };
        navigate(options, { replace: true });

        return;
      }

      setTransaction(data);
      setDataReady(success);
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

  useEffect(() => {
    fetchTransaction();
  }, [transactionId]);
  useEffect(checkRefetch, [timestamp]);

  if (dataReady === undefined) {
    return <Loader />;
  }

  if (dataReady === false || !transaction) {
    return (
      <PageState
        icon={faExchangeAlt}
        title='Unable to locate this transaction hash'
        description={
          <div className='px-spacer'>
            <span className='text-break-all'>{transactionId}</span>
          </div>
        }
        isError
      />
    );
  }

  return (
    <div className='container page-content'>
      <div className='row'>
        <div className='col-12'>
          <TransactionInfo transaction={transaction} />
        </div>
      </div>
    </div>
  );
};
