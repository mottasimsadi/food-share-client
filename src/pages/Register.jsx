import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUser,
  FaImage,
  FaGoogle,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { createUser, googleSignIn, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      Swal.fire({
        icon: "warning",
        title: "Weak Password",
        text: passwordError,
      });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match",
      });
      setLoading(false);
      return;
    }

    setLoading(true);

    createUser(formData.email, formData.password)
      .then(() => {
        return updateUser({
          displayName: formData.name,
          photoURL: formData.photoURL,
        });
      })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          timer: 1500,
          showConfirmButton: false,
        });
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: error.message || "Something went wrong",
        });
        setLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    setLoading(true);

    googleSignIn()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Google Login Successful",
          showConfirmButton: false,
          timer: 1500,
        });
        setLoading(false);
        navigate(location.state || "/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Google Login Failed",
          text: error.message || "Something went wrong",
        });
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="bg-base-100 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#ff6b35] mb-2">
              Join FoodShare!
            </h1>
            <p>Create your account and start sharing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter your full name"
                  required
                />
                <FaUser
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  size={18}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter your email"
                  required
                />
                <FaEnvelope
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  size={18}
                />
              </div>
            </div>

            {/* Photo URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Photo URL (Optional)
                </span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-10"
                  placeholder="Enter your photo URL"
                />
                <FaImage
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  size={18}
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="Create a password"
                  required
                />
                <FaLock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  size={18}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 6 characters with 1 uppercase and 1 lowercase
              </p>
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input input-bordered w-full pl-10"
                  placeholder="Confirm your password"
                  required
                />
                <FaLock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  size={18}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn w-full text-white bg-[#ff6b35] hover:opacity-70 border-none"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="divider">OR</div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn btn-outline w-full flex items-center gap-2 hover:opacity-70"
          >
            <FaGoogle size={18} />
            Continue with Google
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#ff6b35] font-medium hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
