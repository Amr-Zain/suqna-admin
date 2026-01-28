import { Filter } from '@/types/components/table'
import { FieldProp } from '@/types/components/form'
import { PickedAction } from '@/hooks/useStatusMutations'
import { digitsOnlyString, requiredNumber, requiredString, stringOrUidHashObject, TFn } from '@/lib/schema/validation'
import z from 'zod'
import {
    createActionColumn,
    imageColumn,
    textColumn,
    createdAtColumn,
    imageField,
} from '@/util/crudFactory'
import { ColumnDef } from '@tanstack/react-table'

// --- About Schema ---
export const makeAboutSchema = (t: TFn) => {
    return z.object({
        title_en: requiredString(t, t('Form.labels.titleEn'), 1, 100),
        title_ar: requiredString(t, t('Form.labels.titleAr'), 1, 100),
        description_en: requiredString(t, t('Form.labels.descriptionEn'), 1, 1000),
        description_ar: requiredString(t, t('Form.labels.descriptionAr'), 1, 1000),
        sub_title_en: requiredString(t, t('Form.labels.subTitleEn'), 1, 100),
        sub_title_ar: requiredString(t, t('Form.labels.subTitleAr'), 1, 100),
        sub_description_en: requiredString(t, t('Form.labels.subDescriptionEn'), 1, 1000),
        sub_description_ar: requiredString(t, t('Form.labels.subDescriptionAr'), 1, 1000),
        story_en: requiredString(t, t('Form.labels.storyEn'), 1, 2000),
        story_ar: requiredString(t, t('Form.labels.storyAr'), 1, 2000),
        vision_en: requiredString(t, t('Form.labels.visionEn'), 1, 1000),
        vision_ar: requiredString(t, t('Form.labels.visionAr'), 1, 1000),
        mission_en: requiredString(t, t('Form.labels.missionEn'), 1, 1000),
        mission_ar: requiredString(t, t('Form.labels.missionAr'), 1, 1000),
        image: stringOrUidHashObject(t),
    })
}
export type AboutFormData = z.infer<ReturnType<typeof makeAboutSchema>>

export const aboutFieldsBuilder = (t: any): FieldProp<AboutFormData>[] => [
    {
        type: 'multiLangField',
        name: 'title' as any,
        label: t('Form.labels.title'),
        placeholder: t('Form.placeholders.title'),
    },
    {
        type: 'multiLangField',
        name: 'sub_title' as any,
        label: t('Form.labels.subTitle'),
        placeholder: t('Form.placeholders.subTitle'),
    },
    {
        type: 'multiLangField',
        name: 'description' as any,
        label: t('Form.labels.description'),
        placeholder: t('Form.placeholders.description'),
        inputProps: { type: 'editor' } as any,
    },
    {
        type: 'multiLangField',
        name: 'sub_description' as any,
        label: t('Form.labels.subDescription'),
        placeholder: t('Form.placeholders.subDescription'),
        inputProps: { type: 'editor' } as any,
    },
    {
        type: 'multiLangField',
        name: 'story' as any,
        label: t('Form.labels.story'),
        placeholder: t('Form.placeholders.story'),
        inputProps: { type: 'editor' } as any,
    },
    {
        type: 'multiLangField',
        name: 'vision' as any,
        label: t('Form.labels.vision'),
        placeholder: t('Form.placeholders.vision'),
        inputProps: { type: 'editor' } as any,
    },
    {
        type: 'multiLangField',
        name: 'mission' as any,
        label: t('Form.labels.mission'),
        placeholder: t('Form.placeholders.mission'),
        inputProps: { type: 'editor' } as any,
    },
    imageField(t, 'image', 'About', 'Form.labels.image'),
]

// --- Our Principle Schema ---
export const makePrincipleSchema = (t: TFn) => {
    return z.object({
        title_en: requiredString(t, t('Form.labels.titleEn'), 1, 100),
        title_ar: requiredString(t, t('Form.labels.titleAr'), 1, 100),
        description_en: requiredString(t, t('Form.labels.descriptionEn'), 1, 1000),
        description_ar: requiredString(t, t('Form.labels.descriptionAr'), 1, 1000),
        icon: stringOrUidHashObject(t),
    })
}
export type PrincipleFormData = z.infer<ReturnType<typeof makePrincipleSchema>>

