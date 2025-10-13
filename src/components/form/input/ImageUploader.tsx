import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Image, Loader, Upload, X } from 'lucide-react';
import clsx from 'clsx';

// Try to import Urls, otherwise fallback
let defaultImage = '';
try {
  // @ts-ignore
  // eslint-disable-next-line
  defaultImage = require('../../networking/app_urls').defaultImage || '';
} catch (e) {
  defaultImage = '/default-image.png'; // fallback path
}

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  selectedImage?: File | null;
  existingImage?: string | null; 
}




const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, selectedImage, existingImage }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  // To keep track of object URLs for cleanup
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  // Handle preview for existingImage (URL string)
  useEffect(() => {
    if (existingImage) {
      setPreviewUrl(existingImage);
      setImageLoading(true);
    }
  }, [existingImage]);

  // Handle preview for selectedImage (File)
  useEffect(() => {
    if (selectedImage) {
      const fileUrl = URL.createObjectURL(selectedImage);
      setPreviewUrl(fileUrl);
      setObjectUrl(fileUrl);
      setImageLoading(true);
    }
    // Clean up old object URL
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onImageChange(file);
      // The preview will be handled by selectedImage effect
    }
  }, [onImageChange]);

  const removeImage = () => {
    onImageChange(null);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
    setPreviewUrl(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/jpg': [],
    },
    maxSize: 15728640, // 15MB
    maxFiles: 1,
  });


  return (
    <div className="w-full">
      {!previewUrl ? (
        <div
          {...getRootProps()}
          className={clsx(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors",
            isDragActive 
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" 
              : "border-slate-300 hover:border-themeBlue dark:border-slate-600 dark:hover:border-gray-500"
          )}
        >
          <input {...getInputProps()} />
          <Upload 
            className={clsx(
              "w-10 h-10 mb-2",
              isDragActive ? "text-themeBlue" : "text-slate-400"
            )} 
          />
          <p className="text-sm text-center text-slate-600 dark:text-slate-300">
            {isDragActive ? (
              <span className="font-medium text-themeBlue dark:text-indigo-400">Drop the image here</span>
            ) : (
              <>
                <span className="font-medium">Click to upload</span> or drag and drop
              </>
            )}
          </p>
          <p className="mt-1 text-xs text-center text-slate-500 dark:text-slate-400">
            PNG, JPG, JPEG (max 15MB)
          </p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative overflow-hidden dark:bg-white/[0.03]  rounded-lg ${imageLoading ? 'bg-indigo-500' : ''}`}
        >
            {imageLoading && <span className='w-full h-40 flex items-center justify-center'>
              <Loader size={45} className={`text-white animate-spin mb-4`} />
            </span> }
          <img
            src={previewUrl}
            alt="Profile preview"
            className={`w-full h-40 bg-[#f1f5f9] border border-neutral-300 p-2 object-contain rounded-lg ${imageLoading ? 'hidden' : 'block'}`}
            onError={(e) => {
              e.currentTarget.src = defaultImage;
            }}
            onLoad={() => setImageLoading(false)}
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={removeImage}
            type="button"
            className="absolute top-2 right-2 bg-slate-800/70 hover:bg-slate-900/90 text-white p-1 rounded-full"
            >
            <X size={16} />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ImageUploader;