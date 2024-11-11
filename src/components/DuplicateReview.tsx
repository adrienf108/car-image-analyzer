import React from 'react';
import { useStore } from '../store';
import { X, Check, RotateCcw } from 'lucide-react';

const DuplicateReview: React.FC = () => {
  const { removedDuplicates, images, showDuplicateReview, setShowDuplicateReview, restoreDuplicate } = useStore();

  if (!showDuplicateReview || removedDuplicates.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Review Duplicates ({removedDuplicates.length})</h2>
          <button
            onClick={() => setShowDuplicateReview(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {removedDuplicates.map((duplicate) => {
            const original = images.find(img => img.id === duplicate.duplicateOf);
            if (!original) return null;

            return (
              <div key={duplicate.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="font-medium">Similarity: </span>
                    <span className="text-blue-600">{duplicate.similarity?.toFixed(1)}%</span>
                  </div>
                  <button
                    onClick={() => restoreDuplicate(duplicate.id)}
                    className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restore
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Original</p>
                    <div className="relative aspect-video">
                      <img
                        src={original.url}
                        alt={original.originalName}
                        className="absolute inset-0 w-full h-full object-contain bg-gray-100 rounded"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{original.originalName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Duplicate</p>
                    <div className="relative aspect-video">
                      <img
                        src={duplicate.url}
                        alt={duplicate.originalName}
                        className="absolute inset-0 w-full h-full object-contain bg-gray-100 rounded"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{duplicate.originalName}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DuplicateReview;