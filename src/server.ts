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

server.use(morgan('tiny'));
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

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
