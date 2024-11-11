import React, { useState } from 'react';
import { useStore } from '../store';
import { CATEGORIES } from '../constants/categories';
import { Trash2, X } from 'lucide-react';

const ImageGrid: React.FC = () => {
  const { images, updateImageCategory, deleteImage } = useStore();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteImage(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  const handleCategoryChange = (id: string, newCategory: string, currentSubcategory: string) => {
    // When changing category, set subcategory to first available option if current isn't valid
    const validSubcategories = CATEGORIES[newCategory];
    const newSubcategory = validSubcategories.includes(currentSubcategory) 
      ? currentSubcategory 
      : validSubcategories[0];
    
    updateImageCategory(id, newCategory, newSubcategory);
  };

  return (
    <div className="space-y-8">
      {Object.entries(CATEGORIES).map(([category, subcategories]) => {
        const categoryImages = images.filter((img) => img.category === category);
        if (categoryImages.length === 0) return null;

        return (
          <div key={category} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">{category}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categoryImages.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={image.originalName}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => handleDelete(image.id)}
                      className={`p-1 rounded-full ${
                        deleteConfirm === image.id
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-gray-800 bg-opacity-50 hover:bg-opacity-75'
                      } text-white transition-colors`}
                      title={deleteConfirm === image.id ? 'Click again to confirm deletion' : 'Delete image'}
                    >
                      {deleteConfirm === image.id ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                    <div className="flex gap-2">
                      <select
                        value={image.category}
                        onChange={(e) => handleCategoryChange(image.id, e.target.value, image.subcategory)}
                        className="w-1/2 bg-transparent border border-white rounded px-1"
                      >
                        {Object.keys(CATEGORIES).map((cat) => (
                          <option key={cat} value={cat} className="text-black">
                            {cat}
                          </option>
                        ))}
                      </select>
                      <select
                        value={image.subcategory}
                        onChange={(e) => updateImageCategory(image.id, image.category, e.target.value)}
                        className="w-1/2 bg-transparent border border-white rounded px-1"
                      >
                        {CATEGORIES[image.category].map((sub) => (
                          <option key={sub} value={sub} className="text-black">
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ImageGrid;