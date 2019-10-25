import url from 'url';

export default async function getAssetFilename(ctx, next) {
  const path = decodeURI(
    url.parse(ctx.url).pathname,
  );

  /* eslint-disable-next-line prefer-destructuring */
  ctx.filename = path.split('/')[2];

  await next();
}
