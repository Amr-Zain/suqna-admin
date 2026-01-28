import { Image } from "./http"

export interface Country {
  id: number
  name: string
  nationality: string
  phone_code: string
  phone_number_limit: number
  flag: Image | null
}

export type LocaleBlock = {
  name: string | null
  nationality: string | null
  short_name: string | null
}

export type CountryDetails = {
  id: number
  name: string
  nationality: string
  phone_code: string
  phone_number_limit: number
  national_id_limit: number
  flag: Image | null
  ar: LocaleBlock
  en: LocaleBlock
  fr: LocaleBlock
  ur: LocaleBlock
  tr: LocaleBlock
  sw: LocaleBlock
  bn: LocaleBlock
  si: LocaleBlock
  created_at: string
}

export interface CountryFormData {
  phone_code: string
  phone_number_limit: number
  national_id_limit: number
  flag: any
  name_ar?: string
  name_en?: string
  name_fr?: string
  name_ur?: string
  name_tr?: string
  name_sw?: string
  name_bn?: string
  name_si?: string
  nationality_ar?: string
  nationality_en?: string
  nationality_fr?: string
  nationality_ur?: string
  nationality_tr?: string
  nationality_sw?: string
  nationality_bn?: string
  nationality_si?: string
  short_name_ar?: string
  short_name_en?: string
  short_name_fr?: string
  short_name_ur?: string
  short_name_tr?: string
  short_name_sw?: string
  short_name_bn?: string
  short_name_si?: string
  _method?: 'put'
}
