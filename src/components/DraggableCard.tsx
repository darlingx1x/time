import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function DraggableCard({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="neumorph p-4"
      drag
      dragElastic={0.2}
      whileDrag={{ scale: 1.05, boxShadow: "0 8px 32px #a3b1c6" }}
      style={{ cursor: "grab" }}
    >
      {children}
    </motion.div>
  );
}
