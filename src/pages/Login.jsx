import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { motion } from "framer-motion";
import {
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaGoogle,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { AuthContext } from "../providers/AuthProvider";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    signIn(formData.email, formData.password)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Login Successful",
          showConfirmButton: false,
          timer: 1500,
        });
        setLoading(false);
        navigate(location.state || "/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
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
              Welcome Back!
            </h1>
            <p>Sign in to your FoodShare account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your password"
                  required
                />
                <FaLock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  size={18}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn w-full text-white bg-[#ff6b35] hover:opacity-70 border-none"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="divider">OR</div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="btn btn-outline w-full flex items-center gap-2 hover:opacity-70"
          >
            <FaGoogle size={18} />
            Continue with Google
          </button>

          <div className="text-center mt-6">
            <p>
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#ff6b35] font-medium hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
