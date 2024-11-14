import React from 'react';
import { Upload, Settings } from 'lucide-react';
import ImageProcessor from './components/ImageProcessor';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Upload className="w-8 h-8" />
            Car Image Analyzer
          </h1>
          <p className="text-gray-600 mt-2">
            Upload, deduplicate, and categorize car images automatically
          </p>
        </header>
        <main>
          <ImageProcessor />
        </main>
      </div>
    </div>
  );
}

export default App;
