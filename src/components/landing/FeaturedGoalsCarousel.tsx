import { motion } from 'framer-motion';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';

export const FeaturedGoalsCarousel = () => {
  // Select featured goals
  const featuredGoals = THERAPEUTIC_GOALS.slice(0, 6);

  return (
    <section className="h-screen flex items-center justify-center overflow-hidden">
      <div className="w-full">
        <motion.h2 
          className="text-5xl font-headers text-white text-center mb-16 px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Featured Sessions
        </motion.h2>
        
        {/* Infinite scrolling carousel */}
        <div className="relative">
          <motion.div 
            className="flex gap-8"
            animate={{
              x: [0, -1920],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 40,
                ease: "linear",
              },
            }}
          >
            {/* Duplicate the array to create seamless loop */}
            {[...featuredGoals, ...featuredGoals, ...featuredGoals].map((goal, index) => (
              <motion.div
                key={`${goal.id}-${index}`}
                className="flex-shrink-0 w-80 h-96 rounded-2xl p-8 border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % featuredGoals.length) * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className="h-full flex flex-col">
                  <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                    <goal.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-headers text-white mb-4">{goal.name}</h3>
                  <p className="text-lg font-body text-white/70 leading-relaxed flex-grow">{goal.description}</p>
                  <div className="mt-6 flex items-center gap-2">
                    <div className="h-1 bg-white/20 rounded-full flex-grow">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: '70%' }} />
                    </div>
                    <span className="text-sm text-white/60">{goal.bpmRange.optimal} BPM</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
