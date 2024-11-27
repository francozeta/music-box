'use client'

import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        className="h-1 bg-gradient-to-r from-[#877eff] via-purple-500 to-[#877eff]"
        initial={{ width: "0%" }}
        animate={{
          width: "100%",
          transition: {
            duration: 2,
            ease: "easeInOut"
          }
        }}
      />
    </div>
  )
}
