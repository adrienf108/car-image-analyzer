import React from 'react';
import { useStore } from '../store';
import { BarChart, Images } from 'lucide-react';

const ProcessingStats: React.FC = () => {
  const { stats, removedDuplicates, setShowDuplicateReview } = useStore();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <BarChart className="w-5 h-5" />
        Processing Statistics
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{stats.totalImages}</div>
          <div className="text-sm text-gray-600">Total Images</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <button
            onClick={() => setShowDuplicateReview(true)}
            className="w-full text-left"
            disabled={removedDuplicates.length === 0}
          >
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-green-600">{stats.duplicatesRemoved}</div>
              <Images className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-sm text-gray-600">Duplicates Removed</div>
          </button>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{stats.categorizedImages}</div>
          <div className="text-sm text-gray-600">Categorized</div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{stats.uncategorizedImages}</div>
          <div className="text-sm text-gray-600">Uncategorized</div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStats;