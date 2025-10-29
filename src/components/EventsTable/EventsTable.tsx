import { ELLIPSIS } from 'appConstants';
import {
  Pager,
  PageSize,
  TableWrapper,
  Loader,
  PageState,
  PulsatingLed,
  ColSpanWrapper
} from 'components';
import { formatBigNumber, getStringPlural } from 'helpers';
import { faExchange } from 'icons/regular';
import { UIEventType } from 'types';

import { EventRow, EventsTableHeader } from './components';

export interface EventsTableUIType {
  events: UIEventType[];
  totalEvents: number | typeof ELLIPSIS;
  dataChanged?: boolean;
  isDataReady?: boolean;
}

export const EventsTable = ({
  events,
  totalEvents,
  dataChanged = false,
  isDataReady
}: EventsTableUIType) => {
  return (
    <div className='transactions-table events-table'>
      <div className='card'>
        <div className='card-header'>
          <div className='card-header-item table-card-header d-flex justify-content-between align-items-center flex-wrap gap-3'>
            <h5
              data-testid='title'
              className='table-title d-flex align-items-center'
            >
              {formatBigNumber({ value: totalEvents })}{' '}
              {getStringPlural(totalEvents, {
                string: 'Event'
              })}{' '}
              <PulsatingLed className='ms-2 mt-1' />
            </h5>
            <Pager
              total={totalEvents}
              show={events.length > 0}
              className='d-flex ms-auto me-auto me-sm-0'
            />
          </div>
        </div>

        <div className='card-body'>
          <TableWrapper dataChanged={dataChanged}>
            <table
              className='table trim-size-sm mb-0'
              data-testid='transactionsTable'
            >
              <EventsTableHeader />
              <tbody>
                {isDataReady === undefined && (
                  <ColSpanWrapper colSpan={5}>
                    <Loader />
                  </ColSpanWrapper>
                )}
                {isDataReady === false && (
                  <ColSpanWrapper colSpan={5}>
                    <PageState
                      icon={faExchange}
                      title='No Events'
                      className='py-spacer my-auto'
                    />
                  </ColSpanWrapper>
                )}

                {isDataReady === true && (
                  <>
                    {events.length > 0 ? (
                      <>
                        {events.map((event, key) => (
                          <EventRow
                            event={event}
                            key={`${event.txHash}-${key}`}
                          />
                        ))}
                      </>
                    ) : (
                      <>
                        <ColSpanWrapper colSpan={8}>
                          <PageState
                            icon={faExchange}
                            title='No Events'
                            className='py-spacer my-auto'
                          />
                        </ColSpanWrapper>
                      </>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </TableWrapper>
        </div>

        <div className='card-footer table-footer'>
          <PageSize />
          <Pager total={totalEvents} show={events.length > 0} />
        </div>
      </div>
    </div>
  );
};
