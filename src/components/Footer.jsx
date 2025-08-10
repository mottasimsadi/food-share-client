import { Link, useNavigate } from "react-router";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const Footer = () => {
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  const [activeModal, setActiveModal] = useState(null);

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Available Foods", href: "/available-foods" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Community Reviews", href: "#reviews" },
    { name: "Our Partners", href: "#partners" },
  ];

  // Support links with modal content
  const supportLinks = [
    {
      name: "Help Center",
      content: (
        <>
          <h3 className="text-xl font-bold text-[#ff6b35] mb-4">Help Center</h3>
          <p className="mb-4">
            Find answers to frequently asked questions about sharing and
            receiving food.
          </p>
          <div className="space-y-3">
            <p>
              <strong className="text-[#ff6b35]">Email:</strong>{" "}
              support@foodshare.com
            </p>
            <p>
              <strong className="text-[#ff6b35]">Phone:</strong> +1 (234)
              567-890 (9AM-6PM)
            </p>
          </div>
        </>
      ),
    },
    {
      name: "Privacy Policy",
      content: (
        <>
          <h3 className="text-xl font-bold text-[#ff6b35] mb-4">
            Privacy Policy
          </h3>
          <p className="mb-4">
            Your privacy is important. Our policy explains:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>What data we collect from users and donors.</li>
            <li>How we use your information to facilitate food sharing.</li>
            <li>Your rights regarding your personal data.</li>
          </ul>
        </>
      ),
    },
    {
      name: "Terms of Service",
      content: (
        <>
          <h3 className="text-xl font-bold text-[#ff6b35] mb-4">
            Terms of Service
          </h3>
          <p className="mb-4">By using FoodShare, you agree to our terms:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>User responsibilities when listing and collecting food.</li>
            <li>Guidelines for safe food handling and exchange.</li>
            <li>Our role as a platform connector.</li>
          </ul>
        </>
      ),
    },
  ];

  const socialLinks = [
    { icon: FaFacebook, href: "https://www.facebook.com/" },
    { icon: FaXTwitter, href: "https://x.com/" },
    { icon: FaInstagram, href: "https://www.instagram.com/" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/" },
  ];

  const handleQuickLinkClick = (href) => {
    if (href.startsWith("#")) {
      if (isHomePage) {
        // Smooth scroll on homepage
        const element = document.getElementById(href.replace("#", ""));
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } else {
        // Navigate to homepage first, then scroll
        navigate("/", {
          state: { scrollTo: href.replace("#", "") },
          replace: true,
        });
      }
    }
  };

  const openModal = (index) => setActiveModal(index);
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <motion.footer
        className="bg-base-200 text-base-content"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section with Framer Motion */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="btn btn-ghost text-2xl font-bold p-0">
                🍽️ FoodShare
              </Link>
              <p className="text-base-content/80">
                Connecting communities to reduce food waste and help those in
                need.
              </p>
              <div className="space-y-2">
                <p className="flex items-center gap-2">
                  <FaPhoneAlt className="text-[#ff6b35]" />{" "}
                  <span>+1 (234) 567-890</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaEnvelope className="text-[#ff6b35]" />{" "}
                  <span>support@foodshare.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-[#ff6b35]" />{" "}
                  <span>123 Community Lane, City</span>
                </p>
              </div>
            </motion.div>

            {/* Quick Links with Framer Motion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {link.href.startsWith("#") ? (
                      <Link
                        to={isHomePage ? "#" : "/"}
                        onClick={(e) => {
                          e.preventDefault();
                          handleQuickLinkClick(link.href);
                        }}
                        state={
                          isHomePage
                            ? null
                            : { scrollTo: link.href.replace("#", "") }
                        }
                        className="text-white/90 hover:text-[#ef4343] cursor-pointer transition-colors text-sm text-left w-full"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <Link
                        to={link.href}
                        className="hover:text-[#ff6b35] transition-colors"
                      >
                        {link.name}
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links with Modal Trigger and Framer Motion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                {supportLinks.map((link, index) => (
                  <li key={link.name}>
                    <button
                      onClick={() => openModal(index)}
                      className="hover:text-[#ff6b35] transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter & Social with Framer Motion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="your-email@example.com"
                  className="input input-bordered w-full rounded-r-none"
                />
                <button className="btn bg-[#ff6b35] flex-1 hover:opacity-70 rounded-l-none">
                  Subscribe
                </button>
              </div>
              <div className="flex space-x-4 mt-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base-content/70 hover:text-[#ff6b35]"
                    whileHover={{ y: -3 }}
                  >
                    <social.icon size={24} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Footer */}
          <motion.div
            className="border-t border-base-content/20 mt-16 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>
              &copy; {new Date().getFullYear()} FoodShare. All rights reserved.
            </p>
          </motion.div>
        </div>
      </motion.footer>

      {/* Modal with Framer Motion's AnimatePresence */}
      <AnimatePresence>
        {activeModal !== null && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-base-100 text-base-content rounded-lg max-w-md w-full p-6 relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
            >
              <button
                onClick={closeModal}
                className="btn btn-sm btn-circle text-[#ff6b35] bg-transparent shadow-none border-none hover:bg-[#ff6b35] hover:text-white absolute top-2 right-2"
              >
                <FaTimes />
              </button>
              <div>{supportLinks[activeModal].content}</div>
              <div className="mt-6 text-right">
                <button
                  onClick={closeModal}
                  className="btn bg-[#ff6b35] flex-1 hover:opacity-70"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
