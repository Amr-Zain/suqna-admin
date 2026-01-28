'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext, useFormState, useWatch } from 'react-hook-form'
import { Check } from 'lucide-react'
import EditorField from './Editor/EditorField'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useTranslation } from 'react-i18next'

export interface MultiLangFieldProps<T extends FieldValues> {
  control: Control<T>
  name: string // Base name (e.g., "title")
  type?: 'input' | 'editor'
  label?: string
  placeholder?: string
  languages?: Array<string>
  defaultLanguage?: string
  disabled?: boolean
  className?: string
}

const defaultLanguages = [
  'en' ,
  'ar' ,
  'fr' ,
  'ur' ,
  'tr' ,
  'sw' ,
  'bn' ,
  'si' ,
]

function MultiLangField<T extends FieldValues>({
  control,
  name,
  type = 'input',
  label,
  placeholder,
  languages = defaultLanguages,
  defaultLanguage,
  disabled = false,
  className = '',
}: MultiLangFieldProps<T>) {
  const { t } = useTranslation()
  const [currentLang, setCurrentLang] = useState<number>(0)

  // Watch all language fields to show completion status
  const watchedFields = languages.map((lang) =>
    useWatch({
      control,
      name: `${name}_${lang}` as FieldPath<T>,
    }),
  )

  const context = useFormContext<T>()
  const setValue = context?.setValue
  const getValues = context?.getValues

  const handleBlur = async (value: string, langKey: string) => {
    if (!value || !setValue || !getValues) return

    languages.forEach(async (targetLang) => {
      if (targetLang === langKey) return

      const targetFieldName = `${name}_${targetLang}` as FieldPath<T>
      const targetValue = getValues(targetFieldName)

      // Check if target is empty (including empty HTML tag for editor)
      const isEmpty =
        !targetValue || targetValue === '' || targetValue === '<p><br></p>'

      if (isEmpty) {
        try {
          const res = await fetch(
            'https://api-translation.front.aait-d.com/api/translate',
            {
              method: 'POST',
              body: JSON.stringify({ text: value, to: targetLang }),
              headers: { 'Content-Type': 'application/json' },
            },
          )
          const json = await res.json()
          if (json.data?.text) {
            setValue(targetFieldName, json.data.text, {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            })
          }
        } catch (err) {
          console.error('Translation error:', err)
        }
      }
    })
  }

  // Access form errors / submit count
  const { errors, submitCount } = useFormState({ control })

  // Keep stable list of field names
  const fieldNames = useMemo(
    () => languages.map((l) => `${name}_${l}` as FieldPath<T>),
    [languages, name],
  )

  // Refs for focusing each field (Input or Editor)
  const focusRefs = useRef<Record<string, HTMLElement | null>>({})

  // Default language selection
  useEffect(() => {
    if (defaultLanguage) {
      const langIndex = languages.findIndex(
        (lang) => lang === defaultLanguage,
      )
      if (langIndex !== -1) setCurrentLang(langIndex)
    }
  }, [defaultLanguage, languages])

  const fieldHasError = (fieldName: string) => {
    const err = (errors as any)?.[fieldName]
    return Boolean(err)
  }

  const getFieldStatus = (index: number) => {
    const val = watchedFields[index]
    return val && String(val).trim().length > 0
  }

  const focusField = (fieldName: string) => {
    const el = focusRefs.current[fieldName]
    // Try focusing the actual control
    if (el && typeof el.focus === 'function') {
      el.focus()
      return
    }
  }

  // When submitCount changes (a submit happened), if there are errors,
  // jump to the first invalid language tab and focus its field.
  useEffect(() => {
    if (!submitCount) return
    const firstInvalidIdx = fieldNames.findIndex((fn) =>
      fieldHasError(fn as string),
    )
    if (firstInvalidIdx !== -1) {
      setCurrentLang(firstInvalidIdx)
      // Slight delay to ensure the tab content is mounted/visible
      setTimeout(() => focusField(fieldNames[firstInvalidIdx] as string), 0)
    }
  }, [submitCount, fieldNames.join('|')])

  const onTabClick = (idx: number) => {
    setCurrentLang(idx)
    // Focus the field in that tab
    const fieldName = fieldNames[idx] as string
    setTimeout(() => focusField(fieldName), 0)
  }

  const renderField = (langKey: string, langIndex: number) => {
    const fieldName = `${name}_${langKey}` as FieldPath<T>
    const isActive = currentLang === langIndex

    return (
      <FormField
        key={langKey}
        control={control}
        name={fieldName}
        render={({ field }) => (
          <FormItem className={isActive ? '' : 'hidden'}>
            <FormControl>
              {type === 'editor' ? (
                // If EditorField forwards ref, this will focus correctly.
                // Otherwise we provide a hidden focus anchor as a fallback.
                <div className="contents">
                  <span
                    id={`mlf_${fieldName as string}_anchor`}
                    tabIndex={-1}
                    ref={(el) => {
                      // Fallback anchor to move screen reader / keyboard focus
                      focusRefs.current[fieldName as string] = el
                    }}
                  />
                  <EditorField
                    field={{
                      ...field,
                      onBlur: () => {
                        field.onBlur()
                        handleBlur(field.value, langKey)
                      },
                    }}
                    id={`mlf_${fieldName as string}`}
                    ariaInvalid={fieldHasError(fieldName as string)}
                    placeholder={'...'}
                    disabled={disabled}
                    focusApiRef={(api) => {
                      //@ts-ignore
                      focusRefs.current[fieldName] = api
                    }}
                  />
                </div>
              ) : (
                <Input
                  id={`mlf_${fieldName as string}`}
                  {...field}
                  onBlur={(e) => {
                    field.onBlur()
                    handleBlur(field.value, langKey)
                  }}
                  placeholder={
                    placeholder ||
                    `${label ?? name} (${t(`languages.${languages[langIndex]}`)})`
                  }
                  disabled={disabled}
                  value={field.value ?? ''}
                  aria-invalid={fieldHasError(fieldName) || undefined}
                  ref={(el) => {
                    focusRefs.current[fieldName] = el
                  }}
                />
              )}
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  return (
    <div className={`multi-lang-field-wrapper ${className}`}>
      {label && <FormLabel className="text-sm font-medium">{label}</FormLabel>}

      <div className="flex flex-wrap gap-2 mb-2 p-0 rounded-lg">
        {languages.map((lang, idx) => {
          const fieldName = `${name}_${lang}`
          const isActive = currentLang === idx
          const hasError = fieldHasError(fieldName)
          const completed = getFieldStatus(idx)

          // Variant priority: active => default, else if error => destructive, else outline
          const variant = isActive
            ? 'default'
            : hasError
              ? 'destructive'
              : 'outline'

          return (
            <Button
              key={`lang_btn_${lang}`}
              type="button"
              variant={variant}
              size="sm"
              onClick={() => onTabClick(idx)}
              disabled={disabled}
              aria-controls={`mlf_${fieldName}`}
              aria-selected={isActive}
              aria-invalid={hasError || undefined}
              className={`flex items-center gap-1 h-6 text-sm rounded-0`}
            >
              {completed && !hasError && (
                <Check className="w-3 h-3 text-green-600" />
              )}
              <span>{t(`languages.${lang}`)}</span>
            </Button>
          )
        })}
      </div>

      <div className="relative">
        {languages.map((lang, idx) => renderField(lang, idx))}
      </div>
    </div>
  )
}

export default MultiLangField
