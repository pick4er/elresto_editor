import fs from 'fs'
import path from 'path'

function update(siteName, fileData) {
  const filePath = path.join(process.cwd(), 'public', `${siteName}.json`)

  const fd = fs.openSync(filePath, 'r+')
  fs.ftruncateSync(fd)
  fs.appendFileSync(filePath, fileData, 'utf8')
}

function prepare_parts_of_file(map, data, components) {
  return JSON.stringify({
    map,
    data,
    components
  })
}

function update_site(ctx) {
  const {
    siteName,
    map,
    data,
    components,
  } = ctx.request.body

  const fileData = prepare_parts_of_file(map, data, components)

  try {
    update(siteName, fileData)

    ctx.status = 200
    ctx.body = 'ok'
  } catch (e) {
    console.log('e:', e)
    ctx.status = 401
    ctx.body = 'Fatal error'
  }
}

export default update_site
