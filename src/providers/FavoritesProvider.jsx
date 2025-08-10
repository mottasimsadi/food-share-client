import React, { createContext, useState, useEffect } from "react";

// Create the context
export const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on initial component mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("foodshare_favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
      setFavorites([]); // Reset to empty array on error
    }
  }, []);

  // Function to add a food item to favorites
  const addFavorite = (food) => {
    const newFavorites = [...favorites, food];
    setFavorites(newFavorites);
    localStorage.setItem("foodshare_favorites", JSON.stringify(newFavorites));
  };

  // Function to remove a food item from favorites
  const removeFavorite = (foodId) => {
    const newFavorites = favorites.filter((fav) => fav._id !== foodId);
    setFavorites(newFavorites);
    localStorage.setItem("foodshare_favorites", JSON.stringify(newFavorites));
  };

  // The value that will be available to all consumer components
  const contextValue = {
    favorites,
    addFavorite,
    removeFavorite,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};
