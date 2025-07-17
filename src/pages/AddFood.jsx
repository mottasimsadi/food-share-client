import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import {
  FaUpload,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaFileAlt,
  FaUser,
  FaEnvelope,
  FaImage,
} from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const AddFood = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    foodName: "",
    foodImage: "",
    foodQuantity: "",
    pickupLocation: "",
    expireDate: "",
    additionalNotes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const expireDate = new Date(`${formData.expireDate}`)
        .toISOString()
        .split("T")[0];

      const foodData = {
        ...formData,
        expireDate,
        donorImage: user?.photoURL || "/api/placeholder/60/60",
        donorName: user?.displayName || user?.email || "Unknown User",
        donorEmail: user?.email || "",
        status: "available",
        dateAdded: new Date().toISOString(),
      };

      // Send to backend
      axios.post("http://localhost:3000/add-food", foodData).then((res) => {
        // console.log("🚀 ~ axios.post ~ res:", res);
        
        // Show success
        Swal.fire({
          icon: "success",
          title: "Food added successfully!",
          confirmButtonColor: "#4CAF50",
        });

        // Reset form
        setFormData({
          foodName: "",
          foodImage: "",
          foodQuantity: "",
          pickupLocation: "",
          expireDate: "",
          additionalNotes: "",
        });
        setLoading(false);
      });
    } catch (error) {
      console.error("Error adding food:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to add food",
        text: "Please try again.",
        confirmButtonColor: "#d33",
      });
      setLoading(false);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Add Food</h1>
            <p className="text-xl text-base-content/70">
              Share your surplus food with the community
            </p>
          </div>

          <div className="bg-gray-700 rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Food Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-white">
                    Food Name
                  </span>
                </label>
                <input
                  type="text"
                  name="foodName"
                  value={formData.foodName}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="Enter food name"
                  required
                />
              </div>

              {/* Food Image */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-white">
                    Food Image URL
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    name="foodImage"
                    value={formData.foodImage}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-10"
                    placeholder="Enter image URL"
                    required
                  />
                  <FaImage
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
                    size={20}
                  />
                </div>
              </div>

              {/* Food Quantity */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-white">
                    Food Quantity
                  </span>
                </label>
                <input
                  type="text"
                  name="foodQuantity"
                  value={formData.foodQuantity}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="e.g., 5 kg, 10 portions, 8 items"
                  required
                />
              </div>

              {/* Pickup Location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-white">
                    Pickup Location
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="pickupLocation"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-10"
                    placeholder="Enter pickup location"
                    required
                  />
                  <FaMapMarkerAlt
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
                    size={20}
                  />
                </div>
              </div>

              {/* Expire Date */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-white">
                    Expire Date
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="expireDate"
                    value={formData.expireDate}
                    onChange={handleChange}
                    className="input input-bordered w-full pl-10"
                    min={getCurrentDate()}
                    required
                  />
                  <FaCalendarAlt
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
                    size={20}
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-white">
                    Additional Notes
                  </span>
                </label>
                <div className="relative">
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full pl-10 pt-10"
                    placeholder="Any additional information about the food..."
                    rows={4}
                  />
                  <FaFileAlt
                    className="absolute left-3 top-3 text-base-content/50"
                    size={20}
                  />
                </div>
              </div>

              {/* Donor Information (Auto-filled) */}
              <div className="bg-base-100 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Donor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-white">Donor Name</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={user?.displayName || user?.email || ""}
                        className="input input-bordered w-full pl-10"
                        disabled
                      />
                      <FaUser
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
                        size={20}
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-white">Donor Email</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={user?.email || ""}
                        className="input input-bordered w-full pl-10"
                        disabled
                      />
                      <FaEnvelope
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50"
                        size={20}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn bg-transparent border-white text-white flex-1 hover:text-[#ff6b35] hover:border-[#ff6b35]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn bg-[#ff6b35] border-none flex-1 hover:opacity-70"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <FaUpload className="mr-2" />
                      Add Food
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddFood;
