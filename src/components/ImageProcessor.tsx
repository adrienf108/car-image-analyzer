import React from 'react';
import { useStore } from '../store';
import UploadZone from './UploadZone';
import ProcessingOptions from './ProcessingOptions';
import ImageGrid from './ImageGrid';
import ProcessingStats from './ProcessingStats';
import DownloadButton from './DownloadButton';
import DuplicateReview from './DuplicateReview';

const ImageProcessor: React.FC = () => {
  const { isProcessing, images } = useStore();

  return (
    <div className="space-y-8">
      <ProcessingOptions />
      <UploadZone />
      {isProcessing && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Processing images...</p>
        </div>
      )}
      {images.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <ProcessingStats />
            <DownloadButton />
          </div>
          <ImageGrid />
        </>
      )}
      <DuplicateReview />
    </div>
  );
};

export default ImageProcessor;