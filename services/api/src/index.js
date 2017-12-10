import express from 'express';
import logger from 'morgan';
import httpStatus from 'http-status';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressValidation from 'express-validation';
import config from './config';
import routes from './routes/index.route';

const app = express();

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = httpStatus.NOT_FOUND;
  next(err);
});

app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    err.message = err.errors.map(error => error.messages.join('. ')).join(' and ');
  }
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).send({ error: err.message });
});

app.listen(config.port);