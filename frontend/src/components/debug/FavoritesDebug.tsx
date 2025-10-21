import React, { useState } from 'react';
import { useFavorites } from '../context/FavoriteContext';

const FavoritesDebug: React.FC = () => {
  const { state, addToFavorites, removeFromFavorites, isFavorite, getFavoriteCount } = useFavorites();
  const [testProductId, setTestProductId] = useState('test-product-1');

  const testProduct = {
    _id: testProductId,
    name: 'Test Product',
    price: 100,
    discountPrice: 80,
    images: ['/placeholder-image.svg'],
    category: { name: 'Test Category' },
  };

  const handleAddTest = () => {
    addToFavorites(testProduct);
  };

  const handleRemoveTest = () => {
    removeFromFavorites(testProductId);
  };

  const handleClearStorage = () => {
    localStorage.removeItem('favorites');
    window.location.reload();
  };

  const handleCheckStorage = () => {
    const stored = localStorage.getItem('favorites');
    console.log('Current localStorage favorites:', stored);
    alert(`localStorage favorites: ${stored}`);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 border border-gray-300 rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold text-sm mb-2">Favorites Debug</h3>
      
      <div className="space-y-2 text-xs">
        <div>Count: {getFavoriteCount()}</div>
        <div>Is Favorite: {isFavorite(testProductId) ? 'Yes' : 'No'}</div>
        <div>Loading: {state.isLoading ? 'Yes' : 'No'}</div>
        <div>Error: {state.error || 'None'}</div>
        
        <div className="mt-3 space-y-1">
          <button
            onClick={handleAddTest}
            className="w-full bg-blue-500 text-white px-2 py-1 rounded text-xs"
          >
            Add Test Product
          </button>
          
          <button
            onClick={handleRemoveTest}
            className="w-full bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Remove Test Product
          </button>
          
          <button
            onClick={handleCheckStorage}
            className="w-full bg-green-500 text-white px-2 py-1 rounded text-xs"
          >
            Check localStorage
          </button>
          
          <button
            onClick={handleClearStorage}
            className="w-full bg-yellow-500 text-white px-2 py-1 rounded text-xs"
          >
            Clear & Reload
          </button>
        </div>
        
        <div className="mt-2">
          <label className="text-xs">Test Product ID:</label>
          <input
            type="text"
            value={testProductId}
            onChange={(e) => setTestProductId(e.target.value)}
            className="w-full px-1 py-1 border border-gray-300 rounded text-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default FavoritesDebug;
