"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";

export default function PoemDisplay({ poem }: { poem: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(poem);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <motion.div
      className="text-center z-30 select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="inline-block parchment px-8 md:px-14 py-8 md:py-10">
        <p className="whitespace-pre-line text-2xl md:text-3xl leading-relaxed tracking-wide max-w-[80vw] md:max-w-2xl mx-auto select-none text-[#3b2a1e]">
          {poem
            .split("\n")
            .slice(0, 3)
            .map((line, i) => (
              <motion.span
                key={i}
                className="block select-none"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.35 }}
              >
                {line}
              </motion.span>
            ))}
        </p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleCopy}
            className="text-xl md:text-2xl font-medium text-[#a38a73] opacity-60 hover:opacity-100 hover:text-[#6b4f35] focus:outline-none focus:ring-2 focus:ring-[#3b2a1e]/20 rounded px-2 transition-colors"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
