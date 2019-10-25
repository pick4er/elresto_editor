
/* global BACKEND_URL */
const methodsWithBody = [
  'POST', 'PUT', 'DELETE', 'PATCH',
]

export function getFullUrl(url, isFullUrl) {
  return isFullUrl ? url : `${BACKEND_URL}/${url}`;
}

export function prepareBody(body, method) {
  if (!methodsWithBody.includes(method)) {
    return;
  }

  return JSON.stringify({ ...body });
}
