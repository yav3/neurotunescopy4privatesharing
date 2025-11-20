import { motion } from "framer-motion";

export const PartnersSection = () => {
  const partners = [
    {
      name: "Cornell University",
      logo: "https://upload.wikimedia.org/wikipedia/commons/4/47/Cornell_University_seal.svg",
    },
    {
      name: "Jacobs Technion-Cornell Institute",
      logo: "https://tech.cornell.edu/wp-content/uploads/2021/01/jacobs-institute-logo-white.png",
    },
    {
      name: "Stanford Medicine",
      logo: "https://med.stanford.edu/content/dam/sm/communications/identity-guide/logos/Stanford_Medicine_logo_stacked_white.png",
    },
    {
      name: "Weill Cornell Medicine",
      logo: "https://weillcornell.org/sites/default/files/wcm_logo_white.png",
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
