# Invoice Management System with Email Reporting

This project is a NestJS-based application for managing invoices and generating daily sales reports. The reports are sent via email using a RabbitMQ queue for message processing.

---

## Features

1. **Invoice Management**:

   - Create, retrieve, and list invoices using REST APIs.
   - MongoDB for data persistence.

2. **Daily Sales Summary**:

   - A cron job generates a daily sales report at 12:00 PM.
   - Sales report includes total sales amount and item-level sales data.

3. **Email Notification**:

   - RabbitMQ producer publishes sales summaries to a queue.
   - A separate consumer service processes the queue and sends emails.

4. **Dockerized Setup**:
   - Includes MongoDB, RabbitMQ, and the NestJS application in a `docker-compose` setup.

---

## Project Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/invoice-management-system.git
   cd invoice-management-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the following variables:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   RABBITMQ_URL=amqp://rabbitmq
   MONGODB_URL=mongodb://mongodb:27017/invoice-db
   ```

---

## Running the Services

### Using Docker Compose

1. Build the Docker images:

   ```bash
   docker-compose build
   ```

2. Start the services:

   ```bash
   docker-compose up
   ```

3. Access the services:
   - **NestJS API**: [http://localhost:3000](http://localhost:3000)
   - **RabbitMQ Management Console**: [http://localhost:15672](http://localhost:15672)
     - Default credentials: `guest/guest`

---

## API Endpoints

### Invoice Service

- **Create Invoice**: `POST /invoices`

  ```json
  {
    "customer": "John Doe",
    "amount": 200,
    "reference": "INV1234",
    "date": "2025-01-14",
    "items": [
      { "sku": "ITEM001", "qt": 2 },
      { "sku": "ITEM002", "qt": 5 }
    ]
  }
  ```

- **Get Invoice by ID**: `GET /invoices/:id`

- **List All Invoices**: `GET /invoices`
  - Optional Query Parameters: `startDate`, `endDate`

---

## Testing

1. Run unit tests:

   ```bash
   npm run test
   ```

2. Run integration tests:
   ```bash
   npm run test:e2e
   ```

---

## Additional Notes

- **Email Sending**:
  - Email functionality can be mocked or use real credentials (e.g., SendGrid, Gmail).
- **Cron Job**:
  - Generates a sales report at 12:00 PM daily and sends it to the RabbitMQ queue.
- **RabbitMQ Consumer**:
  - Processes messages from the `daily_sales_report` queue and sends emails.

---

## Cleanup

To stop and remove containers, networks, and volumes:

```bash
docker-compose down
```
