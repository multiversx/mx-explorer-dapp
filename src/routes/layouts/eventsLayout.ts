import { EventDetails } from 'pages/EventDetails';
import { Events } from 'pages/Events';

import { TitledRouteObject } from '../routes';

export const eventsRoutes = {
  events: '/events',
  transactionDetails: '/events/:hash'
};

export const eventsLayout: TitledRouteObject[] = [
  {
    path: eventsRoutes.events,
    title: 'Events',
    Component: Events
  },
  {
    path: eventsRoutes.transactionDetails,
    title: 'Event Details',
    Component: EventDetails
  }
];
