import { useQueryStates } from 'nuqs'
import { urlSearchParamsParsers, urlSearchParamsUrlKeys } from './parsers'

export const useSearchParams = () =>
  useQueryStates(urlSearchParamsParsers, {
    urlKeys: urlSearchParamsUrlKeys,
    shallow: false,
  })
