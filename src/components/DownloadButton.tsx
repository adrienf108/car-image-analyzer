import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useStore } from '../store';
import JSZip from 'jszip';

const DownloadButton: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const images = useStore((state) => state.images);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const zip = new JSZip();
      
      // Process each image
      await Promise.all(
        images.map(async (image) => {
          try {
            const response = await fetch(image.url);
            const blob = await response.blob();
            zip.file(image.newName, blob);
          } catch (error) {
            console.error(`Error adding image to zip: ${image.originalName}`, error);
          }
        })
      );

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'processed-car-images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating zip file:', error);
      alert('Error generating the zip file. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
        isGenerating ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
    >
      {isGenerating ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
          Generating ZIP...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Download Processed Images
        </>
      )}
    </button>
  );
};

export default DownloadButton;