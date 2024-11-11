import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useStore } from '../store';
import { processZipFile } from '../services/imageProcessor';
import { MAX_FILE_SIZE } from '../constants/categories';

const UploadZone: React.FC = () => {
  const { options, setImages, setRemovedDuplicates, setStats, setIsProcessing } = useStore();

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file || !file.name.endsWith('.zip')) {
      alert('Please upload a ZIP file');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert('File size exceeds 1GB limit');
      return;
    }

    if (!options.useOllama && !options.openAIKey) {
      alert('Please enter your OpenAI API key in the settings');
      return;
    }

    setIsProcessing(true);
    try {
      const { images, duplicates } = await processZipFile(file, options);
      setImages(images);
      setRemovedDuplicates(duplicates);
      setStats({
        totalImages: images.length + duplicates.length,
        duplicatesRemoved: duplicates.length,
        categorizedImages: images.filter(img => img.category !== 'Uncategorized').length,
        uncategorizedImages: images.filter(img => img.category === 'Uncategorized').length,
      });
    } catch (error) {
      console.error('Error processing ZIP file:', error);
      alert('Error processing ZIP file: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsProcessing(false);
    }
  }, [options, setImages, setRemovedDuplicates, setStats, setIsProcessing]);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
      <input
        type="file"
        accept=".zip"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        className="hidden"
        id="fileInput"
      />
      <label
        htmlFor="fileInput"
        className="cursor-pointer flex flex-col items-center space-y-2"
      >
        <Upload className="w-12 h-12 text-gray-400" />
        <p className="text-lg font-medium">Drop ZIP file here or click to upload</p>
        <p className="text-sm text-gray-500">Maximum file size: 1GB</p>
      </label>
    </div>
  );
};

export default UploadZone;