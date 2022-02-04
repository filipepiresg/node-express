import express from "express";

import routes from "./routes";

const server = express();
const PORT = process.env.PORT || 3001;

server.use(express.json());

server.get("/api", routes);

server.listen(PORT, () => {
  console.log(`Server starded on port ${PORT}`);
});
