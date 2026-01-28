export interface Subscription {
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
