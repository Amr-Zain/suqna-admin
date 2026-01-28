import { Filter } from '@/types/components/table'
import { Bannar, BannarFormData } from '@/types/api/bannar'
import { FieldProp } from '@/types/components/form'
import { PickedAction } from '@/hooks/useStatusMutations'
import { TFn, msg, stringOrUidHashObject } from '@/lib/schema/validation'
import z from 'zod'
import {
    createActionColumn,
    textColumn,
    imageColumn,
} from '@/util/crudFactory'
import { ColumnDef } from '@tanstack/react-table'
import { formDateToYYYYMMDD } from '@/util/helpers'

export const bannarColumns = (
    open: (type: PickedAction | 'edit', row: Bannar) => void,
): ColumnDef<Bannar>[] => [
        textColumn<Bannar>('id', '#'),
        imageColumn<Bannar>('image', 'table.columns.image'),
        textColumn<Bannar>('start_date', 'table.columns.startDate'),
        textColumn<Bannar>('end_date', 'table.columns.endDate'),
        createActionColumn('/bannars', open as any, 'bannars', { isModalEdit: true, hasDelete: true, hasEdit: true, hasShow: false, entityName: 'bannars' }),
    ]

export const getBannarFilters = (t: TFn): Filter[] => [
    {
        id: 'start_date',
        title: t('Form.labels.startDate'),
        type: 'date',
    },
    {
        id: 'end_date',
        title: t('Form.labels.endDate'),
        type: 'date',
    },
]

export const fieldsBuilder = (t: TFn, watchValues?: any): FieldProp<BannarFormData>[] => [
    {
        type: 'imgUploader',
        name: 'image',
        label: t('Form.labels.image'),
        inputProps: {
            model: 'bannars',
        },
        span: 2,
    },
    {
        type: 'date',
        name: 'start_date',
        label: t('Form.labels.startDate'),
        placeholder: t('Form.placeholders.startDate'),
        inputProps: {
            disabledDates: {
                from: new Date(1900, 0, 1),
                to: new Date(new Date().setHours(0, 0, 0, 0) - 1),
            }
        }
    },
    {
        type: 'date',
        name: 'end_date',
        label: t('Form.labels.endDate'),
        placeholder: t('Form.placeholders.endDate'),
        inputProps: {
            disabledDates: {
                from: watchValues?.start_date ? new Date(watchValues.start_date) : new Date(1900, 0, 1),
                to: watchValues?.start_date ? undefined : new Date(new Date().setHours(0, 0, 0, 0) - 1),
            }
        }
    },
]

export const makeBannarSchema = (t: TFn) => {
    const requiredDate = (field: string) =>
        z.preprocess((arg) => {
            if (arg instanceof Date || (typeof arg === 'string' && arg.length > 0)) {
                return formDateToYYYYMMDD(arg as any);
            }
            return arg;
        }, z.string().min(1, msg.required(t, field)));

    return z.object({
        image: stringOrUidHashObject(t),
        start_date: requiredDate(t('Form.labels.startDate')),
        end_date: requiredDate(t('Form.labels.endDate')),
    }).refine((data) => {
        if (data.start_date && data.end_date) {
            return new Date(data.end_date) >= new Date(data.start_date);
        }
        return true;
    }, {
        message: t('Validation.startBeforeEnd'),
        path: ['end_date'],
    });
}
