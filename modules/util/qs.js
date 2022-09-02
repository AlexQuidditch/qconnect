import { stringify } from 'qs'

const queryOptions = {
  arrayFormat: 'repeat',
  charset: 'utf-8',
}

function stringifyQuery(obj) {
  return stringify(obj, queryOptions)
}

export function getUrlWithParams(url, params) {
  const query = stringifyQuery(params)
  const result = [url, query].join('?')
  return query.length > 1 ? result : url
}