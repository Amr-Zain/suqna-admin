export interface Bannar {
    id: number
    start_date: string
    end_date: string
    image: string
    created_at: string
}

export interface BannarFormData {
    start_date: string
    end_date: string
    image: any // For uploader
    _method?: 'put'
}
