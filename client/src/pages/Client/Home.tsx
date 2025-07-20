import Carousel from "../../components/Carousel";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-pink-100 flex items-center justify-center"
    >
      <Carousel />
    </motion.div>
  );
};

export default Home