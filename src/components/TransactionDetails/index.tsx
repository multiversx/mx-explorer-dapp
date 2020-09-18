import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGlobalState } from 'context';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Loader, adapter } from 'sharedComponents';
import { TransactionType } from 'sharedComponents/TransactionsTable';
import Details from './TransactionDetails';
import PendingTransaction, { PendingTransactionType } from './PendingTransaction';

const TransactionDetails: React.FC = () => {
  const params: any = useParams();
  const { hash: transactionId } = params;
  const ref = React.useRef(null);

  const {
    refresh: { timestamp },
  } = useGlobalState();

  const { getTransaction, getPendingTransaction } = adapter();

  const [transaction, setTransaction] = React.useState<TransactionType | undefined>(undefined);
  const [pendingTransaction, setPendingTransaction] = React.useState<
    PendingTransactionType | undefined
  >(undefined);
  const [transactionFetched, setTransactionFetched] = React.useState<boolean>(true);

  const fetchTransaction = React.useCallback(() => {
    if (transactionId && ref.current !== null) {
      getTransaction({ transactionId })
        .then(({ data, transactionFetched }) => {
          if (transactionFetched) {
            setTransaction(data);
            setPendingTransaction(undefined);
            setTransactionFetched(true);
          }
        })
        .catch(() => {
          getPendingTransaction({ transactionId }).then(({ data, transactionFetched }) => {
            if (transactionFetched) {
              setPendingTransaction(data);
              setTransactionFetched(true);
            } else {
              if (ref.current !== null) {
                setTransactionFetched(false);
              }
            }
          });
        });
    }
  }, [getPendingTransaction, getTransaction, transactionId]);

  React.useEffect(fetchTransaction, []);

  const checkRefetch = () => {
    const transactionIsPending =
      transaction && !['Not Executed', 'Failed', 'Success'].includes(transaction.status);
    if (transactionIsPending || pendingTransaction !== undefined) {
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
            {!transactionFetched ? (
              <div className="card" data-testid="errorScreen">
                <div className="card-body card-details">
                  <div className="empty">
                    <FontAwesomeIcon icon={faExchangeAlt} className="empty-icon" />
                    <span className="h4 empty-heading">Unable to locate this transaction hash</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {transaction ? (
                  <Details transaction={transaction} />
                ) : (
                  <>
                    {pendingTransaction ? (
                      <PendingTransaction transaction={pendingTransaction} />
                    ) : (
                      <Loader />
                    )}
                  </>
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
