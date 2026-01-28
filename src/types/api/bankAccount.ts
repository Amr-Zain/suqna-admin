export interface BankAccountTranslations {
    bank_name: string
    account_owner: string
}

export interface BankAccount {
    id: number
    iban: string
    translations: {
        en: BankAccountTranslations
        ar: BankAccountTranslations
    }
}

export interface BankAccountDetails extends BankAccount {
    created_at?: string
    updated_at?: string
}

export interface BankAccountFormData {
    iban: string
    bank_name_ar: string
    bank_name_en: string
    account_owner_ar: string
    account_owner_en: string
}
