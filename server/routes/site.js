import fs from 'fs'
import path from 'path'

const BLANK_SITE_FILE_NAME = '__protected_blank'

function get_site_file(siteName) {
  const filename = `${siteName}.json`

  const rawFile = fs.readFileSync(
    path.join(process.cwd(), 'public', filename),
    { encoding: 'utf-8' },
  );
  return JSON.parse(rawFile);
}

function get_site(ctx) {
  const { name } = ctx.query

  if (name === '__protected_blank') {
    ctx.status = 401
    ctx.body = JSON.stringify({ status: 'error' })

    return
  }

  try {
    const { map, data, components } = get_site_file(name)

    ctx.status = 200
    ctx.body = JSON.stringify({
      map,
      data,
      components,
      status: 'ok',
    })
  } catch (e) {
    const { map, data, components } = get_site_file(BLANK_SITE_FILE_NAME)

    ctx.status = 200
    ctx.body = JSON.stringify({
      map,
      data,
      components,
      status: 'new',
    })
  }
}

export default get_site;
export { get_site_file }
