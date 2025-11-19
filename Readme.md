# Seetickets Backend test

Welcome to the Seetickets backend test for new Hires (Mid Level). The purpose of this test is to evaluate a few assigned tasks given a codebase.

## Tech Stack

- Node 18.16.0 -> We want you to use this version of Node JS
- Express JS
- Postgres
- Mongo DB
- Docker

This API uses 2 data sources, one SQL and one NoSQL. Events and Tickets are stored in a SQL database while the settings should be stored as documents in Mongo DB.

## Postman Collection

A Postman collection is available for testing all API endpoints.

[![Run in Postman](https://run.pstmn.io/button.svg)](https://web.postman.co/workspace/My-Workspace~c6afc956-834a-46e4-8950-70f88f36f7ef/collection/3968266-6f1ed60c-8c7d-44f5-8bc5-0a0e88db9cf1?action=share&source=copy-link&creator=3968266)

**To import the collection:**
1. Click the button above or copy the link below
2. Open Postman
3. Click on "Import" in the top left
4. Select "Link" tab
5. Paste the collection URL
6. Click "Continue" and then "Import"

**Collection URL:**
```
https://web.postman.co/workspace/My-Workspace~c6afc956-834a-46e4-8950-70f88f36f7ef/collection/3968266-6f1ed60c-8c7d-44f5-8bc5-0a0e88db9cf1?action=share&source=copy-link&creator=3968266
```

The collection includes pre-configured requests for all endpoints with example request bodies and parameters.

## API Endpoints

The API provides the following endpoints:

### Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok"
}
```

---

### Get Events

**GET** `/events`

Retrieves a list of events with their available tickets. Returns up to 50 events.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Event Name",
    "date": "2024-01-01T00:00:00.000Z",
    "location": "Event Location",
    "description": "Event Description",
    "availableTickets": [
      {
        "id": "1",
        "eventId": "1",
        "type": "General Admission",
        "status": "available",
        "price": 50.00,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Notes:**
- Only tickets with `status: "available"` are included in the response
- Events are stored in PostgreSQL
- Tickets are stored in PostgreSQL

---

### Get Client Settings

**GET** `/client-settings/:clientId`

Retrieves client settings for a specific client. If no settings exist, default settings are created and returned.

**Parameters:**
- `clientId` (path parameter, required): The client ID (must be a number)

**Response:**
```json
{
  "clientId": 1,
  "deliveryMethods": [
    {
      "name": "Print Now",
      "enum": "PRINT_NOW",
      "order": 1,
      "isDefault": true,
      "selected": true
    },
    {
      "name": "Print@Home",
      "enum": "PRINT_AT_HOME",
      "order": 2,
      "isDefault": false,
      "selected": true
    }
  ],
  "fulfillmentFormat": {
    "rfid": false,
    "print": false
  },
  "printer": {
    "id": null
  },
  "printingFormat": {
    "formatA": true,
    "formatB": false
  },
  "scanning": {
    "scanManually": true,
    "scanWhenComplete": false
  },
  "paymentMethods": {
    "cash": true,
    "creditCard": false,
    "comp": false
  },
  "ticketDisplay": {
    "leftInAllotment": true,
    "soldOut": true
  },
  "customerInfo": {
    "active": false,
    "basicInfo": false,
    "addressInfo": false
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid clientId format
- `500 Internal Server Error`: Server error

**Notes:**
- Client settings are stored in MongoDB
- If settings don't exist, default settings are automatically created

---

### Update Client Settings

**PUT** `/client-settings/:clientId`

Updates or creates client settings for a specific client.

**Parameters:**
- `clientId` (path parameter, required): The client ID (must be a number)

**Request Body:**
```json
{
  "deliveryMethods": [
    {
      "name": "Print Now",
      "enum": "PRINT_NOW",
      "order": 1,
      "isDefault": true,
      "selected": true
    },
    {
      "name": "Print@Home",
      "enum": "PRINT_AT_HOME",
      "order": 2,
      "isDefault": false,
      "selected": true
    }
  ],
  "fulfillmentFormat": {
    "rfid": false,
    "print": false
  },
  "printer": {
    "id": null
  },
  "printingFormat": {
    "formatA": true,
    "formatB": false
  },
  "scanning": {
    "scanManually": true,
    "scanWhenComplete": false
  },
  "paymentMethods": {
    "cash": true,
    "creditCard": false,
    "comp": false
  },
  "ticketDisplay": {
    "leftInAllotment": true,
    "soldOut": true
  },
  "customerInfo": {
    "active": false,
    "basicInfo": false,
    "addressInfo": false
  }
}
```

**Response:**
Returns the updated client settings object (same structure as GET response).

**Error Responses:**
- `400 Bad Request`: Invalid clientId format or validation error in request body
- `500 Internal Server Error`: Server error

**Validation Rules:**
- `deliveryMethods`: Array of delivery method objects with required fields
- `deliveryMethods[].enum`: Must be either `"PRINT_NOW"` or `"PRINT_AT_HOME"`
- All boolean and object fields must match the schema structure

**Notes:**
- Client settings are stored in MongoDB
- This endpoint performs an upsert operation (creates if not exists, updates if exists)

---

## What will you need to have installed to do this test

- Docker (With docker compose to run the containers for the DBs)
- NVM to use the node version in the project

## Installing and running the project

- Fork this repository into your own GitHub
- Clone the fork in your machine
- Run yarn install to install the packages (We don't want to use NPM as all of our projects use yarn)
- Run `docker compose up` to get the databases up and running

### Running migrations for the Postgres DB

- Run `yarn migrations:latest` to migrate the DB
- Run `yarn db:seed` at least 2 times to create some data in the database, The more you run it the more data you will have to work with

### Run the API

- Run `yarn start` to start the express API (it uses nodemon to listen to code changes)
- The API will be available at `http://localhost:3000`
