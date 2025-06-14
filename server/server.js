const app = require('./app');
const http = require('http');
const socketService = require('./services/socketService');
const logger = require('./config/logger');

const PORT = process.env.PORT || 3004;

const server = http.createServer(app);

// Initialize Socket.IO
socketService.init(server);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});