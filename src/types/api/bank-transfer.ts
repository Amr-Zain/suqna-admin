import { Image } from "./http"

export interface BankTransfer {
    id: number
    user: {
        id: number
        full_name: string
        image: string | null
        email: string
        phone_code: string
        phone: string
        user_type: string
        is_active: number
        created_at: string
    }
    image: Image
    created_at: string
    updated_at: string
}
