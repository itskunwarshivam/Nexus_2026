'use client';

import { motion } from 'framer-motion';
import { EVENT_CATEGORIES } from '@/lib/data';
import { cn } from '@/lib/utils';

interface EventCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function EventCategories({ selectedCategory, onSelectCategory }: EventCategoriesProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="section-heading text-4xl md:text-5xl font-bold uppercase tracking-wider text-white mb-4">
          CHOOSE YOUR MISSION
        </h2>
        <p className="text-slate-400 text-lg md:text-xl">
          Select your arena and prove your worth
        </p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
      >
        {EVENT_CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              variants={itemVariants}
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                "relative flex flex-col items-center p-6 rounded-xl transition-all duration-300",
                "bg-white/5 backdrop-blur-md border border-white/10 hover:-translate-y-1 text-center group",
                isSelected && "bg-white/10"
              )}
              style={{
                borderTopWidth: '3px',
                borderTopColor: category.color,
                boxShadow: isSelected ? `0 0 20px -5px ${category.color}80` : 'none'
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: `0 0 20px -5px ${category.color}`
              }}
            >
              <span className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">
                {category.icon}
              </span>
              <h3 className="text-white font-bold uppercase tracking-wide text-sm md:text-base mb-2">
                {category.title}
              </h3>
              <p className="text-slate-400 text-xs md:text-sm font-medium">
                {category.description}
              </p>
            </motion.button>
          );
        })}
      </motion.div>

      <div className="flex justify-center mt-10">
        <button
          onClick={() => onSelectCategory('all')}
          className={cn(
            "px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300",
            selectedCategory === 'all' 
              ? "bg-rose-600 text-white shadow-[0_0_15px_-3px_rgba(225,29,72,0.6)]" 
              : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 hover:text-white"
          )}
        >
          ALL MISSIONS
        </button>
      </div>
    </div>
  );
}
