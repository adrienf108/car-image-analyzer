import { create } from 'zustand';
import { ProcessedImage, ProcessingStats, ProcessingOptions } from '../types';

interface AppState {
  images: ProcessedImage[];
  stats: ProcessingStats;
  options: ProcessingOptions;
  isProcessing: boolean;
  setImages: (images: ProcessedImage[]) => void;
  setStats: (stats: ProcessingStats) => void;
  setOptions: (options: Partial<ProcessingOptions>) => void;
  setProcessing: (isProcessing: boolean) => void;
  updateImageCategory: (id: string, category: string, subcategory: string) => void;
}

export const useStore = create<AppState>((set) => ({
  images: [],
  stats: {
    totalImages: 0,
    duplicatesFound: 0,
    categorized: {}
  },
  options: {
    similarityThreshold: 95,
    useOllama: false,
    ollamaModel: 'llava'
  },
  isProcessing: false,
  setImages: (images) => set({ images }),
  setStats: (stats) => set({ stats }),
  setOptions: (options) => set((state) => ({ 
    options: { ...state.options, ...options } 
  })),
  setProcessing: (isProcessing) => set({ isProcessing }),
  updateImageCategory: (id, category, subcategory) => set((state) => ({
    images: state.images.map((img) =>
      img.id === id ? { ...img, category, subcategory } : img
    )
  }))
}));