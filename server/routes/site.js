import fs from 'fs'
import path from 'path'

function getSiteFile(siteName) {
  const filename = `${siteName}.json`
  console.log('filename:',filename)
  const rawFile = fs.readFileSync(
    path.join(process.cwd(), 'public', filename),
    { encoding: 'utf-8' },
  );
  return JSON.parse(rawFile);
}

function getSite(ctx) {
  const { name } = ctx.query

  try {
    const { map, data, components } = getSiteFile(name)

    ctx.status = 200
    ctx.body = JSON.stringify({
      map,
      data,
      components,
      status: 'ok',
    })
  } catch (e) {
    ctx.status = 200
    ctx.body = 'Site not found'
  }
}

export default getSite;
export { getSiteFile };
