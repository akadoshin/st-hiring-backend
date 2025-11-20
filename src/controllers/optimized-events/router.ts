import express, { Router } from 'express';

import { EventDAL } from '../../dal/events.dal';
import { TicketsDAL } from '../../dal/tickets.dal';

import { createGetEventsController } from './get-events';
import { createGetTicketsController } from './get-tickets';

export const createEventsRouter = ({
  eventsDAL,
  ticketsDAL,
}: {
  eventsDAL: EventDAL;
  ticketsDAL: TicketsDAL;
}): Router => {
  const router = express.Router();

  router.get('/', createGetEventsController({ eventsDAL }));
  router.get('/:eventId/tickets', createGetTicketsController({ ticketsDAL }));

  return router;
};
