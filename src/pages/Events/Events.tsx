import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { ELLIPSIS } from 'appConstants';
import { Loader, PageState, EventsTable } from 'components';
import { useAdapter, useGetPage, useGetSearch, useGetSort } from 'hooks';
import { faExchange } from 'icons/regular';
import { activeNetworkSelector } from 'redux/selectors';

import { EventType, SortOrderEnum } from 'types';

export const Events = () => {
  const [searchParams] = useSearchParams();
  const { id: activeNetworkId } = useSelector(activeNetworkSelector);

  const sort = useGetSort();
  const { search } = useGetSearch();
  const { page, size } = useGetPage();
  const { getEvents, getEventsCount } = useAdapter();

  const [events, setEvents] = useState<EventType[]>([]);
  const [isDataReady, setIsDataReady] = useState<boolean | undefined>();
  const [dataChanged, setDataChanged] = useState<boolean>(false);
  const [totalEvents, setTotalEvents] = useState<number | typeof ELLIPSIS>(
    ELLIPSIS
  );

  const fetchEvents = () => {
    setDataChanged(true);
    Promise.all([
      getEvents({
        page,
        size,
        ...sort
      }),
      getEventsCount({})
    ])
      .then(([eventsData, eventsCountData]) => {
        if (eventsData.success && eventsCountData.success) {
          setEvents(eventsData.data);
          setTotalEvents(eventsCountData.data);
        }
        setIsDataReady(eventsData.success && eventsCountData.success);
      })
      .finally(() => {
        setDataChanged(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, [activeNetworkId, searchParams]);

  if (isDataReady === undefined) {
    return <Loader />;
  }

  return (
    <div className='container page-content'>
      {isDataReady === false && (
        <PageState icon={faExchange} title='Unable to load Events' isError />
      )}
      {isDataReady === true && (
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
      )}
    </div>
  );
};
