import { motion } from "framer-motion";

export default function PoemDisplay({ poem }: { poem: string }) {
  return (
    <motion.div 
      className="text-center font-serif text-gray-800 z-20 -mt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1}}
    >
      <p className="whitespace-pre-line text-2xl leading-relaxed tracking-wide">
        {poem.split('\n').map((line, i) => (
          <motion.span
            key={i}
            className="block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0}}
            transition={{ duration: 2, delay: (i * 0.3) }}
          >
            {line}
          </motion.span>
        ))}
      </p>
    </motion.div>
  );
}
