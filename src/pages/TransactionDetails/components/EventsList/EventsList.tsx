import { EventType } from 'types';

import { EventItem } from './EventItem';

interface EventsListUIType {
  events: EventType[];
  txHash: string;
  id: string;
}

export const EventsList = ({ events, ...props }: EventsListUIType) => (
  <div className='events-list item-list d-flex flex-column mt-1'>
    {events.map((event: EventType, i) => (
      <EventItem key={i} event={event} {...props} />
    ))}
  </div>
);
