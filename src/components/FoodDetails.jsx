import React, { useContext, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import {
  FaArrowLeft,
  FaClock,
  FaMapMarkerAlt,
  FaEnvelope,
  FaCalendarAlt,
  FaFileAlt,
} from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";

const FoodDetails = () => {
  const food = useLoaderData();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState("");

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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCurrentDateTime = () => {
    return new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handleRequestFood = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  const handleSubmitRequest = () => {
    const requestData = {
      foodId: food._id,
      foodName: food.foodName,
      foodImage: food.foodImage,
      donorEmail: food.donorEmail,
      donorName: food.donorName,
      userEmail: user.email,
      requestDate: new Date().toISOString(),
      pickupLocation: food.pickupLocation,
      expireDate: food.expireDate,
      additionalNotes,
    };

    try {
      // 1. PATCH request to update food status
      axios
        .patch(
          `https://food-share-server-one.vercel.app/request/${food._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        )
        .then((res) => console.log(res.data));

      // 2. POST request to save request
      axios.post(
        "https://food-share-server-one.vercel.app/requests",
        requestData
      );

      setShowModal(false);
      Swal.fire({
        icon: "success",
        title: "Request Sent!",
        text: "Your food request has been submitted.",
        confirmButtonColor: "#22c55e",
      });
      // Invalidate queries before navigating
      queryClient.invalidateQueries(["requestedBy", user.email]);
      navigate("/my-requests");
    } catch (error) {
      console.error("Error submitting request:", error);
      Swal.fire(
        "Error",
        "Something went wrong while submitting your request.",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen bg-base-100 px-4 py-10">
      <div className="container mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate(-1)}
          className="btn btn-ghost gap-2 mb-6"
        >
          <FaArrowLeft />
          Back to Foods
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Food Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="aspect-square w-full bg-base-200 rounded-2xl overflow-hidden"
          >
            <img
              src={food.foodImage || "/placeholder.jpg"}
              alt={food.foodName}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Food Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold mb-2">{food.foodName}</h1>
              <div className="badge badge-success badge-lg capitalize mt-2">
                {food.status}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-base-200 rounded-lg p-4">
                <div className="flex items-center text-base-content/70 gap-2 mb-2">
                  <FaClock size={20} />
                  <span>Expires in</span>
                </div>
                <div className="text-lg font-semibold text-warning">
                  {calculateExpiresIn(food.expireDate)}
                </div>
              </div>

              <div className="bg-base-200 rounded-lg p-4">
                <div className="flex items-center text-base-content/70 gap-2 mb-2">
                  <FaMapMarkerAlt size={20} />
                  <span>Pickup Location</span>
                </div>
                <div className="text-lg font-semibold">
                  {food.pickupLocation}
                </div>
              </div>

              <div className="bg-base-200 rounded-lg p-4">
                <span className="text-base-content/70">Quantity</span>
                <div className="text-lg font-semibold">
                  {food.foodQuantity} {food.unit}
                </div>
              </div>

              <div className="bg-base-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-base-content/70 mb-2">
                  <FaCalendarAlt />
                  <span>Expire Date</span>
                </div>
                <div className="text-lg font-semibold">
                  {formatDate(food.expireDate)}
                </div>
              </div>
            </div>

            {/* Donor Information */}
            <div className="bg-base-200 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Donor Information</h3>
              <div className="flex items-center gap-3">
                <div className="bg-gray-300 w-12 h-12 rounded-full flex items-center justify-center text-lg overflow-hidden">
                  <img src={food.donorImage} alt="Donor" />
                </div>
                <div>
                  <div className="font-medium">{food.donorName}</div>
                  <div className="text-sm text-base-content/70 flex items-center gap-1">
                    <FaEnvelope size={14} />
                    {food.donorEmail}
                  </div>
                </div>
              </div>
            </div>

            {food.additionalNotes && (
              <div className="bg-base-200 rounded-lg p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FaFileAlt size={20} />
                  Additional Notes
                </h3>
                <p className="text-base-content/80">{food.additionalNotes}</p>
              </div>
            )}

            {/* Action */}
            <div className="flex gap-4">
              <button
                onClick={handleRequestFood}
                className="btn bg-[#ff6b35] hover:opacity-70 flex-1"
              >
                Request Food
              </button>
            </div>
          </motion.div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center px-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-base-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg p-6 relative"
              >
                <h2 className="text-2xl font-bold mb-4 text-center">
                  🍽️ Request This Food
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Food Name", value: food.foodName },
                    { label: "Food ID", value: food._id },
                    { label: "Donator Name", value: food.donorName },
                    { label: "Donator Email", value: food.donorEmail },
                    { label: "User Email", value: user?.email },
                    { label: "Pickup Location", value: food.pickupLocation },
                    {
                      label: "Expire Date",
                      value: formatDate(food.expireDate),
                    },
                    { label: "Request Date", value: getCurrentDateTime() },
                  ].map((field) => (
                    <div className="form-control" key={field.label}>
                      <label className="label text-sm font-medium mb-2">
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={field.value}
                        className="input input-bordered input-sm"
                        disabled
                      />
                    </div>
                  ))}
                </div>

                {/* Food Image */}
                <div className="my-4">
                  <label className="label text-sm font-medium mb-2">
                    Food Image
                  </label>
                  <img
                    src={food.foodImage}
                    alt="Food"
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                </div>

                {/* Additional Notes */}
                <div className="form-control mb-6">
                  <label className="label text-sm font-medium">
                    Additional Notes
                  </label>{" "}
                  <textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="textarea"
                    placeholder="Any additional notes or requests..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn hover:text-[#ff6b35] hover:border-[#ff6b35] text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitRequest}
                    className="btn bg-[#ff6b35] hover:opacity-80 text-white text-sm"
                  >
                    Submit Request
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FoodDetails;
