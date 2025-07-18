import React, { useState, useEffect } from "react";
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
} from "react-icons/fa";

const AvailableFoods = () => {
  const [availableFoods, setAvailableFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [layout, setLayout] = useState("grid-3");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("expireDate");

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

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get("http://localhost:3000/available-foods", {
          params: {
            search: searchTerm,
            sort: sortBy,
          },
        });
        const enriched = res.data.map((item) => ({
          ...item,
          name: item.foodName,
          location: item.pickupLocation,
          donor: item.donorName || "Anonymous",
          quantity: item.foodQuantity,
          image: item.imageUrl,
          expireDate: new Date(item.expireDate),
          expiresIn: calculateExpiresIn(item.expireDate),
        }));

        setAvailableFoods(enriched);
      } catch (error) {
        console.error("Failed to fetch foods:", error);
      }
    };

    fetchFoods();
  }, [searchTerm, sortBy]);

  useEffect(() => {
    const filtered = availableFoods.filter((food) =>
      food.foodName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFoods(filtered);
  }, [availableFoods, searchTerm]);

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
                {layout === "grid-3" ? <FaThLarge /> : <FaList />}
                {layout === "grid-3" ? "3 Columns" : "2 Columns"}
              </button>
            </div>
          </div>
        </motion.div>

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
          {filteredFoods.map((food, index) => (
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
                    {food.expiresIn}
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

        {filteredFoods.length === 0 && (
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
  );
};

export default AvailableFoods;