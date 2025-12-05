import { useState, useEffect, useContext } from "react";
import { FavContext } from "../App";

export interface PkmnFavourite {
  name: string;
  description: string;
  shakespeareanDescription: string;
  spriteUrl?: string;
}

const STORAGE_KEY = "favourite-pokemons";

export function useFavourites() {
  const {favourites, setFavourites} = useContext(FavContext);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setFavourites(JSON.parse(raw));
      }
    } catch (error) {
      console.error("Failed to load favourites from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever favourites change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
      } catch (error) {
        console.error("Failed to save favourites to localStorage:", error);
      }
    }
  }, [favourites, isLoading]);

  const addFavourite = (pkmn: PkmnFavourite) => {
    const exists = favourites.some((fav) => fav.name.toLowerCase() === pkmn.name.toLowerCase());
    if (!exists) {
      setFavourites([pkmn, ...favourites]);
    }
  };

  const removeFavourite = (name: string) => {
    setFavourites(favourites.filter((fav) => fav.name.toLowerCase() !== name.toLowerCase()));
  };
  
  const clearAll = () => {
    setFavourites([]);
  };

  return {
    favourites,
    addFavourite,
    removeFavourite,
    clearAll,
    isLoading,
  };
}