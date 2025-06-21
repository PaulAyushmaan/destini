const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 4000;

const server = http.createServer(app);
initializeSocket(server);

const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

server.listen(port, host, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`Listening on http://${host}:${port}`);
  
  // Special message for local development
  if (process.env.NODE_ENV !== 'production') {
    console.log('\n\x1b[36m%s\x1b[0m', 'Local Development Tips:'); // Cyan color
    console.log('- Use http://localhost:3000 in your browser');
    console.log('- Frontend should connect to http://localhost:4000');
    console.log('- Hot-reload should work normally\n');
  }
});