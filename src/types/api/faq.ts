export type FAQLocaleBlock = {
    question: string | null
    answer: string | null
}

export type FAQDetails = {
    id: number
    question: string
    answer: string
    ar: FAQLocaleBlock
    en: FAQLocaleBlock
    fr: FAQLocaleBlock
    ur: FAQLocaleBlock
    tr: FAQLocaleBlock
    sw: FAQLocaleBlock
    bn: FAQLocaleBlock
    si: FAQLocaleBlock
}

export interface FAQFormData {
    question_ar?: string
    question_en?: string
    question_fr?: string
    question_ur?: string
    question_tr?: string
    question_sw?: string
    question_bn?: string
    question_si?: string
    answer_ar?: string
    answer_en?: string
    answer_fr?: string
    answer_ur?: string
    answer_tr?: string
    answer_sw?: string
    answer_bn?: string
    answer_si?: string
    _method?: 'put'
}
