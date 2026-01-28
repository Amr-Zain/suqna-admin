import { ActionIcon } from '@/components/common/table/ActionIcon'
import { Filter, RowAction } from '@/types/components/table'
import { ColumnDef } from '@tanstack/react-table'
import { Edit, Eye, Trash, Settings } from 'lucide-react'
import { getQueryKeys } from '@/util/queryKeysFactory'
import { useTranslation } from 'react-i18next'
import { useAuthStore, UserPermission } from '@/stores/authStore'
import { FieldProp } from '@/types/components/form'
import { TFn } from '@/lib/schema/validation'
import { FieldValues, FieldPath } from 'react-hook-form'
import {
    imageColumn as sharedImageColumn,
    booleanControlColumn as sharedBooleanControlColumn,
    textColumn as sharedTextColumn,
    createdAtColumn as sharedCreatedAtColumn,
    textDesc as sharedTextDesc,
    statusColumn as sharedStatusColumn
} from '@/components/features/sharedColumns'
import { PickedAction } from '@/hooks/useStatusMutations'
import { QueryKey } from '@tanstack/react-query'


export const createStandardActions = <T extends { id: number | string; status?: boolean | number }>(
    t: TFn,
    basePath: string,
    queryKeyTag: string,
    open: (type: 'active' | 'delete', row: T) => void,
    options: {
        hasStatus?: boolean
        hasShow?: boolean
        hasEdit?: boolean
        hasDelete?: boolean
        hasPermissions?: boolean
    } = { hasStatus: true, hasShow: true, hasEdit: true, hasDelete: true, hasPermissions: false }
): RowAction<T>[] => {
    const actions: RowAction<T>[] = []

    if (options.hasEdit) {
        actions.push({
            label: t('actions.edit'),
            to: `${basePath}/$id` as any,
            params: (row) => ({ id: row.id.toString() }),
            queryKey: (id) => getQueryKeys.getOne(queryKeyTag as any, id),
        })
    }

    if (options.hasShow) {
        actions.push({
            label: t('actions.show'),
            to: `${basePath}/show/$id` as any,
            params: (row) => ({ id: row.id.toString() }),
            queryKey: (id) => getQueryKeys.getOne(queryKeyTag as any, id),
        })
    }

    if (options.hasPermissions) {
        // Permissions action can be handled via custom onClick or routing
    }

    if (options.hasDelete) {
        actions.push({
            label: t('actions.delete'),
            onClick: (row) => open('delete', row),
            danger: true,
        })
    }

    if (options.hasStatus) {
        actions.push({
            label: (row) => (row.status ? t('actions.deactivate') : t('actions.activate')),
            onClick: (row) => open('active', row),
        })
    }

    return actions
}

/**
 * Creates the standard "Actions" column for the data table with Icons
 */
export function createActionColumn<T extends { id: number | string }>(
    basePath: string,
    openAlert: (type: any, row: T) => void,
    queryKeyTag?: string,
    options: {
        hasShow?: boolean
        hasEdit?: boolean
        hasDelete?: boolean
        isModalEdit?: boolean
        hasPermissions?: boolean
        entityName?: string  // e.g., 'roles', 'admins', 'countries'
    } = { hasShow: true, hasEdit: true, hasDelete: true, isModalEdit: false, hasPermissions: false }
): ColumnDef<T> {
    return {
        id: 'actions',
        header: () => {
            const { t } = useTranslation()
            return <span className="text-foreground font-bold">{t('actions.entity')}</span>
        },
        cell: ({ row }) => {
            const id = row.original.id.toString()
            const queryKey = queryKeyTag ? getQueryKeys.getOne(queryKeyTag as any, id) : undefined
            const rowData = row.original
            const user = useAuthStore.getState().user

            // Helper function to check if user has permission for an action
            const hasPermission = (action: 'show' | 'update' | 'destroy' | 'permissions') => {
                if (!options.entityName || !user?.permission) return true // If no entity name specified, show all actions
                const permissionName = `${options.entityName}.${action}`
                return user.permission.some((p: UserPermission) => p.back_route_name === permissionName)
            }

            return (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    {options.hasEdit && hasPermission('update') && (
                        <ActionIcon
                            icon={Edit}
                            label="actions.edit"
                            to={options.isModalEdit ? undefined : (`${basePath}/$id` as any)}
                            params={options.isModalEdit ? undefined : { id }}
                            onClick={options.isModalEdit ? () => openAlert('edit', row.original) : undefined}
                            queryKey={queryKey}
                            rowData={rowData}
                        />
                    )}
                    {options.hasShow && hasPermission('show') && (
                        <ActionIcon
                            icon={Eye}
                            label="actions.show"
                            to={`${basePath}/show/$id` as any}
                            params={{ id }}
                            queryKey={queryKey}
                            rowData={rowData}
                        />
                    )}
                    {options.hasPermissions && hasPermission('permissions') && (
                        <ActionIcon
                            icon={Settings}
                            label="actions.permissions"
                            to={undefined}
                            params={undefined}
                            onClick={() => openAlert('permissions', row.original)}
                            queryKey={queryKey}
                            rowData={rowData}
                        />
                    )}
                    {options.hasDelete && hasPermission('destroy') && (
                        <ActionIcon
                            icon={Trash}
                            label="actions.delete"
                            variant="destructive"
                            onClick={() => openAlert('delete', row.original)}
                        />
                    )}
                </div>
            )
        },
    }
}

