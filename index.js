if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const server = require('./server');
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('The CincyBrewScene server is running.');
});