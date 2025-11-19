import express from 'express';
import { knex } from 'knex';

import dbConfig from './database/knexfile';
import { connectMongoDB } from './database/mongodb';

import { createEventDAL } from './dal/events.dal';
import { createTicketDAL } from './dal/tickets.dal';
import { createClientSettingsDAL } from './dal/client-settings.dal';

import { createGetEventsController } from './controllers/get-events';
import { createGetClientSettingsController, createPutClientSettingsController } from './controllers/client-settings';

// initialize Knex
const Knex = knex(dbConfig.development);

// Initialize MongoDB connection
const mongoDb = connectMongoDB();

// Initialize DALs
const eventDAL = createEventDAL(Knex);
const TicketDAL = createTicketDAL(Knex);
const ClientSettingsDAL = createClientSettingsDAL(mongoDb);

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

app.use('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/events', createGetEventsController({ eventsDAL: eventDAL, ticketsDAL: TicketDAL }));

app.get('/client-settings/:clientId', createGetClientSettingsController({ clientSettingsDAL: ClientSettingsDAL }));
app.put('/client-settings/:clientId', createPutClientSettingsController({ clientSettingsDAL: ClientSettingsDAL }));

app.use('/', (_req, res) => {
  res.json({ message: 'Hello API' });
});

app.listen(3000, () => {
  console.log('Server Started');
});
