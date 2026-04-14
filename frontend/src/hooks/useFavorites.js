
    import { useState, useEffect, useCallback } from 'react';
    import { useToast } from "@/components/ui/use-toast";

    const FAVORITES_STORAGE_KEY = 'userFavorites';

    export const useFavorites = () => {
      const [favoriteIds, setFavoriteIds] = useState(new Set());
      const { toast } = useToast();

      useEffect(() => {
        const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (storedFavorites) {
          try {
            const parsedFavorites = JSON.parse(storedFavorites);
            if (Array.isArray(parsedFavorites)) {
              setFavoriteIds(new Set(parsedFavorites));
            } else {
              console.warn("Stored favorites is not an array, resetting.");
              localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([]));
            }
          } catch (error) {
            console.error("Error parsing favorites from localStorage:", error);
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([]));
          }
        }
      }, []);

      const updateLocalStorage = (updatedFavoritesSet) => {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(updatedFavoritesSet)));
      };

      const addFavorite = useCallback((productId) => {
        setFavoriteIds(prevFavorites => {
          const newFavorites = new Set(prevFavorites);
          newFavorites.add(productId);
          updateLocalStorage(newFavorites);
          return newFavorites;
        });
        toast({
          title: "Added to Favorites",
          description: "Product added to your favorites list.",
        });
      }, [toast]);

      const removeFavorite = useCallback((productId) => {
        setFavoriteIds(prevFavorites => {
          const newFavorites = new Set(prevFavorites);
          newFavorites.delete(productId);
          updateLocalStorage(newFavorites);
          return newFavorites;
        });
        toast({
          title: "Removed from Favorites",
          description: "Product removed from your favorites list.",
          variant: "destructive"
        });
      }, [toast]);

      const isFavorite = useCallback((productId) => {
        return favoriteIds.has(productId);
      }, [favoriteIds]);

      const toggleFavorite = useCallback((productId, productName = "Product") => {
        if (isFavorite(productId)) {
          removeFavorite(productId);
        } else {
          addFavorite(productId);
        }
      }, [addFavorite, removeFavorite, isFavorite]);
      
      const getFavoriteProductIds = useCallback(() => {
        return Array.from(favoriteIds);
      }, [favoriteIds]);

      return { favoriteIds, addFavorite, removeFavorite, isFavorite, toggleFavorite, getFavoriteProductIds };
    };
  