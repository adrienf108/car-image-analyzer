export interface ImageCategory {
  name: string;
  subcategories: string[];
}

export interface ProcessedImage {
  id: string;
  originalName: string;
  newName: string;
  category: string;
  subcategory: string;
  hash: string;
  url: string;
  isDuplicate?: boolean;
  duplicateOf?: string;
}

export interface ProcessingStats {
  totalImages: number;
  duplicatesFound: number;
  categorized: Record<string, number>;
}

export interface ProcessingOptions {
  similarityThreshold: number;
  useOllama: boolean;
  ollamaModel: string;
  openAiKey?: string;
}