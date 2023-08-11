import { isObject } from './typeof-fns';

type ParamsObject = Record<string, string>;

const paramRegx = /(:[\w\d]+)/g;

/**
 * Function to replace path params (:someParam) with real values when
 * using path constants as hrefs or via the `navigate` method of react router.
 * @param {string} path Path with dynamic params to replace.
 * @param {object} params Object with param [name, value] tuples. Names must match the param names in the path.
 * @param {object|string} [search] Optional string or object to add as query params to the end of the path.
 * @returns {string} Path with param replaced with values, and optionally a query string added.
 */
export function injectPathParams(
  path: string,
  params: ParamsObject,
  search?: ParamsObject | string
): string {
  const result = path.replace(paramRegx, (match) => {
    const key = match.replace(':', '');
    return params[key] ?? '';
  });
  // add query string if search params provided
  if (search) {
    const query = isObject(search)
      ? Object.entries(search).reduce((str, [key, value], idx) => {
          return `${str}${idx > 0 ? '&' : ''}${key}=${value}`;
        }, '')
      : search;
    return `${result}?${query}`;
  }

  return result;
}
