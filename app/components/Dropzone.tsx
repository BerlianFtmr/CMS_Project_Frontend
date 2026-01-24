"use client";

import React, { useState, useRef } from 'react';

interface DropZoneProps {
  onFilesDropped: (files: FileList) => void;
  previewImage?: string;
  onPreviewRemove?: () => void;
  className?: string;
}

const DropZone: React.FC<DropZoneProps> = ({ 
  onFilesDropped, 
  previewImage, 
  onPreviewRemove,
  className = '' 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onFilesDropped(e.dataTransfer.files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesDropped(e.target.files);
    }
  };

  return (
    <>
      <div
        className={`
          w-full h-full min-h-[200px] border-2 border-dashed rounded-xl
          flex flex-col items-center justify-center text-center p-6
          transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50/50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50/50'
          }
          ${previewImage ? 'p-2' : 'p-6'}
          ${className}
        `}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        {previewImage ? (
          <div className="relative w-full h-full">
            <img 
              src={previewImage} 
              alt="Preview" 
              className="w-full h-full object-cover rounded-lg"
            />
            {onPreviewRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreviewRemove();
                }}
                className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
            
            <div className="space-y-1">
              <p className="text-gray-600 font-medium text-base">
                Drag & Drop files here
              </p>
              <p className="text-gray-400 text-sm">or</p>
              <p className="text-blue-500 font-medium text-base">
                Browse Files
              </p>
            </div>
            
            <p className="text-gray-400 text-xs mt-2">
              Supports: JPG, PNG, GIF, SVG (Max 5MB)
            </p>
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        className="hidden"
        accept="image/*"
      />
    </>
  );
};

export default DropZone;