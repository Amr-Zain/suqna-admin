import { ApiResponse } from "./http";

export interface Admin {
    id: number;
    full_name: string;
    image: string;
    email: string;
    phone_complete_form: string;
    is_admin_active_user: boolean;
    created_at: string;
    phone?: string;
    phone_code?: string;
    role_id?: number;
    role?: {
        id: number;
        name: string;
        permission?: any[];
    };
    country?: {
        id: number;
        name: string;
        nationality: string;
    };
    country_id?: number;
}

export interface AdminFormData {
    id?: number;
    full_name: string;
    email: string;
    phone_code: string;
    phone: string;
    password?: string;
    role_id: number | string;
    country_id?: number | string;
    image?: any;
    _method?: 'put';
}

export type AdminListResponse = ApiResponse<Admin[]>;
export type AdminDetailsResponse = ApiResponse<Admin>;
