import { Image } from "./http";

export type DurationType = 'day' | 'month' | 'year';
export type PackageType = 'provider' | 'client' | string;

export interface Package {
    id: number;
    type: PackageType;
    name: string;
    price: number;
    duration: number;
    duration_type: DurationType;
    duration_translated: string;
    connection_count?: number;
    is_active: number;
    created_at?: string;
    translations?: { [key: string]: { name: string } };
}

export interface PackageDetails extends Package {
    // translations property is already included in Package if we make it optional there or strict here
    // But typically details has it.
}

export interface PackageFormData {
    id?: number;
    name_ar: string;
    name_en: string;
    name_fr?: string;
    name_ur?: string;
    name_tr?: string;
    name_sw?: string;
    name_bn?: string;
    name_si?: string;
    price: number;
    duration: number;
    duration_type: DurationType;
    connection_count?: number;
    type: PackageType;
    is_active: number;
    _method?: 'put';
}
