import { useDispatch, useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { useGetPage, useGetEventFilters } from 'hooks';
import { eventsSelector } from 'redux/selectors';
import { setEvents } from 'redux/slices';
import { EventType } from 'types';
import { FetchApiDataProps, useFetchApiData } from './useFetchApiData';

interface EventsWebsocketResponseType {
  events: EventType[];
  eventsCount: number;
}

export const useFetchEvents = (props: Omit<FetchApiDataProps, 'onApiData'>) => {
  const dispatch = useDispatch();
  const eventFilters = useGetEventFilters();
  const { page, size } = useGetPage();
  const { dataCountPromise, filters } = props;

  const { events, eventsCount, isDataReady, isWebsocket } =
    useSelector(eventsSelector);

  const onWebsocketData = (event: EventsWebsocketResponseType) => {
    if (!event) {
      return;
    }

    const { events, eventsCount } = event;
    dispatch(
      setEvents({
        events,
        eventsCount,
        isWebsocket: true,
        isDataReady: true
      })
    );
  };

  const onApiData = (response: any[]) => {
    const [eventsData, eventsCountData] = response;

    dispatch(
      setEvents({
        events: eventsData.data ?? [],
        eventsCount: eventsCountData?.data ?? ELLIPSIS,
        isWebsocket: false,
        isDataReady:
          eventsData.success &&
          Boolean(!dataCountPromise || eventsCountData?.success)
      })
    );
  };

  const { fetchData, dataChanged } = useFetchApiData({
    ...props,
    filters: {
      page,
      size,
      ...eventFilters,
      ...filters
    },
    onWebsocketData,
    onApiData,
    isWebsocketUpdate: isWebsocket
  });

  return {
    events,
    totalEvents: eventsCount,
    isDataReady,
    fetchEvents: fetchData,
    dataChanged
  };
};
