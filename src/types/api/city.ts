export interface CityTranslationBlock {
    name: string | null
}

export interface CityDetails {
    id: number
    name: string
    country: {
        id: number
        name: string
        nationality: string
    }
    // These might be present in show endpoint
    ar?: CityTranslationBlock
    en?: CityTranslationBlock
    fr?: CityTranslationBlock
    ur?: CityTranslationBlock
    tr?: CityTranslationBlock
    sw?: CityTranslationBlock
    bn?: CityTranslationBlock
    si?: CityTranslationBlock
}

export interface CityFormData {
    country_id: number | string
    name_ar?: string
    name_en?: string
    name_fr?: string
    name_ur?: string
    name_tr?: string
    name_sw?: string
    name_bn?: string
    name_si?: string
    _method?: 'put'
}
