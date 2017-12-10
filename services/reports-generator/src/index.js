import express from 'express';
import logger from 'morgan';
import config from './config';
import taskHelper from './helpers/task.helper';

const app = express();

app.use(logger('dev'));

taskHelper.listen();

app.listen(config.port);