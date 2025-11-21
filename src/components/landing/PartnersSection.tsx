import { motion } from "framer-motion";
import jacobsTechnionLogo from '@/assets/jacobs-technion.png';
import stanfordLogo from '@/assets/stanford-medicine.png';
import weillCornellLogo from '@/assets/weill-cornell.png';
import chromeTexture from '@/assets/chrome-texture-02.png';

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
    <section className="py-24 px-6 relative">
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url(${chromeTexture})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h3 
          className="text-lg font-light text-center mb-12 text-white/75 tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Supported by
        </motion.h3>

        <div 
          className="bg-obsidian/80 backdrop-blur-xl rounded-2xl border border-platinum/10 p-10 relative overflow-hidden"
          style={{
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
          <div className="grid grid-cols-3 gap-12 items-center justify-items-center relative z-10">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="flex items-center justify-center w-full"
              >
                <img 
                  src={partner.logo} 
                  alt={partner.name}
                  className="w-full h-16 object-contain brightness-0 invert opacity-75 hover:opacity-95 transition-all duration-300"
                  style={{
                    filter: 'brightness(0) invert(1) drop-shadow(0 0 8px rgba(255,255,255,0.1))',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