export const principleColumns = (
    open: (type: PickedAction | 'edit', row: any) => void,
): ColumnDef<any>[] => [
        imageColumn<any>('icon', 'table.columns.icon'),
        textColumn<any>('title', 'table.columns.title'),
        textColumn<any>('description', 'table.columns.description', {
            render: (value) => <div dangerouslySetInnerHTML={{ __html: value.getValue() }} />,
        }),
        createActionColumn('/about/principles', open, 'principles', { hasShow: false, hasEdit: true, hasDelete: true, isModalEdit: true }),
    ]
export const principleFieldsBuilder = (t: any): FieldProp<PrincipleFormData>[] => [
    {
        type: 'multiLangField',
        name: 'title' as any,
        label: t('Form.labels.title'),
        placeholder: t('Form.placeholders.title'),
    },
    {
        type: 'multiLangField',
        name: 'description' as any,
        label: t('Form.labels.description'),
        placeholder: t('Form.placeholders.description'),
        inputProps: { type: 'editor' } as any,
    },
    imageField(t, 'icon', 'OurPrinciple', 'Form.labels.icon'),
]

// --- Team Schema ---
export const makeTeamSchema = (t: TFn) => {
    return z.object({
        name: requiredString(t, t('Form.labels.name'), 1, 100),
        position: requiredString(t, t('Form.labels.position'), 1, 100),
        image: stringOrUidHashObject(t),
    })
}
export type TeamFormData = z.infer<ReturnType<typeof makeTeamSchema>>

export const teamColumns = (
    open: (type: PickedAction | 'edit', row: any) => void,
): ColumnDef<any>[] => [
        imageColumn<any>('image', 'table.columns.image'),
        textColumn<any>('name', 'table.columns.name'),
        textColumn<any>('position', 'table.columns.position'),
        createActionColumn('/about/team', open, 'team', { hasShow: false, hasEdit: true, hasDelete: true, isModalEdit: true }),
    ]

export const teamFieldsBuilder = (t: any): FieldProp<TeamFormData>[] => [
    {
        type: 'text',
        name: 'name',
        label: t('Form.labels.name'),
        placeholder: t('Form.placeholders.name'),
    },
    {
        type: 'text',
        name: 'position',
        label: t('Form.labels.position'),
        placeholder: t('Form.placeholders.position'),
    },
    imageField(t, 'image', 'Team', 'Form.labels.image'),
]

// --- Journey Schema ---
export const makeJourneySchema = (t: TFn) => {
    return z.object({
        title_en: requiredString(t, t('Form.labels.titleEn'), 1, 100),
        title_ar: requiredString(t, t('Form.labels.titleAr'), 1, 100),
        description_en: requiredString(t, t('Form.labels.descriptionEn'), 1, 1000),
        description_ar: requiredString(t, t('Form.labels.descriptionAr'), 1, 1000),
        year: requiredNumber(t, t('Form.labels.year'), 1900, 2100),
        icon: stringOrUidHashObject(t),
    })
}
export type JourneyFormData = z.infer<ReturnType<typeof makeJourneySchema>>

export const journeyColumns = (
    open: (type: PickedAction | 'edit', row: any) => void,
): ColumnDef<any>[] => [
        imageColumn<any>('icon', 'table.columns.icon'),
        textColumn<any>('title', 'table.columns.title'),
        textColumn<any>('description', 'table.columns.description', {
            render: (value) => <div dangerouslySetInnerHTML={{ __html: value.getValue() }} />,
        }),
        textColumn<any>('year', 'table.columns.year'),
        createActionColumn('/about/journey', open, 'journey', { hasShow: false, hasEdit: true, hasDelete: true, isModalEdit: true }),
    ]

export const journeyFieldsBuilder = (t: any): FieldProp<JourneyFormData>[] => [
    {
        type: 'multiLangField',
        name: 'title' as any,
        label: t('Form.labels.title'),
        placeholder: t('Form.placeholders.title'),
    },
    {
        type: 'multiLangField',
        name: 'description' as any,
        label: t('Form.labels.description'),
        placeholder: t('Form.placeholders.description'),
        inputProps: { type: 'editor' } as any,
    },
    {
        type: 'number',
        name: 'year',
        label: t('Form.labels.year'),
        placeholder: t('Form.placeholders.year'),
    },
    imageField(t, 'icon', 'Journey', 'Form.labels.icon'),
]
