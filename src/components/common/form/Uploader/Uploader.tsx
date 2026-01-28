"use client";

import axiosInstance from "@/services/axiosGeneral";
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react";
import UploadedPreview from "./UploadedPreview";
// import AppModal from "../Modal/AppModal";
// import { Image } from "antd";
import { useTranslation } from "react-i18next";
import { AppLoaderProps, UploadFile } from "@/types/components/uploader";
import { Modal } from "../../uiComponents/Modal";
import { useFormState } from "react-hook-form";

type FileType = File;

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const AppUploader = <T extends object = Record<string, any>>({
  initialFileList = [],
  onChange,
  onRemove,
  maxCount = 1,
  disabled = false,
  hideTitle = false,
  singleFile = false,
  field,
  shapeType = "picture-card",
  type_file = "image",
  name,
  model = 'Media',
  accept,
  baseUrl = import.meta.env.VITE_BASE_GENERAL_URL,
  maxSize = 5,
  showPreview = true,
  draggable = true,
  apiEndpoint = "/attachments",
}: AppLoaderProps<T>) => {
  const [fileList, setFileList] = useState<UploadFile[]>(initialFileList);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>("");
  const [previewType, setPreviewType] = useState<
    "image" | "video" | "document" | ""
  >("");
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const { errors } = useFormState({ name })
  /* 
    useEffect(() => {
      // Only update if initialFileList is different from current fileList to prevent infinite loops
      if (
        initialFileList &&
        initialFileList.length > 0 &&
        JSON.stringify(initialFileList) !== JSON.stringify(fileList)
      ) {
        setFileList(initialFileList);
      }
    }, [initialFileList, fileList]); */

  const fileListRef = useRef(fileList);
  fileListRef.current = fileList;

  useEffect(() => {
    return () => {
      fileListRef.current.forEach((file) => {
        if (file.url?.startsWith && file.url?.startsWith('blob:')) {
          URL.revokeObjectURL(file.url)
        }
      });
    };
  }, []);

  const validateFile = (file: FileType): string | null => {
    // Validate against accept types if provided
    if (accept) {
      const acceptTypes = accept.split(',').map(type => type.trim());
      const isAccepted = acceptTypes.some(acceptType => {
        if (acceptType.endsWith('/*')) {
          const baseType = acceptType.slice(0, -2);
          return file.type.startsWith(baseType);
        }
        return file.type === acceptType;
      });

      if (!isAccepted) {
        return `File type ${file.type} is not allowed. Accepted types: ${accept}`;
      }
    }

    // Legacy type_file validation for backward compatibility
    if (type_file === "document") {
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        return t("Messages.onlyPdfAllowed") || "Only PDF files are allowed";
      }
    }

    if (maxSize && file.size && file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }
    return null;
  };

  const handlePreview = async (file: UploadFile) => {
    if (!showPreview) return;
    console.log('file pre', file)
    if (
      // type_file === 'document' ||
      (file?.response?.data?.mime_type || file.type)?.includes('pdf')
    ) {
      console.log('file pre', file)
      setPreviewType('document')
      setPreviewContent(file.url || (file.preview as string))
    } else if (
      (file?.response?.data?.mime_type || file.type)?.startsWith('video')
    ) {
      // const isVideo = file.type?.startsWith('video')
      setPreviewType('video')
      if (!file.url && !file.preview && file.originFileObj) {
        file.preview = await getBase64(file.originFileObj as FileType)
      }
      setPreviewContent(file.url || (file.preview as string))
    } else {
      setPreviewType('image')
      if (!file.url && !file.preview && file.originFileObj) {
        file.preview = await getBase64(file.originFileObj as FileType)
      }
      setPreviewContent(file.url || (file.preview as string))
    }
    setPreviewOpen(true);
  };

  const uploadToServer = async (
    file: FileType
  ): Promise<{ data: { id: string; url: string;[key: string]: any } }> => {
    let attachmentType = "";
    if (file.type.startsWith("image/")) {
      attachmentType = "image";
    } else if (file.type.startsWith("video/")) {
      attachmentType = "video";
    } else {
      attachmentType = "file";
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("attachment_type", attachmentType);
    formData.append('model', model || 'applications')

    const { data } = await axiosInstance({
      method: "POST",
      url: `${baseUrl || ''}${apiEndpoint}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  };

  const handleFileUpload = async (files: FileType[]) => {
    try {
      setLoading(true);
      const newFiles: UploadFile[] = [];

      for (const file of files) {
        //Check for duplicate files
        if (fileList.some((f) => f.name === file.name && f.size === file.size)) {
          toast.error(`File "${file.name}" already exists`);
          continue;
        }

        const validationError = validateFile(file);
        if (validationError) {
          toast.error(validationError);
          continue;
        }

        const uploadFile: UploadFile = {
          uid: crypto.randomUUID(),
          name: file.name,
          isUploading: true,
          originFileObj: file,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file), // Create preview URL immediately
        };

        newFiles.push(uploadFile);
      }

      if (newFiles.length === 0) return;

      // Handle file count limits
      const currentCount = fileList.length;
      const totalCount = currentCount + newFiles.length;

      if (singleFile && newFiles.length > 1) {
        toast.error("Only one file allowed");
        return;
      }

      if (maxCount && totalCount > maxCount) {
        toast.error(`Maximum ${maxCount} files allowed`);
        return;
      }

      // Update file list with uploading files
      const updatedList = singleFile ? newFiles : [...fileList, ...newFiles];
      setFileList(updatedList);

      // Upload files one by one
      const uploadedFiles: any[] = [];

      for (const file of newFiles) {
        try {
          const response = await uploadToServer(file.originFileObj!);

          const updatedFile: UploadFile = {
            ...file,
            isUploading: false,
            response: response,
            url: file.url, // Use server URL if available, fallback to blob URL
          };

          // Update the specific file in the list
          setFileList((prev) =>
            prev.map((f) => (f.uid === file.uid ? updatedFile : f))
          );

          uploadedFiles.push(response);

        } catch (error: any) {
          console.error("Upload error:", error);
          toast.error(error?.response?.data?.message || `Failed to upload ${file.name}`);

          // Remove failed file from list
          setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
        }
      }

      // Call onChange with the appropriate data structure
      if (uploadedFiles.length > 0) {
        if (onChange) {
          console.log('onChange', uploadedFiles)
          if (singleFile) {
            onChange(uploadedFiles[0]);
          } else {
            onChange(uploadedFiles);
          }
        } else if (field) {
          // Fallback to field.onChange if onChange is not provided
          if (singleFile) {
            field.onChange(uploadedFiles[0]['data']);
          } else {
            // For multiple files, merge with existing field value
            const existingFiles = Array.isArray(field.value) ? field.value : [];
            field.onChange([...existingFiles, ...uploadedFiles]);
          }
        }
      }

    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (file: UploadFile) => {
    try {
      setLoading(true);

      // Only attempt to delete from server if file has been uploaded and has an ID
      if (file.response?.data?.id || (file.uid && !file.url?.startsWith("blob:"))) {
        const fileId = file.response?.data?.id || file.uid;
        try {
          if (fileId)
            //
            await axiosInstance({
              method: 'delete',
              url: `${baseUrl || ''}${`/attachment/${fileId}/delete`}`,
              /*  headers: {
                 'Content-Type': 'multipart/form-data',
               }, */
            })
        } catch (deleteError) {
          console.warn("Failed to delete file from server:", deleteError);
          // Continue with local removal even if server deletion fails
        }
      }

      // Remove file from local state
      const updatedFiles = fileList.filter((item) => item.uid !== file.uid);
      setFileList(updatedFiles);

      // Clean up blob URL
      if (file.url && file.url.startsWith("blob:")) {
        URL.revokeObjectURL(file.url);
      }

      // Call appropriate callback
      if (onRemove) {
        onRemove(updatedFiles);
      } else if (onChange) {
        // Extract file data for onChange callback
        const fileData = updatedFiles.map(f => f.response?.data || f).filter(Boolean);
        if (singleFile) {
          onChange(fileData.length > 0 ? fileData[0] : null as any);
        } else {
          onChange(fileData as any);
        }
      } else if (field) {
        // Fallback to field.onChange
        const fileData = updatedFiles.map(f => f.response?.data || f).filter(Boolean);
        if (singleFile) {
          field.onChange(fileData.length > 0 ? fileData[0] : null);
        } else {
          field.onChange(fileData);
        }
      }

    } catch (error) {
      console.error("Error removing file:", error);
      toast.error("Failed to remove file");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !disabled) {
      handleFileUpload(acceptedFiles);
    }
  };

  return (
    <div className="w-full">
      {!hideTitle && (
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <span className="text-sm text-muted-foreground">
            {fileList.length}
            {maxCount ? `/${maxCount}` : ''} {t('Text.files')}
          </span>
        </div>
      )}

      <UploadedPreview
        fileList={fileList}
        showPreview={showPreview}
        shapeType={shapeType}
        loading={loading}
        handlePreview={handlePreview}
        handleRemove={handleRemove}
        onDrop={onDrop}
        type_file={type_file || previewType}
        maxCount={maxCount}
        accept={accept}
        singleFile={singleFile}
        draggable={draggable}
        disabled={disabled}
        hasError={!!(errors as any)?.[name]}
      />

      {/* Preview Modal */}
      {previewOpen && (
        <Modal
          isOpen={previewOpen}
          setIsOpen={() => setPreviewOpen(false)}
          contentClass={
            'bg-transparent !w-[90vw] justify-center  p-6 md:p-12 max-w-xl border-none'
          }
        >
          {previewType === 'video' ? (
            <video controls style={{ width: '100%' }}>
              <source src={previewContent} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : previewType === 'image' ? (
            <img src={previewContent} alt="Preview" />
          ) : (
            <iframe
              src={previewContent || ''}
              style={{ width: '100%', height: '500px', border: 'none' }}
              title="Document Preview"
            />
          )}
        </Modal>
      )}
    </div>
  )
};

export default AppUploader;