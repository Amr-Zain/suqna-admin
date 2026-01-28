import type {
  AxiosError,
  AxiosResponseHeaders,
  RawAxiosResponseHeaders,
} from 'axios'

// export interface ApiResponse<T = unknown,K extends string | number | symbol = string> {
//   data:  Record<K, T> &{
//     links?: {
//       first: string 
//       last: string 
//       prev: string | null 
//       next: string | null 
//     } 
//     meta?: Meta 
//   }
//   message: string 
//   status: 'success' | 'fail' | 'error' 
// }
export interface ApiResponse<T = unknown> {
  data: T
  message: string
  status: 'success' | 'fail' | 'error'
  meta?: Meta
  links?: Links
}


export type ApiErrorBody = ApiResponse<null>
export type ApiAxiosError = AxiosError<ApiErrorBody>

export interface NormalizedHttpError {
  status?: number
  statusText?: string
  message: string
  body?: ApiErrorBody
  url?: string
  headers?: RawAxiosResponseHeaders | AxiosResponseHeaders
}

export function isApiAxiosError(err: unknown): err is ApiAxiosError {
  return !!err && typeof err === 'object' && 'isAxiosError' in (err as any)
}

export function toNormalizedHttpError(err: unknown): NormalizedHttpError {
  if (isApiAxiosError(err)) {
    const res = err.response
    const body = res?.data
    const message = body?.message ?? err.message ?? 'Unexpected error'

    return {
      status: res?.status,
      statusText: res?.statusText,
      message,
      body,
      url: (res?.config as any)?.url || (res?.request as any)?.responseURL,
      headers: res?.headers,
    }
  }
  return {
    message:
      typeof err === 'object' &&
        err &&
        'message' in err &&
        typeof (err as any).message === 'string'
        ? (err as any).message
        : 'Unexpected error',
  }
}
export interface Links {
  first: string
  last: string
  prev: string | null
  next: string | null
}

export interface MetaLink {
  url: string | null
  label: string
  active: boolean
}

export interface Meta {
  current_page: number
  from: number
  last_page: number
  links: MetaLink[]
  path: string
  per_page: number
  to: number
  total: number
}
export interface Image {
  url: string | null
  path: string | null
}