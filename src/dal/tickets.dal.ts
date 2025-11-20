import { Knex } from 'knex';
import { Ticket } from '../entity/ticket';

export type TGetTicketsByEventWithCursorParams = {
  eventId: number;
  limit: number;
  cursor?: string;
};

export type TGetTicketsByEventWithCursorResponse = {
  tickets: Ticket[];
  nextCursor: string | null;
};

export interface TicketsDAL {
  getTicketsByEvent(eventId: number): Promise<Ticket[]>;
  getTicketsByEventWithCursor(
    params: TGetTicketsByEventWithCursorParams,
  ): Promise<TGetTicketsByEventWithCursorResponse>;
}

export const createTicketDAL = (knex: Knex): TicketsDAL => {
  return {
    async getTicketsByEvent(eventId): Promise<Ticket[]> {
      return await knex<Ticket>('tickets').select('*').where('event_id', eventId);
    },
    async getTicketsByEventWithCursor({
      eventId,
      limit = 20,
      cursor,
    }: TGetTicketsByEventWithCursorParams): Promise<TGetTicketsByEventWithCursorResponse> {
      let query = knex('tickets')
        .select(
          'id',
          'event_id as eventId',
          'type',
          'status',
          'price',
          'created_at as createdAt',
          'updated_at as updatedAt',
        )
        .where('event_id', eventId)
        .orderBy('id', 'asc')
        .limit(limit + 1);

      if (cursor) {
        const cursorId = parseInt(cursor);
        if (!isNaN(cursorId)) {
          query = query.where('id', '>', cursorId);
        }
      }

      const tickets = await query;
      let nextCursor: string | null = null;

      if (tickets.length > limit) {
        tickets.pop();
        const lastTicket = tickets[tickets.length - 1];
        nextCursor = lastTicket.id;
      }

      return {
        tickets,
        nextCursor,
      };
    },
  };
};
