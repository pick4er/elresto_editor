import fs from 'fs';
import request from 'request';
import mime from 'mime/lite';

/* GLOBAL DEV_SERVER_PORT PUBLIC_PATH */
function getDevAsset(ctx) {
  if (DEV_SERVER_PORT) {
    const response = request(`http://localhost:${DEV_SERVER_PORT}${PUBLIC_PATH}${ctx.filename}`)
    ctx.body = response;
    ctx.status = 200;
  } else {
    /* eslint-disable-next-line no-console */
    console.warn('NO DEV_SERVER_PORT');
  }
}

function getProdAsset(ctx) {
  ctx.body = fs.createReadStream(`build/${ctx.filename}`);
  ctx.status = 200
}

function getUnknownAsset(ctx) {
  ctx.body = `No ${ctx.filename} found`;
  ctx.status = 404;
}

function getMime(filename) {
  return mime.getType(filename) || 'text/plain';
}

function getAssets(ctx) {
  ctx.set({ 'Content-Type': getMime(ctx.filename) });

  if (process.env.NODE_ENV === 'development') {
    getDevAsset(ctx);
  } else if (process.env.NODE_ENV === 'production') {
    getProdAsset(ctx);
  } else {
    getUnknownAsset(ctx);
  }
}

export default getAssets;
