import React, { useState } from 'react';
import SceneViewer from './SceneViewer';

const GridPlay = () => {
  const [selectedScene, setSelectedScene] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const GRID_ROWS = 11;
  const GRID_COLS = 7;

  const handleTileClick = async (row, col) => {
    const gridId = `G${row}.${col}`;
    
    setIsLoading(true);
    setError(null);
    setSelectedScene(null);

    try {
      const response = await fetch(`/api/scene/${gridId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to fetch scene for ${gridId}`);
      }

      setSelectedScene(data.data);
    } catch (err) {
      console.error('Error fetching scene:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseScene = () => {
    setSelectedScene(null);
    setError(null);
  };

  const renderTile = (row, col) => {
    const gridId = `G${row}.${col}`;
    
    return (
      <button
        key={`${row}-${col}`}
        onClick={() => handleTileClick(row, col)}
        className="
          w-full h-full 
          bg-gradient-to-br from-gray-100 to-gray-200 
          hover:from-blue-100 hover:to-blue-200 
          border border-gray-300 hover:border-blue-400
          transition-all duration-200 ease-in-out
          flex items-center justify-center
          text-xs font-mono text-gray-600 hover:text-blue-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          active:scale-95
        "
        title={`Click to view scene ${gridId}`}
      >
        {gridId}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">GridPlay Explorer</h1>
          <p className="text-lg text-gray-600">
            Click on any tile to discover its scene. Each tile holds unique content and stories.
          </p>
        </div>

        {/* Grid Container */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-7 gap-2" style={{ aspectRatio: '7/11' }}>
            {Array.from({ length: GRID_ROWS }, (_, row) =>
              Array.from({ length: GRID_COLS }, (_, col) =>
                renderTile(row + 1, col + 1)
              )
            ).flat()}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How to Use</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Click any tile (G1.1 to G11.7) to view its associated scene</li>
            <li>• Some tiles have content, others will show "Scene Not Found"</li>
            <li>• Each scene contains a title, description, and optional animation</li>
            <li>• Use the close button or click outside to dismiss the scene viewer</li>
          </ul>
        </div>

        {/* Scene Viewer Modal */}
        {(selectedScene || isLoading || error) && (
          <SceneViewer
            scene={selectedScene}
            isLoading={isLoading}
            error={error}
            onClose={handleCloseScene}
          />
        )}
      </div>
    </div>
  );
};

export default GridPlay; 