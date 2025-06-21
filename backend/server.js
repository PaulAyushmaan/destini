const http = require('http');
const app = require('./app');
const { initializeSocket } = require('./socket');
const port = process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);

if (process.env.NODE_ENV !== 'production') {
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})};