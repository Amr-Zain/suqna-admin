import { Client } from "./client";
import { Category } from "./category";
import { CityDetails } from "./city";
import { CountryDetails } from "./country";
import { Image } from "./http";

export interface Ad {
    id: number;
    title: string;
    image: Image;
    price: number;
    views: number;
    category: Category;
    client: Client;
    phone_code: string;
    phone: string;
    status: 'approved' | 'pending' | 'rejected' | 'sold' | 'closed';
    show_phone: number | boolean;
    negotiable: number | boolean;
    end_date: string;
    premium_ad: number | boolean;
    premium_end_date: string | null;
    created_at?: string;
}

export interface AdMedia {
    id: number;
    image: Image;
}

export interface AdComment {
    id: number;
    commented_user: Client;
    comment: string;
    reports: any[];
    created_at: string;
    updated_at: string;
}

export interface AdRate {
    id: number;
    rate: number;
    status: boolean;
    user: Client | null;
}

export interface AdDetails extends Ad {
    description: string;
    address: string;
    lat: string | number;
    lng: string | number;
    media: AdMedia[];
    sub_category: Category | null;
    sub_sub_category: Category | null;
    city: CityDetails;
    region_id?: number;
    country: CountryDetails;
    comments_count: number;
    comments: AdComment[];
    rates_count: number;
    rates: AdRate[];
    updated_at: string;
}

export interface AdFormData {
    user_id: number;
    category_id: number;
    sub_category_id?: number;
    sub_sub_category_id?: number;
    city_id: number;
    region_id?: number;
    address: string;
    lat: string | number;
    lng: string | number;
    title: string;
    description: string;
    image?: any; // Main image
    price: number;
    phone_code: string;
    phone: string;
    show_phone: number | boolean;
    negotiable: number | boolean;
    media?: any[]; // Array of images
    _method?: 'put';
}
