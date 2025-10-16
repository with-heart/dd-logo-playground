import { createLoader } from 'nuqs/server'
import { urlSearchParamsParsers, urlSearchParamsUrlKeys } from '.'

export const loadSearchParams = createLoader(urlSearchParamsParsers, {
  urlKeys: urlSearchParamsUrlKeys,
})
