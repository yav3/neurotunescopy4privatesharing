import http from "http";
import app from "./app.js";

const PORT = Number(process.env.PORT || 8080);
const server = http.createServer(app);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[api] listening on :${PORT}`);
});