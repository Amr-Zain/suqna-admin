
export interface Filters {
  page?: string
  search?: string
  'filters[is_active]'?: string
  'filters[created_at]'?: string
  'sort[created_at]'?: string
}

export const toStr = (v: unknown): string | undefined =>
  v == null ? undefined : String(v);

export const searchParamsValidate = (search: Record<any, any>): Filters=> {
   return cleanObject({
     page: toStr(search.page),
     keyword: toStr(search.keyword),
     is_active: toStr(search.is_active),
     ['filters[created_at]']: toStr(search['filters[created_at]']),
     ['sort[created_at]']: toStr(search['sort[created_at]']),
   })
  }

export const cleanObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const cleanedEntries = Object.entries(obj).filter(
    ([key, value]) => value != null,
  )
  return Object.fromEntries(cleanedEntries) as Partial<T>
}