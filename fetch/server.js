import request from 'request-promise';
import { getFullUrl, prepareBody } from './utils';

function getOptions(props) {
  const {
    headers,
    body,
    method,
    ...otherOptions
  } = props;

  return {
    headers: { ...headers },
    body: prepareBody(body, method),
    mode: 'cors',
    method,
    ...otherOptions,
  };
}

export default function api(url, props = {}) {
  const { isFullUrl = false } = props;

  const fullUrl = getFullUrl(url, isFullUrl);
  const options = getOptions(props);

  return request({
    url: fullUrl,
    ...options,
  });
}
