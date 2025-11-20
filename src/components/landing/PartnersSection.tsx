import { motion } from "framer-motion";
import cornellLogo from '@/assets/cornell-university.png';
import jacobsTechnionLogo from '@/assets/jacobs-technion.png';
import stanfordLogo from '@/assets/stanford-medicine.png';
import weillCornellLogo from '@/assets/weill-cornell.png';

export const PartnersSection = () => {
  const partners = [
    {
      name: "Cornell University",
      logo: cornellLogo,
    },
    {
      name: "Jacobs Technion-Cornell Institute",
      logo: jacobsTechnionLogo,
    },
    {
      name: "Stanford Medicine",
      logo: stanfordLogo,
    },
    {
      name: "Weill Cornell Medicine",
      logo: weillCornellLogo,
    },
  ];

  return (
    <section className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60 backdrop-blur-sm" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2 
          className="text-4xl lg:text-5xl font-headers font-semibold text-center mb-16"
          style={{ 
            background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 25%, #e0f2f1 50%, #80cbc4 75%, #e0f2f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          With Generous Support from
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm p-8 flex items-center justify-center hover:bg-white/10 transition-all duration-300"
            >
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="w-full h-24 object-contain filter brightness-0 invert opacity-80 hover:opacity-100 transition-opacity"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
