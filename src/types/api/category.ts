import { Image } from "./http"

export interface Category {
    id: number
    status: boolean
    has_location: boolean
    title: string
    description: string
    type?: string
    icon: Image | null
    image: Image | null
    parent_id?: number | null
    children?: Category[]
    translations?: {
        en: {
            title: string
            description: string
        }
        ar: {
            title: string
            description: string
        }
    }
}

export interface CategoryFormData {
    en: {
        title: string
        description: string
    }
    ar: {
        title: string
        description: string
    }
    icon?: any
    image?: any
    has_location: boolean
    subs?: any[]
    _method?: string
}
