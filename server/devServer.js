import Webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import config from '../webpack-configs/client/dev';

/* GLOBAL PUBLIC_PATH DEV_SERVER_PORT */
const options = {
  publicPath: PUBLIC_PATH,
  hot: true,
  host: 'localhost',
  port: DEV_SERVER_PORT,
  writeToDisk: false,
};

WebpackDevServer.addDevServerEntrypoints(config, options);
const compiler = Webpack(config);
const server = new WebpackDevServer(compiler, options);

export default server;

