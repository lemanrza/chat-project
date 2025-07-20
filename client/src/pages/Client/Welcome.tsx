import LanguageSelector from "../../components/LanguageSelector";
import { motion } from "framer-motion";
import Aurora from '../../components/Aurora';

const Welcome = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
    >
      {/* Bckground */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <Aurora
          colorStops={["#43e97b", "#38f9d7", "#fa8bff"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <LanguageSelector />
    </motion.div>
  );
};

export default Welcome;
