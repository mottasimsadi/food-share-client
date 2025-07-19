import React, { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ManageMyFoods = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [formData, setFormData] = useState({
    foodName: "",
    foodImage: "",
    foodQuantity: "",
    pickupLocation: "",
    expireDate: "",
    additionalNotes: "",
  });

  // Fetch user's foods
  const {
    data: foods = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userFoods", user?.email],
    queryFn: async () => {
      const { data } = await axios.get(
        "https://food-share-server-one.vercel.app/manage-foods",
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
      return data;
    },
    enabled: !!user,
    refetchOnMount: "always",
  });

  // Mutation for deleting a food item
  const deleteMutation = useMutation({
    mutationFn: async (foodId) => {
      await axios.delete(
        `https://food-share-server-one.vercel.app/foods/${foodId}`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userFoods", user?.email]);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Food item has been deleted.",
        confirmButtonColor: "#22c55e",
      });
    },
    onError: (error) => {
      console.error("Error deleting food:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete food item.",
        confirmButtonColor: "#ef4444",
      });
    },
  });

  // Mutation for updating a food item
  const updateMutation = useMutation({
    mutationFn: async ({ foodId, updatedData }) => {
      await axios.patch(
        `https://food-share-server-one.vercel.app/foods/${foodId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userFoods", user?.email]);
      setShowModal(false);
      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Food item has been updated.",
        confirmButtonColor: "#22c55e",
      });
    },
    onError: (error) => {
      console.error("Error updating food:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update food item.",
        confirmButtonColor: "#ef4444",
      });
    },
  });

  // Handle delete with confirmation
  const handleDelete = (foodId, foodName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${foodName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(foodId);
      }
    });
  };

  // Handle edit button click
  const handleEdit = (food) => {
    setSelectedFood(food);
    setFormData({
      foodName: food.foodName,
      foodImage: food.foodImage,
      foodQuantity: food.foodQuantity,
      pickupLocation: food.pickupLocation,
      expireDate: new Date(food.expireDate).toISOString().split("T")[0],
      additionalNotes: food.additionalNotes || "",
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update form submission
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      foodId: selectedFood._id,
      updatedData: {
        ...formData,
        expireDate: new Date(formData.expireDate).toISOString(),
      },
    });
  };

  if (!user) {
    return (
      <motion.div
        className="min-h-screen bg-base-100 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-error mb-4">Access Denied</h1>
          <p className="text-base-content/70">
            Please log in to manage your foods.
          </p>
        </div>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen bg-base-100 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-primary text-4xl" />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen bg-base-100 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-error mb-4">
            Error Loading Foods
          </h1>
          <p className="text-base-content/70">Please try again later.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-base-100 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl text-center font-bold text-base-content mb-2">
            Manage My Foods
          </h1>
          <p className="text-base-content/70 text-center">
            View and manage the food items you've added for sharing
          </p>
        </motion.div>

        {foods.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-12"
          >
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4">No Foods Added Yet</h2>
              <p className="text-base-content/70 mb-6">
                You haven't added any food items for sharing yet. Start by
                adding your first food item!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/add-food")}
                className="btn bg-[#ff6b35] hover:opacity-70 text-white"
              >
                Add Your First Food
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="overflow-x-auto"
          >
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Food Item</th>
                  <th>Quantity</th>
                  <th>Location</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food, index) => (
                  <motion.tr
                    key={food._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.005 }}
                  >
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src={food.foodImage || "/placeholder.jpg"}
                              alt={food.foodName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{food.foodName}</div>
                          <div className="text-sm opacity-50 truncate max-w-xs">
                            {food.additionalNotes}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-secondary whitespace-nowrap">
                        {food.foodQuantity}
                      </span>
                    </td>
                    <td className="max-w-xs truncate">{food.pickupLocation}</td>
                    <td>{new Date(food.expireDate).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`badge ${
                          food.status === "available"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {food.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(food)}
                          className="btn btn-outline btn-sm"
                        >
                          <FaEdit className="h-4 w-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(food._id, food.foodName)}
                          className="btn btn-error btn-sm"
                        >
                          <FaTrash className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Update Modal */}
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
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-bold mb-4 text-center"
                >
                  🍽️ Update Food Item
                </motion.h2>
                <form onSubmit={handleUpdateSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: "Food Name", name: "foodName", type: "text" },
                      {
                        label: "Food Image URL",
                        name: "foodImage",
                        type: "text",
                      },
                      { label: "Quantity", name: "foodQuantity", type: "text" },
                      {
                        label: "Pickup Location",
                        name: "pickupLocation",
                        type: "text",
                      },
                      {
                        label: "Expire Date",
                        name: "expireDate",
                        type: "date",
                      },
                    ].map((field, index) => (
                      <motion.div
                        key={field.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="form-control"
                      >
                        <label className="label text-sm font-medium mb-2">
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          className="input input-sm"
                          required
                        />
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="form-control mt-4"
                  >
                    <label className="label text-sm font-medium">
                      Additional Notes
                    </label>{" "}
                    <textarea
                      name="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={handleInputChange}
                      className="textarea"
                      placeholder="Any additional notes..."
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="flex justify-end gap-3 mt-6"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="btn hover:text-[#ff6b35] hover:border-[#ff6b35] text-sm"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className="btn bg-[#ff6b35] hover:opacity-80 text-white text-sm"
                    >
                      Update Food
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ManageMyFoods;
