


export interface StaticPageTranslations {
    title: string
    content: string
}

export interface StaticPage {
    id: number
    type: string
    title: string
    content: string
    created_at: string
    updated_at: string
    translations?: {
        en: StaticPageTranslations
        ar: StaticPageTranslations
    }
}

export interface StaticPageFormData {
    title_ar: string
    title_en: string
    content_ar: string
    content_en: string
}