/**
 * Standard Image column
 */
export const imageColumn = sharedImageColumn

/**
 * Standard Boolean/Status control column
 */
export const booleanControlColumn = <T extends { id: number | string }>(
    key: keyof T,
    titleKey: string,
    open: (type: PickedAction, row: T) => void,
    actionType: PickedAction = 'active'
) => sharedBooleanControlColumn<T>(key, titleKey, open, actionType)

/**
 * Standard Text column
 */
export const textColumn = sharedTextColumn

/**
 * Standard Created At column
 */
export const createdAtColumn = sharedCreatedAtColumn

/**
 * Standard Status column
 */
export const statusColumn = sharedStatusColumn

/**
 * Standard Multi-language Name and Slug fields
 */
export const multiLangNameSlug = <T extends FieldValues>(t: TFn): FieldProp<T>[] => [
    {
        type: 'multiLangField',
        name: 'name' as any,
        label: t('Form.labels.name'),
        placeholder: t('Form.placeholders.name'),
    },
    {
        type: 'multiLangField',
        name: 'slug' as any,
        label: t('Form.labels.slug'),
        placeholder: t('Form.placeholders.slug'),
    },
]

/**
 * Standard Status Checkbox field
 */
export const statusField = <T extends FieldValues>(t: TFn): FieldProp<T> => ({
    name: 'status' as any,
    label: t('Form.labels.status'),
    type: 'switch',
})

/**
 * Standard Image Uploader field
 */
export const imageField = <T extends FieldValues>(
    t: TFn,
    name: FieldPath<T>,
    model: string,
    labelKey = 'Form.labels.image',
    span = 2
): FieldProp<T> => ({
    type: 'imgUploader',
    name,
    label: t(labelKey),
    span,
    inputProps: {
        maxFiles: 1,
        acceptedFileTypes: ['image/*'],
        model,
    } as any,
})

/**
 * Standard Select field (especially for API data)
 */
export const selectField = <T extends FieldValues>(
    t: TFn,
    name: FieldPath<T>,
    labelKey: string,
    placeholderKey: string,
    endpoint: string,
    optionsMapper?: (res: any) => { label: string; value: any }[],
    general?: boolean,
    queryKey?: QueryKey
): FieldProp<T> => ({
    name,
    label: t(labelKey),
    type: 'select',
    inputProps: {
        placeholder: t(placeholderKey),
        endpoint,
        general,
        select: optionsMapper ?? ((res: any) => res.data.map((item: any) => ({
            label: item.name || item.title || item.label,
            value: item.id
        }))),
        queryKey,

    } as any,
})


export const statusFilter = (t: TFn): Filter => ({
    id: 'is_active',
    title: t('status.title'),
    type: 'select',
    options: [
        { label: t('status.active'), value: '1' },
        { label: t('status.inactive'), value: '0' },
    ],

    multiple: false,
})
