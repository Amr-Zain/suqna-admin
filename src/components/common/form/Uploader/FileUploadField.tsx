import React from "react";
import { ControllerRenderProps, useFormState } from "react-hook-form";
import AppUploader from "./Uploader";
import { FileUploadInputProps } from "@/types/components/uploader";
import { fileURLToPath } from "url";

export interface FileUploadFieldProps extends FileUploadInputProps {
  field: ControllerRenderProps<any, string>;
  className?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  field,
  maxFiles = 1,
  maxSize = 5,
  acceptedFileTypes = ['image/*'],
  multiple = false,
  disabled = false,
  className = '',
  showPreview = true,
  shapeType = 'picture-card',
  draggable = true,
  type_file = 'image',
  model = 'Media',
  apiEndpoint = '/attachments',
  baseUrl,
}) => {
  // Convert acceptedFileTypes array to accept string
  const accept = acceptedFileTypes.join(',')

  // Handle initial file list - convert field value to UploadFile format if needed
  const getInitialFileList = () => {
    if (!field.value) return []

    // If field.value is already an array of UploadFile objects
    if (Array.isArray(field.value)) {
      return field.value.map((item: any, index: number) => {
        if (typeof item === 'string') return { uid: item + index, url: item, name: 'uploaded-file-' + index, isUploading: false }
        return {
          uid: item.id || item.path || 'initial-' + index,
          name: item.name || 'uploaded-file-' + index,
          isUploading: false,
          url: item.url,
          response: { data: item },
        }
      })
    }

    // If field.value is a single file object
    if (typeof field.value === 'string') {
      return [{ uid: field.value, url: field.value, name: 'uploaded-file', isUploading: false }]
    }
    if (typeof field.value === 'object' && (field.value.id || field.value.path)) {
      return [
        {
          uid: field.value.id || field.value.path,
          name: field.value.name || 'uploaded-file',
          isUploading: false,
          url: field.value.url,
          response: { data: field.value },
        },
      ]
    }

    return []
  }

  // Handle file changes
  const handleChange = (value: any) => {
    if (multiple) {
      console.log('value',value)
      field.onChange([...(field.value || []), ...value.map((file: any) => file.data || file)])
    } else {
      console.log('value',value)
      field.onChange(value.data)
    }
  }

  // Handle file removal
  const handleRemove = (fileList: any[]) => {
    if (multiple) {
      console.log(
        'value delete',
        fileList.map(
          (file) =>
            file?.path || file?.response?.data?.path || file?.uid?.toString(),
        ),
      )

      field.onChange(fileList.map((file) => file?.path || file?.response?.data?.path ||file?.uid?.toString()))
    } else {
      field.onChange('')
    }
  }

  return (
    <div className={className}>
      <AppUploader
        field={field}
        name={field.name}
        initialFileList={getInitialFileList()}
        onChange={handleChange}
        onRemove={handleRemove}
        maxCount={multiple ? maxFiles : 1}
        disabled={disabled}
        singleFile={!multiple}
        shapeType={shapeType}
        type_file={type_file}
        accept={accept}
        maxSize={maxSize}
        showPreview={showPreview}
        draggable={draggable}
        model={model}
        apiEndpoint={apiEndpoint}
        baseUrl={baseUrl}
      />
    </div>
  )
}

export default FileUploadField;