import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Loader, NetworkLink, PageState } from 'components';
import { isHash, urlBuilder } from 'helpers';
import { useAdapter } from 'hooks';
import { faExchangeAlt } from 'icons/regular';
import { refreshSelector } from 'redux/selectors/refresh';
import {
  TransactionType,
  TransactionSCResultType,
  TransactionInPoolType
} from 'types';

import { TransactionInPoolInfo } from './components';

export const TransactionInPoolDetails = () => {
  const params: any = useParams();
  const { hash: transactionId } = params;
  const { timestamp } = useSelector(refreshSelector);
  const { getTransaction, getScResult, getTransactionInPool } = useAdapter();

  const [processedTransaction, setProcessedTransaction] = useState<
    TransactionType | undefined
  >();
  const [processedScResult, setProcessedScResult] = useState<
    TransactionSCResultType | undefined
  >();
  const [transactionInPool, setTransactionInPool] = useState<
    TransactionInPoolType | undefined
  >();
  const [dataReady, setDataReady] = useState<boolean | undefined>();

  const fetchTransaction = async () => {
    if (transactionId) {
      const { data, success } = await getTransactionInPool(transactionId);

      if (!success && !data && isHash(transactionId)) {
        const { data: processedTxData, success: processedTxSuccess } =
          await getTransaction(transactionId);

        if (processedTxData && processedTxSuccess) {
          setProcessedTransaction(processedTxData);
        }

        if (!processedTxData && !processedTxSuccess) {
          const {
            data: processedScResultData,
            success: processedScResultSuccess
          } = await getScResult(transactionId);

          if (processedScResultData && processedScResultSuccess) {
            setProcessedScResult(processedScResultData);
          }
        }
      }

      setTransactionInPool(data);
      setDataReady(success);
    }
  };

  const checkRefetch = () => {
    if (transactionInPool && dataReady && !processedTransaction) {
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

  if (dataReady === false || !transactionInPool) {
    if (processedTransaction?.txHash) {
      return (
        <PageState
          icon={faExchangeAlt}
          title='Transaction was Processed'
          action={
            <div className='px-spacer'>
              <NetworkLink
                to={urlBuilder.transactionDetails(processedTransaction.txHash)}
                className='btn btn-primary'
              >
                View Transaction
              </NetworkLink>
            </div>
          }
        />
      );
    }

    if (processedScResult?.originalTxHash && processedScResult?.hash) {
      return (
        <PageState
          icon={faExchangeAlt}
          title='Transaction was Processed'
          action={
            <div className='px-spacer'>
              <NetworkLink
                to={urlBuilder.transactionDetails(
                  `${processedScResult.originalTxHash}#${processedScResult.hash}`
                )}
                className='btn btn-primary'
              >
                View Transaction
              </NetworkLink>
            </div>
          }
        />
      );
    }

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
          <TransactionInPoolInfo transaction={transactionInPool} />
        </div>
      </div>
    </div>
  );
};
