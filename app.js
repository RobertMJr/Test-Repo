'use strict';

// load modules
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const courseRouter = require('./routes/course');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

const { sequelize } = require('./models');

// create the Express app
const app = express();

// Enable All CORS Requests
app.use(cors());


// Serve static files from /build
app.use(express.static(path.join(__dirname, '/build')));

// Expecting requests coming in as JSON
app.use(express.json());
app.use('/', indexRouter);
// Use the routes inside the user.js file when a request starts with the path /api
app.use('/api/users', userRouter);
app.use('/api/courses', courseRouter);

// setup morgan which gives us http request logging
app.use(morgan('dev'));

(async () => {
  try {
    // Test the connection to the db
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
    // Sync the models
    await sequelize.sync();
    console.log('Synchronizing the models with the database...');
  } catch(error) {
    console.error('Error connecting to the database:', error);
  }
}) ();

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }
  // If there is a Sequelize Validation or Unique Constraint Error, send a response with status 400 and the collection of errors
  if(err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(err => err.message);
    res.status(400).json({ errors });
  } else {
    res.status(err.status || 500).json({
      message: err.message,
      error: {},
    });
  }
});


// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
