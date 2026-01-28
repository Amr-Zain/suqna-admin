export type TermLocaleBlock = {
    title: string | null
    text: string | null
}

export type TermDetails = {
    id: number
    title: string
    text: string
    ar: TermLocaleBlock
    en: TermLocaleBlock
    fr: TermLocaleBlock
    ur: TermLocaleBlock
    tr: TermLocaleBlock
    sw: TermLocaleBlock
    bn: TermLocaleBlock
    si: TermLocaleBlock
}

export interface TermFormData {
    title_ar?: string
    title_en?: string
    title_fr?: string
    title_ur?: string
    title_tr?: string
    title_sw?: string
    title_bn?: string
    title_si?: string
    text_ar?: string
    text_en?: string
    text_fr?: string
    text_ur?: string
    text_tr?: string
    text_sw?: string
    text_bn?: string
    text_si?: string
    _method?: 'put'
}
