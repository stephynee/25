const app = require('./app');

const port = 8080;
const ip = 'localhost';

app.listen(port, ip, () => console.log('server running'));
