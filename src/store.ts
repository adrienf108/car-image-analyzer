import { create } from 'zustand';
import { ProcessedImage, ProcessingStats, ProcessingOptions } from './types';

interface State {
  images: ProcessedImage[];
  removedDuplicates: ProcessedImage[];
  stats: ProcessingStats;
  options: ProcessingOptions;
  isProcessing: boolean;
  showDuplicateReview: boolean;
  setImages: (images: ProcessedImage[]) => void;
  setRemovedDuplicates: (images: ProcessedImage[]) => void;
  setStats: (stats: ProcessingStats) => void;
  setOptions: (options: Partial<ProcessingOptions>) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setShowDuplicateReview: (show: boolean) => void;
  updateImageCategory: (id: string, category: string, subcategory: string) => void;
  deleteImage: (id: string) => void;
  restoreDuplicate: (duplicateId: string) => void;
}

export const useStore = create<State>((set) => ({
  images: [],
  removedDuplicates: [],
  stats: {
    totalImages: 0,
    duplicatesRemoved: 0,
    categorizedImages: 0,
    uncategorizedImages: 0,
  },
  options: {
    similarityThreshold: 70,
    useOllama: false,
    selectedModel: 'llava',
    openAIKey: '',
  },
  isProcessing: false,
  showDuplicateReview: false,
  setImages: (images) => set({ images }),
  setRemovedDuplicates: (removedDuplicates) => set({ removedDuplicates }),
  setStats: (stats) => set({ stats }),
  setOptions: (options) => set((state) => ({ options: { ...state.options, ...options } })),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setShowDuplicateReview: (show) => set({ showDuplicateReview: show }),
  updateImageCategory: (id, category, subcategory) =>
    set((state) => ({
      images: state.images.map((img) =>
        img.id === id ? { ...img, category, subcategory } : img
      ),
    })),
  deleteImage: (id) =>
    set((state) => {
      const newImages = state.images.filter((img) => img.id !== id);
      const categorizedCount = newImages.filter(img => img.category !== 'Uncategorized').length;
      
      return {
        images: newImages,
        stats: {
          ...state.stats,
          totalImages: newImages.length,
          categorizedImages: categorizedCount,
          uncategorizedImages: newImages.length - categorizedCount,
        }
      };
    }),
  restoreDuplicate: (duplicateId) =>
    set((state) => {
      const duplicateImage = state.removedDuplicates.find(img => img.id === duplicateId);
      if (!duplicateImage) return state;

      const newRemovedDuplicates = state.removedDuplicates.filter(img => img.id !== duplicateId);
      
      return {
        images: [...state.images, { ...duplicateImage, duplicateOf: undefined, similarity: undefined }],
        removedDuplicates: newRemovedDuplicates,
        stats: {
          ...state.stats,
          totalImages: state.stats.totalImages + 1,
          duplicatesRemoved: state.stats.duplicatesRemoved - 1,
        }
      };
    }),
}));