import { useCallback, useState } from 'react';
import { Assets } from 'pixi.js';

/**
 * Custom hook for handling asset loading with progress tracking
 */
const useLoader = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load assets with progress tracking
   * @param {Object} assets - Object with key-value pairs of asset ID and URL
   * @param {Function} onComplete - Callback function when loading is complete
   */
  const loadAssets = useCallback(async (assets, onComplete) => {
    if (!assets || Object.keys(assets).length === 0) {
      setProgress(100);
      setIsComplete(true);
      onComplete && onComplete();
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsComplete(false);
    setProgress(0);

    try {
      // Create bundles from assets
      Object.entries(assets).forEach(([key, value]) => {
        Assets.add(key, value);
      });

      // Load all assets and track progress
      await Assets.load(Object.keys(assets), (progressValue) => {
        const percent = Math.round(progressValue * 100);
        setProgress(percent);
      });

      setIsComplete(true);
      setIsLoading(false);
      onComplete && onComplete();
    } catch (err) {
      setError(err.message || 'Failed to load assets');
      setIsLoading(false);
      console.error('Asset loading error:', err);
    }
  }, []);

  return {
    loadAssets,
    progress,
    isLoading,
    isComplete,
    error,
  };
};

export default useLoader; 