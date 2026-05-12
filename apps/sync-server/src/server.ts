import http from 'node:http';
import pino from 'pino';
import { WebSocketServer } from 'ws';

const logger = pino({ name: 'ecosyt-sync-server' });
const port = process.env.SYNC_PORT ? Number(process.env.SYNC_PORT) : 4001;

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'sync-server' }));
    return;
  }

  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server });

wss.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'ready' }));

  socket.on('message', (message) => {
    const size = Array.isArray(message)
      ? message.reduce((total, chunk) => total + chunk.byteLength, 0)
      : message.byteLength;
    logger.info({ size }, 'ws message received');
  });
});

server.listen(port, () => {
  logger.info({ port }, 'sync-server listening');
});
