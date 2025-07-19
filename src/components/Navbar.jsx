import { useContext, useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
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
  FaUser,
} from "react-icons/fa";
import { AuthContext } from "../providers/AuthProvider";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logOut()
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Logout Successful",
          timer: 1500,
          showConfirmButton: false,
        });
        setIsUserMenuOpen(false);
        navigate("/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Logout Failed",
          text: error.message || "Something went wrong",
        });
      });
  };

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
        <div className="dropdown" ref={mobileMenuRef}>
          <button
            className="btn btn-ghost lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes size={20} className="text-[#ff6b35]" />
            ) : (
              <FaBars size={20} className="text-[#ff6b35]" />
            )}
          </button>

          <ul
            className={`menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow ${
              isMobileMenuOpen ? "block" : "hidden"
            }`}
          >
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    isActive(item.to)
                      ? "bg-[#ff6b35] text-white"
                      : "hover:bg-[#ff6b35] hover:text-white"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Logo */}
        <Link
          to="/"
          className="btn btn-ghost text-xl font-bold bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg, #ff6b35, #ffd23f)",
            WebkitBackgroundClip: "text",
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
                    : "hover:bg-[#ff6b35] hover:text-white"
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
          <div className="relative" ref={userMenuRef}>
            <button
              className="btn btn-ghost btn-circle avatar ring-2 ring-[#ff6b35]"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="User menu"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src={
                    user.photoURL ||
                    "https://img.icons8.com/?size=100&id=H101gtpJBVoh&format=png&color=ffffff"
                  }
                  referrerPolicy="no-referrer"
                />
              </div>
            </button>

            {isUserMenuOpen && (
              <ul className="absolute right-0 mt-3 w-52 z-50 bg-white rounded-lg shadow p-2">
                <li className="menu-title text-gray-700 font-semibold mb-2 px-3">
                  {user.displayName}
                </li>
                <li>
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="flex items-center gap-2 px-3 py-2 mb-2 rounded-lg w-full text-left text-[#f87272] border hover:bg-[#f87272] hover:text-white"
                  >
                    <FaUser size={16} />
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-[#f87272] border hover:bg-[#f87272] hover:text-white px-3 py-2 rounded-lg w-full text-left"
                  >
                    <FaSignOutAlt size={16} />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className={`btn btn-ghost ${
                isActive("/login")
                  ? "bg-[#ff6b35] text-white"
                  : "hover:bg-[#ff6b35] hover:text-white"
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
