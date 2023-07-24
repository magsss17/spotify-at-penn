const webapp = require('./server');

const port = 8000;
// start the web server
webapp.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Server running on port', port);
});
