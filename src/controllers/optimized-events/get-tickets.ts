import { Request, Response } from 'express';
import { TicketsDAL } from '../../dal/tickets.dal';

export const createGetTicketsController =
  ({ ticketsDAL }: { ticketsDAL: TicketsDAL }) =>
  async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const eventId = parseInt(req.params.eventId);

    if (isNaN(eventId) || eventId < 1 || isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'Invalid parameters' });
    }

    try {
      const cursor = req.query.cursor as string | undefined;
      const { tickets, nextCursor } = await ticketsDAL.getTicketsByEventWithCursor({ eventId, limit, cursor });
      return res.json({
        tickets,
        nextCursor,
      });
    } catch (error) {
      console.error('Error fetching tickets:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
