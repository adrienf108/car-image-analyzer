import { CATEGORIES } from '../constants/categories';
import pLimit from 'p-limit';

const limit = pLimit(3);
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const cleanJsonResponse = (response: string): string => {
  // Remove markdown code block syntax and any extra whitespace
  return response.replace(/```json\n?|\n?```/g, '').trim();
};

export const classifyWithOpenAI = async (
  blob: Blob,
  apiKey: string
): Promise<{ category: string; subcategory: string; confidence: number }> => {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  return limit(async () => {
    try {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.readAsDataURL(blob);
      });

      const prompt = `Analyze this car image and classify it into one of these categories and subcategories. Respond ONLY with a JSON object containing "category" and "subcategory" fields, with no markdown formatting:

Categories and subcategories:
${Object.entries(CATEGORIES)
  .map(([cat, subs]) => `${cat}: ${subs.join(', ')}`)
  .join('\n')}`;

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64}`,
                    detail: 'low' // Use low detail to save on tokens
                  },
                },
              ],
            },
          ],
          max_tokens: 150,
          temperature: 0.2,
        }),
      });

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json();
        console.error('OpenAI API error:', errorData);
        
        if (openaiResponse.status === 429) {
          await sleep(2000);
          return classifyWithOpenAI(blob, apiKey);
        }
        
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await openaiResponse.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from OpenAI');
      }

      const cleanedResponse = cleanJsonResponse(data.choices[0].message.content);
      let classification;
      
      try {
        classification = JSON.parse(cleanedResponse);
      } catch (e) {
        console.error('Failed to parse OpenAI response:', data.choices[0].message.content);
        throw new Error('Invalid JSON response from OpenAI');
      }

      // Validate the response
      if (!classification.category || !classification.subcategory) {
        throw new Error('Missing category or subcategory in OpenAI response');
      }

      const category = classification.category;
      const subcategory = classification.subcategory;

      if (!CATEGORIES[category] || !CATEGORIES[category].includes(subcategory)) {
        console.warn('Invalid category/subcategory from OpenAI:', classification);
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
      console.error('Error classifying image with OpenAI:', error);
      return {
        category: 'Uncategorized',
        subcategory: 'default',
        confidence: 0,
      };
    }
  });
};