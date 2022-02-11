const App = require('./core/App');
const addRoutes = require('./routes');
const DB = require('./db');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

const app = new App();
app.register('db', new DB());

const run = addRoutes(app).createServer.bind(app);

module.exports = run;
