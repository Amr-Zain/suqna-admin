import { ApiResponse } from "./http";

export interface Permission {
    id: number;
    icon: string | null;
    title: string;
    url: string;
    back_route_name: string;
    front_route_name?: string;
    title_ar?: string;
    title_en?: string;
}

export interface Role {
    id: number;
    name: string;
    permission?: Permission[];
    permissions?: Permission[];
    name_ar?: string;
    name_en?: string;
    created_at?: string;
}

export interface RoleFormData {
    id?: number;
    'en[name]': string;
    'ar[name]': string;
    permissions?: number[];
    role_id?: number;
    _method?: 'put';
    name_en?: string;
    name_ar?: string;
}

export type RoleListResponse = ApiResponse<Role[]>;
export type RoleDetailsResponse = ApiResponse<Role>;

export interface RoleDetails extends Role {
    permissions: Permission[];
    name_ar: string;
    name_en: string;
    permission: Permission[];
}

export interface CategorizedPermissions {
    [category: string]: Permission[];
}

export type CategorizedPermissionsResponse = ApiResponse<CategorizedPermissions>;
