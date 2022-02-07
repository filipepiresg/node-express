import cors from 'cors';
import express, { Application } from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { errorHandler } from './middlewares/error';
import { sequelize } from './models';
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

sequelize.sync();

server.use('/api/v1', routes);

server.use(errorHandler);

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
