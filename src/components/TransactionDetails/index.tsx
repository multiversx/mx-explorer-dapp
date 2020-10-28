import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Loader, adapter } from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import Details from './TransactionDetails';
import txStatus from 'sharedComponents/TransactionStatus/txStatus';

const TransactionDetails: React.FC = () => {
  const params: any = useParams();
  const { hash: transactionId } = params;
  const ref = React.useRef(null);

  const {
    refresh: { timestamp },
  } = useGlobalState();

  const { getTransaction } = adapter();

  const [transaction, setTransaction] = React.useState<TransactionType | undefined>();
  const [transactionFetched, setTransactionFetched] = React.useState<boolean | undefined>();

  const fetchTransaction = React.useCallback(() => {
    if (transactionId && ref.current !== null) {
      getTransaction({ transactionId }).then(({ data, transactionFetched }) => {
        if (transactionFetched) {
          setTransaction(data);
          setTransactionFetched(true);
        } else {
          setTransactionFetched(false);
        }
      });
    }
  }, [getTransaction, transactionId]);

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
            {transactionFetched === undefined ? (
              <Loader dataTestId="loader" />
            ) : (
              <>
                {transactionFetched === false ? (
                  <div className="card" data-testid="errorScreen">
                    <div className="card-body card-details">
                      <div className="empty">
                        <FontAwesomeIcon icon={faExchangeAlt} className="empty-icon" />
                        <span className="h4 empty-heading">
                          Unable to locate this transaction hash
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>{transaction && <Details transaction={transaction} />}</>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails;
