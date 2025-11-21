import { useParams, Navigate } from 'react-router-dom';
import { NEUROTUNES_PRODUCTS } from '@/data/products';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import { motion } from 'framer-motion';

export const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? Object.values(NEUROTUNES_PRODUCTS).find(p => p.id === productId) : null;

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const Icon = product.icon;

  return (
    <div className="min-h-screen bg-gray-900">
      <NavigationHeader />

      {/* Hero */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-900 to-gray-900">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Icon className="h-6 w-6 text-cyan-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {product.title}
              </h1>
            </div>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl">
              {product.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-cyan-500/30 transition">
                {product.cta}
              </button>
              <button className="px-8 py-4 border border-white/20 text-white rounded-xl hover:bg-white/5 transition">
                View Pricing Calculator
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Target Markets */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Perfect for:</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {product.targetMarkets.map((market, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-gray-300">{market}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-slate-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Key Benefits:</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {product.keyBenefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-white/10"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-cyan-400 text-sm">✓</span>
                </div>
                <span className="text-gray-300">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pricing</h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-800/30 border border-white/10"
          >
            <p className="text-gray-400 mb-2">{product.pricing.model}</p>
            <p className="text-4xl font-bold text-white mb-2">{product.pricing.starting}</p>
            <p className="text-sm text-gray-500">{product.pricing.minimum}</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-900 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to transform your space with therapeutic music?
          </h2>
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-cyan-500/30 transition">
            {product.cta}
          </button>
        </div>
      </section>

      <Footer />
      <SalesAssistant />
    </div>
  );
};
