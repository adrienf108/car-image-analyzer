import { CATEGORIES } from '../constants/categories';

export const classifyWithOllama = async (
  blob: Blob,
  model: string = 'llava'
): Promise<{ category: string; subcategory: string; confidence: number }> => {
  try {
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.readAsDataURL(blob);
    });

    const prompt = `You are a car image classifier. Analyze this car image and classify it into exactly one category and subcategory from the following list. Respond ONLY with a JSON object containing "category" and "subcategory" fields, nothing else:

Categories and subcategories:
${Object.entries(CATEGORIES)
  .map(([cat, subs]) => `${cat}: ${subs.join(', ')}`)
  .join('\n')}

Example response format:
{"category": "Exterior", "subcategory": "front_view"}`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        images: [base64],
        stream: false,
        format: 'json'
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    let classification;

    try {
      // Extract JSON from the response
      const jsonMatch = data.response.match(/\{.*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      classification = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('Failed to parse Ollama response:', data.response);
      throw new Error('Invalid JSON response from Ollama');
    }

    // Validate the response
    if (!classification.category || !classification.subcategory) {
      throw new Error('Missing category or subcategory in Ollama response');
    }

    const category = classification.category;
    const subcategory = classification.subcategory;

    if (!CATEGORIES[category] || !CATEGORIES[category].includes(subcategory)) {
      console.warn('Invalid category/subcategory from Ollama:', classification);
      return {
        category: 'Uncategorized',
        subcategory: 'default',
        confidence: 0.5,
      };
    }

    return {
      category,
      subcategory,
      confidence: 0.9,
    };
  } catch (error) {
    console.error('Error classifying image with Ollama:', error);
    return {
      category: 'Uncategorized',
      subcategory: 'default',
      confidence: 0,
    };
  }
};