import { faExchangeAlt } from '@fortawesome/pro-regular-svg-icons/faExchangeAlt';
import { useGlobalState } from 'context';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { Loader, adapter, PageState } from 'sharedComponents';
import TransactionInfo from './TransactionInfo';
import { TransactionType, TransactionTokensType, OperationType } from 'helpers/types';
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
  const [transactionTokens, setTransactionTokens] = React.useState<
    TransactionTokensType | undefined
  >();
  const [dataReady, setDataReady] = React.useState<boolean | undefined>();

  const fetchTransaction = () => {
    if (transactionId) {
      getTransaction(transactionId).then(({ data, success }) => {
        if (ref.current !== null) {
          setTransaction(data);
          if (data && data.operations && data.operations.length > 0) {
            prepareTransactionTokens(data.operations);
          }
          setDataReady(success);
        }
      });
    }
  };

  const prepareTransactionTokens = (operations: OperationType[]) => {
    const uniqueTokenIdentifiers = Array.from(
      new Set(
        operations
          .filter((operation) => operation.type === 'esdt')
          .map((operation) => operation.identifier)
      )
    );

    const uniqueNftIdentifiers = Array.from(
      new Set(
        operations
          .filter((operation) => operation.type === 'nft')
          .map((operation) => operation.identifier)
      )
    );

    setTransactionTokens({
      esdts: uniqueTokenIdentifiers,
      nfts: uniqueNftIdentifiers,
    });
  };

  const checkRefetch = () => {
    if (
      transaction &&
      (transaction.status.toLowerCase() === txStatus.pending.toLowerCase() ||
        transaction.pendingResults) &&
      dataReady
    ) {
      fetchTransaction();
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchTransaction, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div className="container page-content">
            <div className="row">
              <div className="col-12">
                <TransactionInfo transaction={transaction} transactionTokens={transactionTokens} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TransactionDetails;
