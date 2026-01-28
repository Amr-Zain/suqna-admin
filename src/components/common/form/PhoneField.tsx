'use client'

import { useEffect, useMemo, useRef } from 'react'
import {
  useFormContext,
  useWatch,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useTranslation } from 'react-i18next'

import { CountryDetails } from '@/types/api/country'
import useFetch from '@/hooks/UseFetch'
import { ApiResponse } from '@/types/api/http'
import { Image } from '@/types/api/http'
import { getQueryKeys } from '@/util/queryKeysFactory'

interface CountryCodeData {
  id: number
  name: string
  phone_code: string
  flag: Image
  phone_limit: number
  phone_starting_number: number
}

export interface PhoneNumberProps<T extends FieldValues> {
  control: Control<T>
  phoneCodeName: FieldPath<T>
  phoneNumberName: FieldPath<T>
  countries?: CountryCodeData[]
  currentPhoneLimit?: number | null
  isLoading?: boolean
  disabled?: boolean
  codeClass?: string
  phoneClass?: string
  setCurrentPhoneLimit: (value: number | null) => void
  setPhoneStartingNumber: (value: number | null) => void
}

function PhoneField<T extends FieldValues>({
  control,
  phoneCodeName,
  phoneNumberName,
  currentPhoneLimit,
  isLoading = false,
  codeClass = '',
  phoneClass = '',
  disabled = false,
  countries: countriesProp,
  setCurrentPhoneLimit,
  setPhoneStartingNumber
}: PhoneNumberProps<T>) {
  const { t } = useTranslation()
  const { setValue, trigger, formState, clearErrors, getValues } = useFormContext<T>()

  // Track if this is the initial mount
  const isInitialMount = useRef(true)

  // Fetch countries (optional; we'll fallback to the prop if fetch isn't ready)
  const { data: fetchedCountries } = useFetch<
    ApiResponse<CountryDetails[]>,
    CountryCodeData[]
  >({
    queryKey: getQueryKeys.getFiltered('countries', { pagination: false }),
    endpoint: 'countries_without_pagination',
    general: false,
    select: (res) =>
      res.data.map(
        (item) =>
          ({
            id: item.id,
            name: item.name,
            flag: item.flag,
            phone_code: item.phone_code,
            phone_limit: item.phone_number_limit,
            phone_starting_number: (item as any).phone_starting_number, // Cast to any if property missing in CountryDetails
          }) as any,
      ),
    staleTime: 180_000,
  })

  // Prefer fetched data, fallback to provided prop, else empty
  const countries: CountryCodeData[] = useMemo(
    () => fetchedCountries ?? countriesProp ?? [],
    [fetchedCountries, countriesProp],
  )

  // Watch the selected phone code
  const phoneCodeWatcher = useWatch({
    control,
    name: phoneCodeName,
  })

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false

      if (phoneCodeWatcher && countries.length) {
        const selected = countries.find(
          (c) => String(c.phone_code) === String(phoneCodeWatcher),
        )
        if (selected) {
          setCurrentPhoneLimit?.(selected.phone_limit)
          setPhoneStartingNumber?.(selected.phone_starting_number)
        }
      }
      return
    }

    if (!countries.length) return

    if (phoneCodeWatcher) {
      const selected = countries.find(
        (c) => String(c.phone_code) === String(phoneCodeWatcher),
      )

      if (selected) {
        setCurrentPhoneLimit?.(selected.phone_limit)
        setPhoneStartingNumber?.(selected.phone_starting_number)

        const currentPhone = (getValues(phoneNumberName) as string) || ''
        const nextPhone =
          selected.phone_starting_number != null
            ? selected.phone_starting_number.toString() + currentPhone.slice(1)
            : currentPhone

        setValue(phoneNumberName, nextPhone as any, {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: false, // important – don't auto-trigger validation here
        })

        clearErrors(phoneNumberName)
        return
      }
    }

    // no phone code selected
    setCurrentPhoneLimit?.(null)
    setPhoneStartingNumber?.(null)

    const isDirty =
      formState.dirtyFields[
      phoneNumberName as keyof typeof formState.dirtyFields
      ]

    if (isDirty) {
      setValue(phoneNumberName, '' as any, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      })
      clearErrors(phoneNumberName)
    }
  }, [
    phoneCodeWatcher,
    countries,
    setCurrentPhoneLimit,
    setPhoneStartingNumber,
    setValue,
    trigger,
    phoneNumberName,
    formState.dirtyFields,
  ])


  return (
    <div className="flex gap-2" dir="ltr">
      <FormField<T>
        control={control}
        name={phoneCodeName}
        render={({ field }) => (
          <FormItem className="w-28">
            <Select
              onValueChange={field.onChange}
              value={field.value as unknown as string}
              disabled={isLoading || disabled}
            >
              <FormControl>
                <SelectTrigger
                  className={`text-text p-1 sm:p-4 w-28 ${codeClass}`}
                  dir={t('lang')}
                >
                  <SelectValue placeholder={t('Form.labels.phoneCode')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent dir={t('lang')}>
                {countries.map((country) => (
                  <SelectItem key={country.id} value={`${country.phone_code}`}>
                    <div className="flex items-center gap-2">
                      {country.flag?.url && (
                        <span role="img" aria-label="flag">
                          <img
                            src={country.flag.url}
                            alt={`${country.name} flag`}
                            width={20}
                            height={20}
                            className="size-5"
                          />
                        </span>
                      )}
                      <span className="ms-2">{`+${country.phone_code}`}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField<T>
        control={control}
        name={phoneNumberName}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input
                dir={t('lang')}
                type="number"
                {...field}
                className={phoneClass}
                onChange={(e) => field.onChange(e)}
                value={(field.value as string) || ''}
                disabled={isLoading || disabled}
                placeholder={
                  currentPhoneLimit
                    ? t('labels.phoneNumberWithLimit', {
                      limit: currentPhoneLimit,
                    })
                    : t('Form.placeholders.phoneNumber')
                }
                inputMode="tel"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}

export default PhoneField
