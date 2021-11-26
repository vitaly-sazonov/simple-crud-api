const run = require('./server');

require('dotenv').config();
const PORT = process.env.PORT || 3000;

run(PORT, () => console.log(`Server is running on port ${PORT}...`));
