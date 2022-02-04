import express from 'express';

import routes from './routes';

const server = express();
const PORT = process.env.PORT || 3001;

server.use(express.json());

server.use('/api', routes);

server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
