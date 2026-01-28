export interface ClientCountry {
    id: number;
    name: string;
    nationality: string;
    phone_code: string;
    flag: string;
    phone_number_limit: number;
}

export interface ClientDepartment {
    id: number;
    name: string;
}

export interface ClientSubscription {
    id: number;
    user: {
        id: number;
        name: string;
        phone_code: string;
        phone: string;
    };
    package: {
        id: number;
        type: string;
        name: string;
        price: number;
        connection_count: number;
        is_active: number;
        ar: Record<string, string>;
        en: Record<string, string>;
        fr: Record<string, string>;
        ur: Record<string, string>;
        tr: Record<string, string>;
        sw: Record<string, string>;
        bn: Record<string, string>;
        si: Record<string, string>;
    };
    start_date: string;
    end_date: string;
    remaining_duration: string;
    is_canceled: boolean;
}

export interface Client {
    id: number;
    full_name: string;
    phone: string;
    phone_code: string;
    email: string;
    country: ClientCountry;
    image: string;
    user_type: 'client';
    is_ban: number;
    is_completed_data: number;
    departments: ClientDepartment[];
    nationalities: ClientCountry[];
    histroy_subscriptions: ClientSubscription[];
}

export interface ClientFormData {
    full_name: string;
    email: string;
    phone: string;
    phone_code: string;
    country_id: number | string;
    password?: string;
    _method?: 'put';
}
