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
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [featuredFoods, setFeaturedFoods] = useState([]);

  const stats = [
    { icon: FaUsers, label: "Active Users", value: "1,200+" },
    { icon: FaLeaf, label: "Food Saved", value: "2,500 kg" },
    { icon: FaHeart, label: "Meals Shared", value: "5,000+" },
    { icon: FaGlobe, label: "Communities", value: "15+" },
  ];

  const reviewsData = [
    {
      name: "Sarah L.",
      location: "Downtown",
      quote:
        "FoodShare has been a blessing! As a student, it's helped me get quality meals, and I love the feeling of community. It's amazing to see so little go to waste.",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      name: "David Chen",
      location: "West Suburbs",
      quote:
        "I own a small bakery, and this platform is the perfect way to share our end-of-day extras. It's easy to use, and I know the food is going to people who appreciate it.",
      image: "https://i.pravatar.cc/150?img=32",
    },
    {
      name: "Maria Garcia",
      location: "North End",
      quote:
        "My kids and I look forward to checking the app. We've tried so many new things and met wonderful people in our neighborhood. It's more than just food; it's connection.",
      image: "https://i.pravatar.cc/150?img=31",
    },
  ];

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get(
          "https://food-share-server-one.vercel.app/featured-foods"
        );
        const extractNumber = (str) => {
          const match = str.match(/\d+(\.\d+)?/);
          return match ? parseFloat(match[0]) : 0;
        };

        const sorted = res.data.sort(
          (a, b) =>
            extractNumber(b.foodQuantity) - extractNumber(a.foodQuantity)
        );
        const top6 = sorted.slice(0, 6);
        setFoods(top6);
        setFeaturedFoods(top6);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };
    fetchFoods();
  }, []);

  const calculateExpiresIn = (expireDateStr) => {
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
  };

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

      {/* Featured Foods Section */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Featured Foods</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Discover the highest quantity food options available in your
              community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredFoods.map((food, index) => (
              <motion.div
                key={food._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-base-100 rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 shadow-2xl"
              >
                <div className="aspect-video w-full rounded-md overflow-hidden mb-4">
                  <img
                    src={food.foodImage}
                    alt={food.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">{food.foodName}</h3>
                <div className="space-y-2 text-sm text-base-content/70">
                  <div className="flex justify-between">
                    <span>Quantity:</span>
                    <span className="font-medium">{food.foodQuantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">{food.pickupLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expires in:</span>
                    <span className="font-medium text-warning">
                      {calculateExpiresIn(food.expireDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Donor:</span>
                    <span className="font-medium text-[#ff6b35]">
                      {food.donorName}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/food/${food._id}`}
                    className="btn bg-[#ff6b35] hover:bg-transparent hover:text-[#ff6b35] hover:border-[#ff6b35] flex-1"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              to="/available-foods"
              className="btn bg-[#ff6b35] hover:bg-transparent hover:text-[#ff6b35] hover:border-[#ff6b35] btn-lg"
            >
              Show All Foods <FaArrowRight size={20} />
            </Link>
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
      <section id="how-it-works" className="py-20 bg-base-500">
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
              <p>Create your account and join our community of food sharers</p>
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
              <p>Post surplus food or browse available items in your area</p>
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

      {/* Reviews Section */}
      <section id="about" className="py-20 bg-base-200">
        <div className="container mx-auto px-4 md:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What Our Community Says</h2>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Real stories from users making a difference with FoodShare.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviewsData.map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-base-200 p-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-2xl flex flex-col items-center text-center"
              >
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-20 h-20 rounded-full mb-4 border-4 border-[#ff6b35]"
                />
                <p className="text-base-content/80 italic flex-grow">
                  "{review.quote}"
                </p>
                <div className="mt-4">
                  <h4 className="font-bold text-lg">{review.name}</h4>
                  <p className="text-sm text-base-content/60">
                    {review.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        className="py-20 bg-gradient-to-r from-[#ff6b35] to-[#4ecdc4] text-white"
      >
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
            <div className="flex flex-col gap-4 justify-center md:flex-row">
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
