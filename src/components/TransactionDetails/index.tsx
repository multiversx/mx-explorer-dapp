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
  const [transactionFetched, setTransactionFetched] = React.useState<boolean | undefined>();

  const fetchTransaction = () => {
    if (transactionId) {
      getTransaction({ transactionId }).then(({ data, transactionFetched }) => {
        if (ref.current !== null) {
          setTransaction(data);
          setTransactionFetched(transactionFetched);
        }
      });
    }
  };

  React.useEffect(fetchTransaction, []);

  const checkRefetch = () => {
    if (
      transaction &&
      transaction.status.toLowerCase() === txStatus.pending.toLowerCase() &&
      transactionFetched
    ) {
      fetchTransaction();
    }
  };

  React.useEffect(checkRefetch, [timestamp]);

  return (
    <div ref={ref}>
      <div className="container pt-3 pb-3">
        <div className="row">
          <div className="col-12">
            <h4 data-testid="title">Transaction Details</h4>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {transactionFetched === undefined && <Loader dataTestId="loader" />}
            {transactionFetched === false && (
              <PageState
                icon={faExchangeAlt}
                title="Unable to locate this transaction hash"
                className="py-spacer d-flex h-100 align-items-center justify-content-center"
                data-testid="errorScreen"
              />
            )}
            {transactionFetched === true && transaction && <Details transaction={transaction} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
