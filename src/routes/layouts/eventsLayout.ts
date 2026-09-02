import { TitledRouteObject } from '../routes';

export const eventsRoutes = {
  events: '/events',
  eventDetails: '/events/:hash'
};

export const eventsLayout: TitledRouteObject[] = [
  {
    path: eventsRoutes.events,
    title: 'Events',
    lazyComponent: () => import('pages/Events').then((module) => module.Events)
  },
  {
    path: eventsRoutes.eventDetails,
    title: 'Event Details',
    lazyComponent: () =>
      import('pages/EventDetails').then((module) => module.EventDetails)
  }
];
