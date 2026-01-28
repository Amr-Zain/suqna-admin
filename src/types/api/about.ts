export type AboutLocaleBlock = {
    text: string | null
}

export type AboutDetails = {
    id: number
    text: string
    ar: AboutLocaleBlock
    en: AboutLocaleBlock
    fr: AboutLocaleBlock
    ur: AboutLocaleBlock
    tr: AboutLocaleBlock
    sw: AboutLocaleBlock
    bn: AboutLocaleBlock
    si: AboutLocaleBlock
}

export interface AboutFormData {
    text_ar?: string
    text_en?: string
    text_fr?: string
    text_ur?: string
    text_tr?: string
    text_sw?: string
    text_bn?: string
    text_si?: string
}
