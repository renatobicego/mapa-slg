import { IUserMapRegistration } from "@/types/types";
import { Image } from "@heroui/react";
import { File, Upload, X } from "lucide-react";
import { useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import Button from "./Button";

const ImageDropzone = ({
  setValue,
  errors,
  control,
}: {
  setValue: UseFormSetValue<IUserMapRegistration>;
  errors: FieldErrors<IUserMapRegistration>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<IUserMapRegistration, any, IUserMapRegistration>;
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName("");
      setPreview(null);
    }
  };

  const removeFile = () => {
    setValue("profileImage", null);
    setFileName("");
    setPreview(null);
  };
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Subir Imagen</label>
      <Controller
        name="profileImage"
        control={control}
        rules={{
          required: "Please select a file",
          validate: {
            fileSize: (files) => {
              if (!files || !files[0]) return true;
              return (
                files[0].size <= 5 * 1024 * 1024 ||
                "File size must be less than 5MB"
              );
            },
            fileType: (files) => {
              if (!files || !files[0]) return true;
              const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
              return (
                allowedTypes.includes(files[0].type) ||
                "Solo se permiten imágenes"
              );
            },
          },
        }}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render={({ field: { onChange, value, ...field } }) => (
          <div className="space-y-2">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                errors.profileImage
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-gray-400 bg-gray-50"
              }`}
            >
              <input
                {...field}
                type="file"
                accept="image/*,.pdf,.txt"
                onChange={(e) => {
                  const files = e.target.files;
                  onChange(files);
                  handleFileChange(files);
                }}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2 min-h-40 justify-center"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Arrastra y suelta un archivo aquí o{" "}
                  <span className="text-blue-600 underline">
                    selecciona uno
                  </span>
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG o JPEG hasta 5MB
                </span>
              </label>
            </div>

            {/* File Preview */}
            {fileName && (
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                <div className="flex items-center space-x-2">
                  {preview ? (
                    <Image
                      src={preview || "/placeholder.svg"}
                      alt="Preview"
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <File className="h-10 w-10 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-700 truncate max-w-[200px]">
                    {fileName}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  isIconOnly
                  radius="full"
                  onPress={removeFile}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {errors.profileImage && (
              <p className="text-sm text-red-600">
                {errors.profileImage.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default ImageDropzone;
