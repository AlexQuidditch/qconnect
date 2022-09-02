
import {
  stringify,
  type IStringifyOptions,
} from 'qs'

const queryOptions: IStringifyOptions = {
  arrayFormat: 'repeat',
  charset: 'utf-8',
}

  function getUrlWithParams(url: string, params?: Record<string, any>): string {
    const query = this.stringifyQuery(params)
    const result = [url, query].join('?')
    return query.length > 1 ? result : url
  }

  function stringifyQuery(obj: any): string {
    return stringify(obj, this.queryOptions)
  }