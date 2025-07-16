import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  FaArrowRight,
  FaUsers,
  FaLeaf,
  FaHeart,
  FaGlobe,
  FaChartLine,
  FaShieldAlt,
} from "react-icons/fa";

const Home = () => {

    const stats = [
      { icon: FaUsers, label: "Active Users", value: "1,200+" },
      { icon: FaLeaf, label: "Food Saved", value: "2,500 kg" },
      { icon: FaHeart, label: "Meals Shared", value: "5,000+" },
      { icon: FaGlobe, label: "Communities", value: "15+" },
    ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-screen relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b35]/90 to-[#4ecdc4]/90"></div>
        <img
          src="https://i.postimg.cc/HjDnDvJz/hero-food-sharing.jpg"
          alt="Food sharing community"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-content text-center text-neutral-content relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md"
          >
            <h1 className="mb-5 text-5xl font-bold">
              Share Food,
              <span className="bg-gradient-to-r from-[#ff6b35] to-[#ffd23f] text-transparent bg-clip-text">
                {" "}
                Share Hope
              </span>
            </h1>
            <p
              className="mb-5 text-lg"
              style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)" }}
            >
              Join our community to reduce food waste and help neighbors.
              Together, we can make a difference one meal at a time.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/available-foods"
                className="btn bg-[#ff6b35] border-[#ff6b35] text-white hover:bg-[#e85c1f] btn-lg"
                style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)" }}
              >
                Find Food <FaArrowRight />
              </Link>
              <Link
                to="/add-food"
                className="btn btn-outline btn-lg text-white border-[#ff6b35] border-2 hover:bg-[#ff6b35]"
                style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)" }}
              >
                Share Food
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Extra Section - 1 */}
      {/* Stats Section */}
      <section className="py-20 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-[#ff6b35] mb-4 flex justify-center">
                  <stat.icon size={40} />
                </div>
                <div className="text-2xl font-bold text-[#ff6b35]">
                  {stat.value}
                </div>
                <div>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Section - 2 */}
      {/* How It Works Section */}
      <section className="py-20 bg-base-500">
        <div className="container mx-auto px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl max-w-2xl mx-auto">
              Simple steps to share food and help your community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-[#ff6b35] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p>
                Create your account and join our community of food sharers
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-[#4ecdc4] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Share or Find</h3>
              <p>
                Post surplus food or browse available items in your area
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-[#ffd23f] text-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p>
                Meet safely and exchange food with verified community members
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#ff6b35] to-[#4ecdc4] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of community members who are already sharing food
              and reducing waste
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="btn bg-white text-[#ff6b35] btn-lg hover:opacity-70 border-none"
              >
                Get Started Today
              </Link>
              <Link
                to="/available-foods"
                className="btn bg-transparent btn-lg text-white border-white border-2 hover:bg-white hover:text-[#ff6b35]"
              >
                Browse Available Food
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;