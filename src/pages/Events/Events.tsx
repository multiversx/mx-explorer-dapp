import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { EventsTable } from 'components';
import { useAdapter, useGetPage, useFetchEvents } from 'hooks';
import { activeNetworkSelector } from 'redux/selectors';
import { WebsocketEventsEnum, WebsocketSubcriptionsEnum } from 'types';

export const Events = () => {
  const [searchParams] = useSearchParams();

  const { firstPageRefreshTrigger } = useGetPage();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const { getEvents, getEventsCount } = useAdapter();

  const { fetchEvents, events, totalEvents, isDataReady, dataChanged } =
    useFetchEvents({
      dataPromise: getEvents,
      dataCountPromise: getEventsCount,
      subscription: WebsocketSubcriptionsEnum.subscribeEvents,
      event: WebsocketEventsEnum.eventsUpdate
    });

  useEffect(() => {
    fetchEvents(Boolean(searchParams.toString()));
  }, [searchParams, activeNetworkId, firstPageRefreshTrigger]);

  return (
    <div className='container page-content'>
      <div className='row'>
        <div className='col-12'>
          <EventsTable
            events={events}
            totalEvents={totalEvents}
            dataChanged={dataChanged}
            isDataReady={isDataReady}
          />
        </div>
      </div>
    </div>
  );
};
