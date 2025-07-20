import { motion } from "framer-motion"

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#43e97b] via-[#38f9d7] to-[#fa8bff] relative overflow-hidden">
      {/* Animated circles background */}
      <div className="absolute inset-0 -z-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0.15 }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity, repeatType: "reverse" }}
            className={`absolute rounded-full bg-white/30 blur-2xl`}
            style={{
              width: `${120 + i * 30}px`,
              height: `${120 + i * 30}px`,
              top: `${10 + i * 40}px`,
              left: `${30 + i * 60}px`,
            }}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl px-10 py-12 flex flex-col items-center"
      >
        <h1 className="text-6xl font-extrabold text-[#8e2de2] mb-4">'404'</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! Page not found.</p>
        <a href="/" className="bg-[#8e2de2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#6c1cb0] transition">Go Home</a>
      </motion.div>
    </div>
  )
}

export default NotFound