import { motion } from "framer-motion";
import jacobsTechnionLogo from '@/assets/jacobs-technion.png';
import stanfordLogo from '@/assets/stanford-medicine.png';
import weillCornellLogo from '@/assets/weill-cornell.png';

export const PartnersSection = () => {
  const partners = [
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
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h3 
          className="text-lg font-normal text-center mb-10 text-gray-300"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Supported by
        </motion.h3>

        <div className="bg-slate-950/60 backdrop-blur-md rounded-2xl border border-cyan-500/10 p-8">
          <div className="grid grid-cols-3 gap-8 items-center justify-items-center">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="flex items-center justify-center"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="w-full h-14 object-contain brightness-0 invert opacity-70 hover:opacity-90 transition-opacity"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
