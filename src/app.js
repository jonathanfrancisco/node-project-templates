const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
const httpErrors = require('http-errors');
const { Model } = require('objection');
require('express-async-errors');

const todosAPI = require('./api/todos');

const knex = require('./knex');
const config = require('./config');

Model.knex(knex);
const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(compression());
app.use(morgan('tiny'));

app.use(todosAPI);

app.use((req, res, next) => {
  next(httpErrors.NotFound('Route not found'));
});

// centralized-catch all unhandled errors here
app.use((err, req, res, next) => {
  if (!err) {
    next();
  }
  console.error(err);
  return res.status(err.status || 500).json({
    error:
      (!err.status || err.status === 500) && config.nodeEnv !== 'development'
        ? 'Internal Server Error'
        : err.message,
    statusCode: err.status || 500
  });
});

app.listen(config.port || 5000, () => {
  console.log(`server started listening on ${config.port || 5000}`);
});
