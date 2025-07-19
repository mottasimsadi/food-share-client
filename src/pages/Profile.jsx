import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import {
  FaEnvelope,
  FaMapPin,
  FaClock,
  FaCalendarAlt,
  FaEdit,
  FaUpload,
  FaHeart,
  FaUsers,
  FaStar,
  FaTrophy,
} from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import axios from "axios";
import Swal from "sweetalert2";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [donatedFoods, setDonatedFoods] = useState([]);
  const [requestedFoods, setRequestedFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || user?.email || "",
    photoURL:
      user?.photoURL ||
      "https://img.icons8.com/?size=100&id=H101gtpJBVoh&format=png&color=ffffff",
    email: user?.email || "",
    bio:
      user?.bio ||
      "Passionate about reducing food waste and helping the community!",
    location: user?.location || "Downtown Area",
    joinDate: user?.metadata?.creationTime
      ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "January 2022",
  });
  const [editData, setEditData] = useState(profileData);

  // Calculate stats dynamically
  const stats = [
    {
      icon: FaHeart,
      label: "Foods Shared",
      value: donatedFoods.length,
      color: "text-error",
    },
    {
      icon: FaUsers,
      label: "People Helped",
      value: requestedFoods.filter((req) => req.status === "approved").length,
      color: "text-success",
    },
    {
      icon: FaTrophy,
      label: "Community Points",
      value:
        donatedFoods.length * 10 +
        requestedFoods.filter((req) => req.status === "approved").length * 5,
      color: "text-warning",
    },
    {
      icon: FaStar,
      label: "Rating",
      value: donatedFoods.length > 0 ? "4.9" : "N/A",
      color: "text-info",
    },
  ];

  // Simulated recent activity based on donated and requested foods
  const recentActivity = [
    ...donatedFoods.slice(0, 2).map((food) => ({
      action: `Shared ${food.foodName}`,
      time: new Date(food.dateAdded).toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      type: "share",
    })),
    ...requestedFoods.slice(0, 2).map((req) => ({
      action: `Requested ${req.foodName}`,
      time: new Date(req.requestDate).toLocaleString("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      }),
      type: "request",
    })),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 4);

  // Simulated badges based on activity
  const badges = [
    donatedFoods.length >= 10 && {
      name: "Super Sharer",
      description: "Shared 10+ items",
      color: "badge-primary",
    },
    requestedFoods.filter((req) => req.status === "approved").length >= 5 && {
      name: "Community Hero",
      description: "Helped 5+ people",
      color: "badge-secondary",
    },
    new Date().getFullYear() -
      new Date(user?.metadata?.creationTime).getFullYear() >=
      2 && {
      name: "Early Adopter",
      description: "One of our first users",
      color: "badge-accent",
    },
    donatedFoods.length >= 5 && {
      name: "Reliable Helper",
      description: "Consistently sharing food",
      color: "badge-success",
    },
  ].filter(Boolean);

  // Fetch donated and requested foods
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [donatedRes, requestedRes] = await Promise.all([
          axios.get("https://food-share-server-one.vercel.app/manage-foods", {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }),
          axios.get("https://food-share-server-one.vercel.app/my-requests", {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }),
        ]);
        setDonatedFoods(donatedRes.data);
        setRequestedFoods(requestedRes.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to load profile data",
          text: error.response?.data?.error || "Please try again.",
          confirmButtonColor: "#d33",
        });
      }
      setIsLoading(false);
    };

    if (user?.accessToken) {
      fetchData();
    }
  }, [user]);

  // Handle profile update
  const handleSave = async () => {
    try {
      await user.updateProfile({
        displayName: editData.displayName,
        photoURL: editData.photoURL,
      });
      setProfileData(editData);
      setIsEditing(false);
      Swal.fire({
        icon: "success",
        title: "Profile updated successfully!",
        confirmButtonColor: "#ff6b35",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to update profile",
        text: error.message || "Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

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

  function calculateExpiresIn(expireDateStr) {
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
  }

  if (!user) {
    navigate("/login");
    return null;
  }

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
    <div className="min-h-screen bg-base-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-base-200 rounded-2xl p-8 mb-8 shadow-xl"
        >
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                <img
                  src={profileData.photoURL}
                  alt={profileData.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                className="absolute bottom-0 right-0 btn btn-circle btn-sm bg-[#ff6b35] text-white hover:opacity-70"
                onClick={() =>
                  Swal.fire({
                    icon: "info",
                    title: "Photo upload coming soon!",
                    confirmButtonColor: "#ff6b35",
                  })
                }
              >
                <FaUpload size={16} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Display Name
                      </span>
                    </label>
                    <input
                      name="displayName"
                      value={editData.displayName}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Bio</span>
                    </label>
                    <textarea
                      name="bio"
                      value={editData.bio}
                      onChange={handleChange}
                      className="textarea textarea-bordered w-full"
                      placeholder="Tell us about yourself"
                      rows={3}
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Location</span>
                    </label>
                    <input
                      name="location"
                      value={editData.location}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="Enter your location"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="btn bg-transparent border-white text-white flex-1 hover:text-[#ff6b35] hover:border-[#ff6b35]"
                    >
                      <FaEdit className="mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="btn bg-[#ff6b35] border-none flex-1 hover:opacity-70"
                    >
                      <FaUpload className="mr-2" />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-3xl font-bold">
                      {profileData.displayName}
                    </h1>
                    <span
                      className={`badge ${
                        user.emailVerified ? "badge-primary" : "badge-warning"
                      }`}
                    >
                      {user.emailVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                  <p className="text-base-content/70 mb-4">{profileData.bio}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaEnvelope size={16} className="text-[#ff6b35]" />
                      <span>{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapPin size={16} className="text-[#ff6b35]" />
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt size={16} className="text-[#ff6b35]" />
                      <span>Joined {profileData.joinDate}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn bg-[#ff6b35] hover:opacity-70 mt-4"
                  >
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold mb-6">Community Impact</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-base-200 rounded-lg p-4 text-center shadow"
                  >
                    <div className={`${stat.color} mb-2 flex justify-center`}>
                      <stat.icon size={24} />
                    </div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-base-content/70">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-base-200 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 bg-base-100 rounded-lg"
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "share"
                            ? "bg-primary"
                            : "bg-warning"
                        }`}
                      ></div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-base-content/70">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Donated Foods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">My Donated Foods</h2>
              {donatedFoods.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-lg mb-4">
                    You haven't donated any foods yet.
                  </p>
                  <button
                    onClick={() => navigate("/add-food")}
                    className="btn bg-[#ff6b35] hover:opacity-70"
                  >
                    Add Food
                  </button>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence>
                    {donatedFoods.map((food, index) => (
                      <motion.div
                        key={food._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ scale: 1.03 }}
                        className="shadow-xl rounded-lg overflow-hidden transition hover:shadow-lg"
                        layout
                      >
                        <img
                          src={food.foodImage || "/placeholder.jpg"}
                          alt={food.foodName}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4 space-y-2">
                          <h3 className="text-xl font-semibold">
                            {food.foodName}
                          </h3>
                          <div className="text-sm text-base-content/70">
                            <div className="flex items-center gap-2">
                              <FaClock size={16} />
                              <span>Expires in: </span>
                              <span className="font-medium text-warning">
                                {new Date(food.expireDate) < new Date()
                                  ? "Expired"
                                  : calculateExpiresIn(food.expireDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaMapPin size={16} />
                              <span>Location: </span>
                              <span className="font-medium">
                                {food.pickupLocation}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>Quantity: </span>
                              <span className="font-medium">
                                {food.foodQuantity} {food.unit || ""}
                              </span>
                            </div>
                            {food.additionalNotes && (
                              <div className="bg-gray-500 p-2 rounded text-sm mt-2">
                                <strong>Notes:</strong> {food.additionalNotes}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => navigate(`/food/${food._id}`)}
                            className="btn bg-[#ff6b35] w-full mt-4 hover:opacity-70"
                          >
                            View Details
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Achievement Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-base-200 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-4">Achievement Badges</h2>
                <div className="space-y-4">
                  {badges.length === 0 ? (
                    <p className="text-sm text-base-content/70">
                      No badges earned yet.
                    </p>
                  ) : (
                    badges.map((badge, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-base-100 rounded-lg"
                      >
                        <span
                          className={`badge ${badge.color} whitespace-nowrap`}
                        >
                          {badge.name}
                        </span>
                        <div>
                          <p className="text-sm text-base-content/70">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="bg-base-200 rounded-2xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/add-food")}
                    className="btn bg-[#ff6b35] w-full hover:opacity-70"
                  >
                    Share New Food
                  </button>
                  <button
                    onClick={() => navigate("/manage-foods")}
                    className="btn btn-outline w-full hover:text-[#ff6b35] hover:border-[#ff6b35]"
                  >
                    Manage My Foods
                  </button>
                  <button
                    onClick={() => navigate("/my-requests")}
                    className="btn btn-outline w-full hover:text-[#ff6b35] hover:border-[#ff6b35]"
                  >
                    View My Requests
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
