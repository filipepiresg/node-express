import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import cors from 'cors';
import express, { Application } from 'express';
import actuator from 'express-actuator';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './middlewares/error';
import { notFoundHandler } from './middlewares/notfound';
import routes from './routes';

const server: Application = express();
const PORT = process.env.PORT || 3001;

Sentry.init({
  dsn: 'https://26aaa50a5d64439b8ef72968e09aca8b@o1141891.ingest.sentry.io/6200648',
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({
      // to trace all requests to the default router
      app: server,
      // alternatively, you can specify the routes you want to trace:
      // router: someRouter,
    }),
    new RewriteFrames({
      root: global.__dirname,
    }),
  ],
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
server.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
server.use(Sentry.Handlers.tracingHandler());

server.use(cors());
server.use(express.json());
server.use(
  express.urlencoded({
    extended: true,
  })
);
server.use(
  actuator({
    basePath: '/management', // It will set /management/info instead of /info
    infoGitMode: 'full', // the amount of git information you want to expose, 'simple' or 'full',
    // infoBuildOptions: undefined, // extra information you want to expose in the build object. Requires an object.
    // infoDateFormat: undefined, // by default, git.commit.time will show as is defined in git.properties. If infoDateFormat is defined, moment will format git.commit.time. See https://momentjs.com/docs/#/displaying/format/.
    customEndpoints: [], // array of custom endpoints
  })
);

server.use(morgan('dev'));
server.use(express.static('public'));

server.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: '/swagger.json',
    },
  })
);

server.use('/api/v1', routes);

server.use(notFoundHandler);

server.use(errorHandler);

server.use(Sentry.Handlers.errorHandler());
server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
