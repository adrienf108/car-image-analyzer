import { ProcessedImage, ProcessingOptions } from '../types';
import { classifyWithOllama } from './ollama';
import { classifyWithOpenAI } from './openai';
import JSZip from 'jszip';
import pLimit from 'p-limit';
import { CATEGORIES } from '../constants/categories';

const limit = pLimit(5);

// Simple but effective perceptual hash
const generatePerceptualHash = async (blob: Blob): Promise<string> => {
  // Create a small thumbnail for comparison
  const bitmap = await createImageBitmap(blob);
  const canvas = new OffscreenCanvas(16, 16);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Use consistent rendering settings
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, 16, 16);
  
  const imageData = ctx.getImageData(0, 0, 16, 16);
  const data = imageData.data;
  
  // Convert to grayscale and generate binary hash
  let hash = '';
  let totalBrightness = 0;
  const grayscaleValues = [];

  // First pass: calculate grayscale values and total brightness
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    grayscaleValues.push(gray);
    totalBrightness += gray;
  }

  // Calculate average brightness
  const averageBrightness = totalBrightness / grayscaleValues.length;

  // Second pass: generate binary hash based on whether pixel is brighter than average
  for (const gray of grayscaleValues) {
    hash += gray > averageBrightness ? '1' : '0';
  }

  return hash;
};

// Calculate Hamming distance between two binary hashes
const calculateHammingDistance = (hash1: string, hash2: string): number => {
  let distance = 0;
  const len = Math.min(hash1.length, hash2.length);
  
  for (let i = 0; i < len; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }
  
  return distance;
};

// Compare two images for similarity
const compareDuplicates = (hash1: string, hash2: string): number => {
  const distance = calculateHammingDistance(hash1, hash2);
  const maxDistance = hash1.length;
  const similarity = ((maxDistance - distance) / maxDistance) * 100;

  return similarity;
};

const isImageFile = (filename: string): boolean => {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
  return imageExtensions.test(filename) && 
         !filename.startsWith('._') && 
         !filename.includes('__MACOSX/') &&
         !filename.includes('.DS_Store');
};

export const processZipFile = async (
  file: File,
  options: ProcessingOptions
): Promise<{ images: ProcessedImage[]; duplicates: ProcessedImage[] }> => {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);
  const processedImages: ProcessedImage[] = [];
  const duplicateImages: ProcessedImage[] = [];
  const imageHashes: { hash: string; id: string; name: string }[] = [];

  const entries = Object.entries(contents.files)
    .filter(([path, entry]) => !entry.dir && isImageFile(path))
    .sort(([a], [b]) => a.localeCompare(b));

  console.log(`Starting to process ${entries.length} images...`);

  for (const [path, zipEntry] of entries) {
    try {
      const blob = await zipEntry.async('blob');
      const hash = await generatePerceptualHash(blob);
      const fileName = path.split('/').pop() || 'image.jpg';
      const url = URL.createObjectURL(blob);
      const id = crypto.randomUUID();

      // Check for duplicates against all previously processed images
      let isDuplicate = false;
      let duplicateOf = '';
      let maxSimilarity = 0;

      for (const existing of imageHashes) {
        const similarity = compareDuplicates(existing.hash, hash);
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          if (similarity >= options.similarityThreshold) {
            isDuplicate = true;
            duplicateOf = existing.id;
          }
        }
      }

      const classification = options.useOllama
        ? await classifyWithOllama(blob, options.ollamaModel)
        : await classifyWithOpenAI(blob, options.openAIKey);

      const prefix = `${classification.category[0]}${
        CATEGORIES[classification.category].indexOf(classification.subcategory).toString().padStart(2, '0')
      }`;

      const processedImage = {
        id,
        url,
        originalName: fileName,
        newName: `${prefix}_${fileName}`,
        category: classification.category,
        subcategory: classification.subcategory,
        hash,
        confidence: classification.confidence,
        similarity: maxSimilarity,
        duplicateOf: isDuplicate ? duplicateOf : undefined
      };

      if (isDuplicate) {
        duplicateImages.push(processedImage);
      } else {
        imageHashes.push({ hash, id, name: fileName });
        processedImages.push(processedImage);
      }

      console.log(`Processed: ${fileName} (${isDuplicate ? 'Duplicate' : 'Original'})`);
    } catch (error) {
      console.error(`Error processing image ${path}:`, error);
    }
  }

  console.log(`Processing complete:
    Total images: ${entries.length}
    Processed: ${processedImages.length}
    Duplicates found: ${duplicateImages.length}
  `);

  return {
    images: processedImages.sort((a, b) => a.newName.localeCompare(b.newName)),
    duplicates: duplicateImages
  };
};