import { Html } from "@react-three/drei";
import { motion } from "framer-motion";

export default function Title({ isContentLoaded }: { isContentLoaded: boolean }) {
  return (
    <Html
      center
      position={[0, 15, -60]} 
      transform
      distanceFactor={25}
    >
      <motion.h1
        className="text-6xl font-serif text-gray-800 tracking-wide text-center whitespace-nowrap"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isContentLoaded ? 0 : 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Haiku Weather
      </motion.h1>
    </Html>
  );
}
