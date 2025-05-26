# Offline-first chat app MVP

## Approach

I've focused on implementing an architecture suitable for an offline-first application. The FE uses IndexedDB as a source of truth, to ensure data is persisted while network is unavailable. While online, requests are made to sync this DB with the server. 

React-query is used to make network requests - it will automatically pause outgoing requests when network is unavailable, and resume them once network returns. This is great however the outgoing requests are not persisted anywhere. The next step would be to add a service worker to handle queueing up requests when offline - this could be achieved using the Background Sync API.

I have forgone the implementation of any tests in favour of delivering a working MVP. The testing approach I would take is:

- A suite of server integration tests using `supertest` which run at the controller level, with a local DB.
- A suite of front-end tests using `react-testing-library` using a mocked out API
- Potentially some E2E tests using `Cypress` to test core flows

## Local setup

### Dependencies

- Docker
- nvm (optional, recommended)

### Node

- Only tested with Node v20 - support with other versions unverified.  If you have nvm, run `nvm use` to automatically install and use a supported node version.
- Run `npm i` from the root directory
- Run `npm run build -w=@chat-app/common` to build common package

### Database

- Make a copy of `.env.example` in the `packages/server` directory and name it `.env`
- Start local DB by running `npm run db:dev`
  - This will start a Postgres DB in a docker container and run the Prisma migrations against it

### Running the app

- To start the server, run `npm run dev -w=@chat-app/server`
- In a separate terminal, to start the client run `npm run dev -w=@chat-app/client`

