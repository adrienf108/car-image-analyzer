import { CATEGORIES } from '../constants/categories';
import { ClassificationResult, ProcessingOptions } from '../types';
import { classifyWithOpenAI } from './openai';
import { classifyWithOllama } from './ollama';

const normalizeCategory = (category: string): string => {
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
};

const normalizeSubcategory = (subcategory: string): string => {
  return subcategory
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/(^_|_$)/g, '');
};

export const validateClassification = (
  category: string,
  subcategory: string
): ClassificationResult => {
  const normalizedCategory = normalizeCategory(category);
  
  if (!CATEGORIES[normalizedCategory]) {
    return {
      category: 'Uncategorized',
      subcategory: 'default',
      confidence: 0
    };
  }
  
  const normalizedSubcategory = normalizeSubcategory(subcategory);
  
  if (!CATEGORIES[normalizedCategory].includes(normalizedSubcategory)) {
    return {
      category: normalizedCategory,
      subcategory: CATEGORIES[normalizedCategory][0],
      confidence: 0.5
    };
  }

  return {
    category: normalizedCategory,
    subcategory: normalizedSubcategory,
    confidence: 1
  };
};

export const classifyImage = async (
  base64Image: string,
  options: ProcessingOptions
): Promise<ClassificationResult> => {
  try {
    let result;
    
    if (options.useOllama) {
      if (!options.ollamaModel) {
        throw new Error('Ollama model name is required');
      }
      result = await classifyWithOllama(base64Image, options.ollamaModel);
    } else {
      if (!options.openAiKey) {
        throw new Error('OpenAI API key is required');
      }
      result = await classifyWithOpenAI(base64Image, options.openAiKey);
    }

    return validateClassification(result.category, result.subcategory);
  } catch (error) {
    console.error('Classification failed:', error);
    return {
      category: 'Uncategorized',
      subcategory: 'default',
      confidence: 0
    };
  }
};