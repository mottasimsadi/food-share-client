import { useContext, useState } from "react";
import { Link, useLocation } from "react-router";
import { motion } from "framer-motion";
import {
  FaHome,
  FaUsers,
  FaPlus,
  FaCog,
  FaHeart,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { to: "/", label: "Home", icon: FaHome },
    { to: "/available-foods", label: "Available Foods", icon: FaUsers },
    ...(user
      ? [
          { to: "/add-food", label: "Add Food", icon: FaPlus },
          { to: "/manage-foods", label: "Manage My Foods", icon: FaCog },
          { to: "/my-requests", label: "My Food Request", icon: FaHeart },
        ]
      : []),
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="navbar sticky top-0 z-50 shadow-md bg-base-100"
    >
      {/* Navbar Start */}
      <div className="navbar-start">
        {/* Mobile menu toggle */}
        <div className="dropdown">
          <button
            className="btn btn-ghost lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes size={20} className="text-[#ff6b35]" />
            ) : (
              <FaBars size={20} className="text-[#ff6b35]" />
            )}
          </button>

          {isMenuOpen && (
            <ul
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              style={{ boxShadow: "0 4px 6px -1px rgba(61,68,81,0.1)" }}
            >
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      isActive(item.to)
                        ? "bg-[#ff6b35] text-white"
                        : "hover:bg-[#ff6b35]"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Logo */}
        <Link
          to="/"
          className="btn btn-ghost text-xl font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg, #ff6b35, #ffd23f)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          🍽️ FoodShare
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition duration-200 ${
                  isActive(item.to)
                    ? "bg-[#ff6b35] text-white"
                    : "hover:bg-[#ff6b35]"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar ring-2 ring-offset-2 ring-[#ff6b35]"
              aria-label="User menu"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src={user.photoURL || "/api/placeholder/40/40"}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <ul
              className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow"
              style={{ boxShadow: "0 4px 6px -1px rgba(61,68,81,0.1)" }}
            >
              <li>
                <span className="justify-between font-semibold text-gray-800">
                  {user.displayName || user.email}
                  <span
                    className="badge"
                    style={{ backgroundColor: "#ff6b35", color: "white" }}
                  >
                    Profile
                  </span>
                </span>
              </li>
              <li>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-white hover:bg-[#f87272] px-3 py-2 rounded-lg w-full text-left"
                >
                  <FaSignOutAlt size={16} />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className={`btn btn-ghost ${
                isActive("/login")
                  ? "bg-[#ff6b35] text-white"
                  : "hover:bg-[#ff6b35]"
              }`}
            >
              <FaSignInAlt size={16} />
              Login
            </Link>
            <Link
              to="/register"
              className={`btn hover:bg-[#ff6b35] hover:text-white ${
                isActive("/register")
                  ? "bg-[#ff6b35] text-white"
                  : "bg-transparent border-[#ff6b35] text-[#ff6b35]"
              }`}
            >
              <FaUserPlus size={16} />
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
