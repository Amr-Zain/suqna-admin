import { Image } from "./http"

export interface Slider {
    id: number
    image: Image
    is_active: boolean
    created_at: string
}

export type SliderFormData = {
    image: string | { url: string; path: string }
    status: boolean
}
