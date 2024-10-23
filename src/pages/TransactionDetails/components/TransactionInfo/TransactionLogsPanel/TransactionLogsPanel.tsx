import { DetailItem } from 'components';
import {
  AddressDetailItem,
  EventsList,
  ScrDetailItem
} from 'pages/TransactionDetails/components';
import { TransactionType } from 'types';

export const TransactionLogsPanel = ({
  transaction
}: {
  transaction: TransactionType;
}) => {
  return (
    <>
      {transaction.logs && (
        <>
          {transaction.logs.address !== undefined && (
            <AddressDetailItem address={transaction.logs.address} />
          )}
          {transaction.logs.events && transaction.logs.events.length > 0 && (
            <DetailItem title={<div className='item-title'>Events</div>}>
              <EventsList
                events={transaction.logs.events}
                txHash={transaction.txHash}
                id={transaction.logs?.id ?? 'events'}
              />
            </DetailItem>
          )}
        </>
      )}
      {transaction.results && transaction.results.length > 0 && (
        <div className='row'>
          {transaction.results.map((result, resultIndex) => {
            if (!result.logs) {
              return null;
            }

            return (
              <div
                key={`tx-result-log-${resultIndex}`}
                className='col-12 border-bottom'
              >
                <ScrDetailItem result={result} />
                {result.logs.address !== undefined && (
                  <AddressDetailItem address={result.logs.address} />
                )}
                {result.logs.events && result.logs.events?.length > 0 && (
                  <DetailItem title={<div className='item-title'>Events</div>}>
                    <EventsList
                      events={result.logs.events}
                      txHash={transaction.txHash}
                      id={result.logs?.id ?? 'result-events'}
                    />
                  </DetailItem>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
