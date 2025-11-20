import { Knex } from 'knex';
import { Event } from '../entity/event';

export type TGetEventsWithCursorParams = {
  limit: number;
  cursor?: string;
};

export type TGetEventsWithCursorResponse = {
  events: Event[];
  nextCursor: string | null;
};

export interface EventDAL {
  getEvents(limit: number): Promise<Event[]>;
  getEventsWithCursor(params: TGetEventsWithCursorParams): Promise<TGetEventsWithCursorResponse>;
}

export const createEventDAL = (knex: Knex): EventDAL => {
  return {
    async getEvents(limit): Promise<Event[]> {
      return await knex<Event>('events').select('*').limit(limit);
    },
    async getEventsWithCursor({
      limit = 20,
      cursor,
    }: TGetEventsWithCursorParams): Promise<TGetEventsWithCursorResponse> {
      let query = knex<Event>('events')
        .select('id', 'name', 'date', 'location', 'description', 'created_at as createdAt', 'updated_at as updatedAt')
        .orderBy('date', 'desc')
        .orderBy('id', 'desc')
        .limit(limit + 1);

      if (cursor) {
        const cursorId = parseInt(cursor);
        if (!isNaN(cursorId)) {
          query = query.where('id', '>', cursorId);
        }
      }

      const events = await query;
      let nextCursor: string | null = null;

      if (events.length > limit) {
        events.pop();
        const lastEvent = events[events.length - 1];
        nextCursor = lastEvent.id;
      }

      return {
        events,
        nextCursor,
      };
    },
  };
};
