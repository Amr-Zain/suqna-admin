export interface RegionDetails {
    id: number;
    city_id: number;
    name: string;
    translations: {
        en: {
            name: string;
        };
        ar: {
            name: string;
        };
    };
    created_at: string;
    updated_at: string;
}
