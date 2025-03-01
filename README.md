# HomeFax Backend

This is the backend API for the HomeFax platform, a blockchain-based property history solution.

## Technology Stack

- NestJS framework
- TypeORM for database interactions
- PostgreSQL database
- JWT authentication
- Swagger API documentation
- Blockchain integration with ethers.js
- IPFS integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
5. Update the environment variables in the `.env` file as needed
6. Create a PostgreSQL database and update the database connection details in the `.env` file

### Running the Application

To start the development server:

```bash
npm run start:dev
# or
yarn start:dev
```

The API will be available at [http://localhost:3001](http://localhost:3001).

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

To run the production build:

```bash
npm run start:prod
# or
yarn start:prod
```

## Project Structure

```
backend/
├── src/
│   ├── auth/           # Authentication module
│   ├── user/           # User module
│   ├── property/       # Property module
│   ├── report/         # Report module
│   ├── blockchain/     # Blockchain integration
│   ├── database/       # Database configuration and migrations
│   ├── common/         # Common utilities and middleware
│   ├── app.module.ts   # Main application module
│   ├── app.controller.ts # Main application controller
│   ├── app.service.ts  # Main application service
│   └── main.ts         # Entry point
├── test/               # Tests
├── .env.example        # Example environment variables
├── nest-cli.json       # NestJS CLI configuration
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:

```
http://localhost:3001/api/docs
```

This provides an interactive interface to explore and test the API endpoints.

## Database Migrations

To generate a new migration:

```bash
npm run migration:generate -- MigrationName
# or
yarn migration:generate MigrationName
```

To run migrations:

```bash
npm run migration:run
# or
yarn migration:run
```

To revert the last migration:

```bash
npm run migration:revert
# or
yarn migration:revert
```

## Seeding the Database

To seed the database with initial data:

```bash
npm run seed
# or
yarn seed
```

## Testing

To run tests:

```bash
# Unit tests
npm run test
# or
yarn test

# e2e tests
npm run test:e2e
# or
yarn test:e2e

# Test coverage
npm run test:cov
# or
yarn test:cov
```

## Available Scripts

- `npm run start` - Starts the server
- `npm run start:dev` - Starts the server in development mode with hot reload
- `npm run start:debug` - Starts the server in debug mode
- `npm run start:prod` - Starts the server in production mode
- `npm run build` - Builds the application
- `npm run format` - Formats code with Prettier
- `npm run lint` - Lints the code
- `npm test` - Runs tests
- `npm run test:watch` - Runs tests in watch mode
- `npm run test:cov` - Runs tests with coverage
- `npm run test:debug` - Runs tests in debug mode
- `npm run test:e2e` - Runs end-to-end tests

## Learn More

For more information about the HomeFax platform, see the main [README.md](../README.md) file.