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
    <section className="py-8 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h3 
          className="text-lg font-normal text-center mb-6 text-gray-400"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Supported by
        </motion.h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="flex items-center justify-center p-4"
            >
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="w-full h-12 object-contain filter brightness-0 invert opacity-50"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
