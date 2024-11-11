import React from 'react';
import { Settings } from 'lucide-react';
import { useStore } from '../store';
import { OLLAMA_MODELS, DEFAULT_SIMILARITY_THRESHOLD } from '../constants/categories';

const ProcessingOptions: React.FC = () => {
  const { options, setOptions } = useStore();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5" />
        Processing Options
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Similarity Threshold ({options.similarityThreshold}%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={options.similarityThreshold}
            onChange={(e) => setOptions({ similarityThreshold: Number(e.target.value) })}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Classification Model
          </label>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={!options.useOllama}
                onChange={() => setOptions({ useOllama: false })}
                className="form-radio"
              />
              <span className="ml-2">OpenAI</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                checked={options.useOllama}
                onChange={() => setOptions({ useOllama: true })}
                className="form-radio"
              />
              <span className="ml-2">Ollama</span>
            </label>
          </div>
        </div>
        {options.useOllama ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ollama Model
            </label>
            <select
              value={options.selectedModel}
              onChange={(e) => setOptions({ selectedModel: e.target.value })}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              {OLLAMA_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={options.openAIKey}
              onChange={(e) => setOptions({ openAIKey: e.target.value })}
              placeholder="sk-..."
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessingOptions;