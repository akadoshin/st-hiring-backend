import { EventDAL } from '../../dal/events.dal';
import { Request, Response } from 'express';

export const createGetEventsController =
  ({ eventsDAL }: { eventsDAL: EventDAL }) =>
  async (req: Request, res: Response) => {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const cursor = req.query.cursor as string | undefined;

    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'Invalid limit parameter' });
    }

    try {
      const { events, nextCursor } = await eventsDAL.getEventsWithCursor({ limit, cursor });

      return res.json({
        events,
        nextCursor,
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
