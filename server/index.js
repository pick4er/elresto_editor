import app from './server';

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`App is listening on ${port} port`);
});

/* GLOBAL DEV_SERVER_PORT */
async function startDevServer() {
  await import('./devServer').then(({ default: devServer }) => {
    devServer.listen(DEV_SERVER_PORT);
  });
}

if (
  process.env.NODE_ENV === 'development'
  && DEV_SERVER_PORT
) {
  console.log('--- START DEV SERVER ---');
  startDevServer();
}
