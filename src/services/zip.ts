import JSZip from 'jszip';
import { ProcessedImage } from '../types';

export const processZipFile = async (file: File): Promise<File[]> => {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);
  const imageFiles: File[] = [];

  for (const [path, zipEntry] of Object.entries(contents.files)) {
    // Skip directories and macOS system files
    if (zipEntry.dir || path.includes('__MACOSX') || path.startsWith('._')) {
      continue;
    }

    // Only process image files
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(path)) {
      const blob = await zipEntry.async('blob');
      const imageFile = new File([blob], path.split('/').pop() || 'image.jpg', {
        type: blob.type || 'image/jpeg'
      });
      imageFiles.push(imageFile);
    }
  }

  return imageFiles;
};

export const generateZipFile = async (images: ProcessedImage[]): Promise<Blob> => {
  const zip = new JSZip();

  for (const image of images) {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      zip.file(image.newName, blob);
    } catch (error) {
      console.error(`Error adding image to zip: ${image.originalName}`, error);
    }
  }

  return zip.generateAsync({ type: 'blob' });
};