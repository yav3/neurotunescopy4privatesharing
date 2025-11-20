import { motion } from 'framer-motion';
import { Building2, Plane, Laptop } from 'lucide-react';

const deploymentCategories = [
  {
    icon: Building2,
    title: "Healthcare Systems",
    description: "Waiting rooms, common areas, pre- and post-procedure support, bedside use, remote at-home care, elder care settings, staff resilience.",
    subtext: "Non-pharmacologic, low effort for staff, safe and secure.",
  },
  {
    icon: Plane,
    title: "Enterprise & Performance",
    description: "Airlines, hotels, spas, peak performance programs, and employee benefit offerings.",
    subtext: "On-demand stress relief, focus support, and recovery as a premium service — no medication and no extra hardware.",
  },
  {
    icon: Laptop,
    title: "Technology Partners",
    description: "Licensed or embedded into existing digital platforms.",
    subtext: "Our 8,500+ purpose-composed therapeutic tracks and closed-loop dosing engine plug directly into your product to enhance outcomes and retention.",
  },
];

export const RealWorldDeployment = () => {
  return (
    <section className="min-h-screen flex items-center justify-center py-24 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <motion.h2
          className="text-5xl lg:text-6xl font-headers font-semibold text-center mb-20 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Real-World Deployment
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {deploymentCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group"
              >
                <div className="h-full bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-cyan-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20">
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-10 h-10 text-cyan-400" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-headers font-semibold text-center mb-6"
                    style={{
                      background: 'linear-gradient(135deg, #e0f2f1 0%, #80cbc4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {category.title}
                  </h3>

                  {/* Description */}
                  <p className="text-white/80 text-center mb-6 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Subtext */}
                  <p className="text-cyan-300/70 text-center text-sm italic leading-relaxed">
                    {category.subtext}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
