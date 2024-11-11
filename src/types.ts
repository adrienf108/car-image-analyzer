export interface ProcessedImage {
  id: string;
  url: string;
  originalName: string;
  newName: string;
  category: string;
  subcategory: string;
  confidence: number;
  hash: string;
  duplicateOf?: string; // ID of the original image if this is a duplicate
  similarity?: number; // Similarity percentage with the original image
}

export interface ProcessingStats {
  totalImages: number;
  duplicatesRemoved: number;
  categorizedImages: number;
  uncategorizedImages: number;
}

export interface ProcessingOptions {
  similarityThreshold: number;
  useOllama: boolean;
  selectedModel: string;
  openAIKey: string;
}