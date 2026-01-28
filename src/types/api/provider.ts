export interface Provider {
    id: number
    full_name: string
    email: string
    email_verified_at: string | null
    phone_code: string
    phone: string
    phone_verified_at: string | null
    is_admin_active_user: number
    is_ban: number
    ban_reason: string | null
    reset_code: string | null
    user_type: 'worker' | 'company'
    gender: string | null
    locale: string
    allow_notification: string
    is_completed_data: number
    deleted_at: string | null
    created_at: string
    updated_at: string
    role_id: number | null
    country_id: number
    city_id: number
    workers_count_from?: number
    workers_count_to?: number
    commercial_number?: string
    experience_from?: number
    experience_to?: number
    qualification_id?: number
    departments?: { id: number }[]
}

export interface ProviderFormData {
    full_name: string
    email: string
    phone_code: string
    phone: string
    country_id: string | number
    city_id: string | number
    user_type: 'worker' | 'company'
    password?: string
    workers_count_from?: string
    workers_count_to?: string
    commercial_number?: string
    experience_from?: string
    experience_to?: string
    qualification_id?: string | number
    departments?: number[] | string[]
    _method?: 'put'
}
