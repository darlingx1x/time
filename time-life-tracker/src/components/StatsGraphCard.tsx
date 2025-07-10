import { motion } from "framer-motion";

export default function StatsGraphCard() {
  return (
    <motion.div
      className="neumorph p-6 flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-2">Статистика</h3>
      <div className="mb-2">(Графики и аналитика появятся здесь)</div>
    </motion.div>
  );
}
