import React, { useContext } from "react";
import { motion } from "framer-motion";
import { FaClock, FaHeart, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { FavoritesContext } from "../providers/FavoritesProvider";
import { Link } from "react-router";

const FavoriteFoods = () => {
  const { favorites } = useContext(FavoritesContext);

  // Function to calculate expiration time
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

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 md:px-20 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">My Favorite Foods</h1>
          <p className="text-xl text-base-content/70">
            A collection of food items you've saved.
          </p>
        </motion.div>

        {favorites.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {favorites.map((food, index) => (
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
                    alt={food.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="text-xl font-semibold mb-3">{food.foodName}</h3>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-base-content/70">
                    <FaClock size={16} />
                    <span>Expires in: </span>
                    <span className="font-medium text-warning">
                      {calculateExpiresIn(food.expireDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-base-content/70">
                    <FaMapMarkerAlt size={16} />
                    <span>Location: </span>
                    <span className="font-medium">{food.pickupLocation}</span>
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
                  <Link
                    to={`/food/${food._id}`}
                    className="btn bg-[#ff6b35] flex-1 hover:opacity-70"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <div className="text-base-content/30 mb-4">
              <FaHeart size={64} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No Favorites Yet</h3>
            <p className="text-base-content/70">
              Click the heart icon on any food item to save it here!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FavoriteFoods;
