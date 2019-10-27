import Koa from 'koa';
import Router from 'koa-router';

import helmet from './handlers/helmet';
import errors from './handlers/errors';
import logger from './handlers/logger';
import bodyParser from './handlers/bodyParser';
import filename from './handlers/filename';
import useragent from './handlers/useragent';
import favicon from './handlers/favicon';

import assets from './routes/assets';
import client from './routes/client';
import site from './routes/site';

const app = new Koa();
const router = new Router();

app.use(helmet);
app.use(errors);
app.use(logger);
app.use(bodyParser);
app.use(filename);
app.use(useragent);
app.use(favicon);

/* global PUBLIC_PATH */
router
  .get(`${PUBLIC_PATH}*`, assets)
  .get('/site', site)
  .get('*', client);

app.use(router.routes());

export default app;
