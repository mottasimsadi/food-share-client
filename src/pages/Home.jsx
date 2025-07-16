import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  FaArrowRight,
} from "react-icons/fa";

const Home = () => {

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
    </div>
  );
};

export default Home;