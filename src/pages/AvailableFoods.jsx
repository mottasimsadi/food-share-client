import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import axios from "axios";
import {
  FaSearch,
  FaFilter,
  FaThLarge,
  FaList,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { FavoritesContext } from "../providers/FavoritesProvider";
import Swal from "sweetalert2";

const axiosInstance = axios.create({
  baseURL: "https://food-share-server-one.vercel.app",
});

const AvailableFoods = () => {
  const [layout, setLayout] = useState("grid-3");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("expireDate");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Get favorites state and functions from the context
  const { favorites, addFavorite, removeFavorite } =
    useContext(FavoritesContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const calculateExpiresIn = (expireDateStr) => {
    const now = new Date();
    const expireDate = new Date(expireDateStr);
    const diff = expireDate - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    let result = "";
    if (days > 0) result += `${days}d `;
    if (hours > 0 || days > 0) result += `${hours}h `;
    result += `${minutes}m`;

    return result;
  };

  const {
    data: foods = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["available-foods", debouncedSearchTerm, sortBy],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/available-foods", {
        params: { search: debouncedSearchTerm, sort: sortBy },
      });
      // Enrich data with expires-in calculation
      return data.map((item) => ({
        ...item,
        expiresIn: calculateExpiresIn(item.expireDate),
      }));
    },
    keepPreviousData: true,
  });

  const toggleLayout = () => {
    setLayout((prev) => (prev === "grid-3" ? "grid-2" : "grid-3"));
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-20 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Available Foods</h1>
          <p className="text-xl text-base-content/70">
            Discover food available in your community
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-base-200 rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control relative">
              <input
                type="text"
                placeholder="Search foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
              <FaSearch
                className="absolute left-3 top-3.5 text-base-content/50"
                size={16}
              />
            </div>

            <div className="form-control">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="expireDate">Sort by Expire Date</option>
                <option value="quantity">Sort by Quantity</option>
                <option value="location">Sort by Location</option>
              </select>
            </div>

            <div className="flex items-center justify-center">
              <button onClick={toggleLayout} className="btn btn-outline gap-2">
                {layout === "grid-3" ? <FaThLarge /> : <FaList />}{" "}
                {layout === "grid-3" ? "3 Columns" : "2 Columns"}
              </button>
            </div>
          </div>
        </motion.div>

        <div>
          {isLoading && (
            <div className="text-center py-20">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
          {isError && (
            <div role="alert" className="alert alert-error">
              <span>Error: {error.message}</span>
            </div>
          )}
          {!isLoading && !isError && foods.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`grid gap-6 ${
                layout === "grid-3"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 md:grid-cols-2"
              }`}
            >
              {foods.map((food, index) => {
                const isFavorite = favorites.some(
                  (fav) => fav._id === food._id
                );
                const handleToggleFavorite = (e) => {
                  e.stopPropagation();
                  if (isFavorite) {
                    removeFavorite(food._id);
                    Swal.fire({
                      icon: "info",
                      title: "Removed!",
                      text: `${food.foodName} removed from favorites.`,
                      timer: 1500,
                      showConfirmButton: false,
                    });
                  } else {
                    addFavorite(food);
                    Swal.fire({
                      icon: "success",
                      title: "Added!",
                      text: `${food.foodName} added to favorites.`,
                      timer: 1500,
                      showConfirmButton: false,
                    });
                  }
                };

                return (
                  <motion.div
                    key={food._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-base-100 rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl"
                  >
                    <div className="aspect-video w-full bg-base-200 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={food.foodImage}
                        alt={food.foodName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {food.foodName}
                    </h3>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2 text-base-content/70">
                        <FaClock size={16} />
                        <span>Expires in: </span>
                        <span className="font-medium text-warning">
                          {food.expiresIn}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-base-content/70">
                        <FaMapMarkerAlt size={16} />
                        <span>Location: </span>
                        <span className="font-medium">
                          {food.pickupLocation}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-base-content/70">
                        <FaUser size={16} />
                        <span>Donor: </span>
                        <span className="font-medium text-primary">
                          {food.donorName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-base-content/70">
                        <span>Quantity: </span>
                        <span className="font-medium">{food.foodQuantity}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleToggleFavorite}
                        className="btn btn-ghost btn-circle"
                        aria-label="Toggle Favorite"
                      >
                        {isFavorite ? (
                          <FaHeart size={22} className="text-red-500" />
                        ) : (
                          <FaRegHeart size={22} />
                        )}
                      </button>
                      <Link
                        to={`/food/${food._id}`}
                        className="btn bg-[#ff6b35] flex-1 hover:opacity-70"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
          {!isLoading && !isError && foods.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <div className="text-base-content/50 mb-4">
                <FaFilter size={64} className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No foods found</h3>
              <p className="text-base-content/70">
                Try adjusting your search or filters to find available foods
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableFoods;