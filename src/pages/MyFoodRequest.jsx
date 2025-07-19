import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaEnvelope,
} from "react-icons/fa";

const MyFoodRequest = () => {
  const { user } = useContext(AuthContext);

  const fetchMyRequests = async () => {
    const res = await axios.get("http://localhost:3000/my-requests", {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
    return res.data;
  };

  const {
    data: requests = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["requestedBy", user?.email],
    queryFn: fetchMyRequests,
    enabled: !!user?.accessToken,
    refetchOnMount: "always",
    onError: (error) => {
      Swal.fire("Error!", "Failed to load requests", "error");
    },
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";

    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime())
        ? "Invalid Date"
        : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
    } catch {
      return "Invalid Date";
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <span className="loading loading-spinner text-primary loading-lg" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-base-100 py-10 px-4 md:px-20"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="container mx-auto"
      >
        <motion.h1 className="text-3xl font-bold mb-12 text-center">
          My Food Requests
        </motion.h1>

        <AnimatePresence>
          {requests.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mt-10"
            >
              <p className="text-lg mb-4">
                You haven't requested any food items yet.
              </p>
              <motion.a
                href="/available-foods"
                className="btn bg-[#ff6b35] hover:text-[#ff6b35] hover:bg-transparent hover:border-[#ff6b35]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse Available Foods
              </motion.a>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {requests.map((req, index) => (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ scale: 1.03 }}
                    className="shadow-xl rounded-lg overflow-hidden transition hover:shadow-lg"
                    layout
                  >
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <img
                        src={req.foodImage}
                        alt={req.foodName}
                        className="w-full h-40 object-cover"
                      />
                    </motion.div>

                    <motion.div
                      className="p-4 space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <h2 className="text-xl font-semibold">{req.foodName}</h2>

                      <div className="grid grid-cols-1 gap-2">
                        <motion.div
                          className="flex items-center gap-2 text-sm text-base-content/70"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.4 }}
                        >
                          <FaUser /> Donor: {req.donorName}
                        </motion.div>

                        <motion.div
                          className="flex items-center gap-2 text-sm text-base-content/70"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.45 }}
                        >
                          <FaMapMarkerAlt /> {req.pickupLocation}
                        </motion.div>

                        <motion.div
                          className="flex items-center gap-2 text-sm text-base-content/70"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                        >
                          <FaCalendarAlt /> Expires:{" "}
                          {formatDate(req.expireDate)}
                        </motion.div>

                        <motion.div
                          className="flex items-center gap-2 text-sm text-base-content/70"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.55 }}
                        >
                          <FaClock /> Requested: {formatDate(req.requestDate)}
                        </motion.div>
                      </div>

                      {req.additionalNotes && (
                        <motion.div
                          className="bg-gray-500 p-2 rounded text-sm mt-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.6 }}
                        >
                          <strong>Notes:</strong> {req.additionalNotes}
                        </motion.div>
                      )}

                      <motion.div
                        className="flex items-center justify-between mt-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.7 }}
                      >
                        <div className="flex items-center gap-2 text-sm text-base-content/70">
                          <FaEnvelope /> {req.donorEmail}
                        </div>
                        {req.status === "approved" ? (
                          <motion.span
                            className="badge badge-success gap-1 text-white"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              delay: index * 0.1 + 0.8,
                            }}
                          >
                            <FaCheckCircle /> Approved
                          </motion.span>
                        ) : (
                          <motion.span
                            className="badge badge-warning text-white"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              delay: index * 0.1 + 0.8,
                            }}
                          >
                            Pending
                          </motion.span>
                        )}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default MyFoodRequest;
