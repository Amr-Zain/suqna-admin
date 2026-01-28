export interface Qualification {
    id: number
    name: string
    ar: {
        name: string | null
    }
    en: {
        name: string | null
    }
    fr?: {
        name: string | null
    }
    ur?: {
        name: string | null
    }
    tr?: {
        name: string | null
    }
    sw?: {
        name: string | null
    }
    bn?: {
        name: string | null
    }
    si?: {
        name: string | null
    }
}

export interface QualificationFormData {
    name_ar: string
    name_en: string
    name_fr?: string
    name_ur?: string
    name_tr?: string
    name_sw?: string
    name_bn?: string
    name_si?: string
    _method?: 'put'
}
