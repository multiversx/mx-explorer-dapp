import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { useGlobalState } from 'context';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Loader, adapter, PageState } from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import Details from './TransactionDetails';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';

const TransactionDetails = () => {
  const params: any = useParams();
  const { hash: transactionId } = params;
  const ref = React.useRef(null);

  const {
    refresh: { timestamp },
  } = useGlobalState();

  const { getTransaction } = adapter();

  const [transaction, setTransaction] = React.useState<TransactionType | undefined>();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchTransaction = () => {
    if (transactionId) {
      getTransaction({ transactionId }).then(({ data, success }) => {
        if (ref.current !== null) {
          setTransaction(data);
          setDataReady(success);
        }
      });
    }
  };

  React.useEffect(fetchTransaction, []);

  const checkRefetch = () => {
    if (
      transaction &&
      transaction.status.toLowerCase() === txStatus.pending.toLowerCase() &&
      dataReady
    ) {
      fetchTransaction();
    }
  };

  React.useEffect(checkRefetch, [timestamp]);

  return (
    <>
      {dataReady === undefined && <Loader />}
      {dataReady === false && (
        <PageState
          icon={faExchangeAlt}
          title="Unable to locate this transaction hash"
          description={
            <div className="px-spacer">
              <span className="text-break-all">{transactionId}</span>
            </div>
          }
          className="py-spacer my-auto"
          data-testid="errorScreen"
        />
      )}
      <div ref={ref}>
        {dataReady === true && transaction && (
          <div className="container py-spacer">
            <div className="row page-header">
              <div className="col-12">
                <h3 className="page-title mb-4" data-testid="title">
                  Transaction Details
                </h3>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <Details transaction={transaction} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TransactionDetails;
