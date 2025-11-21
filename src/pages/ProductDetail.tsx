import { useParams, Navigate } from 'react-router-dom';
import { NEUROTUNES_PRODUCTS } from '@/data/products';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { motion } from 'framer-motion';
import liquidGlassBg from '@/assets/liquid-glass-bg.png';
import bgAbstract1 from '@/assets/bg-abstract-1.png';

export const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? Object.values(NEUROTUNES_PRODUCTS).find(p => p.id === productId) : null;

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const Icon = product.icon;

  return (
    <div className="min-h-screen bg-background relative">
      <NavigationHeader />

      {/* Background with teal liquid glass */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 opacity-30">
          <img src={liquidGlassBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <img src={bgAbstract1} alt="" className="absolute top-1/4 right-1/4 w-1/2 h-1/2 object-cover mix-blend-screen" />
        </div>
        <div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-br from-cyan-950/30 via-background/50 to-teal-950/30" />
      </div>

      {/* Hero */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-cyan-500/20 border border-primary/30 flex items-center justify-center">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                {product.title}
              </h1>
            </div>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
              {product.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground rounded-xl font-semibold hover:shadow-xl hover:shadow-primary/30 transition">
                {product.cta}
              </button>
              <button className="px-8 py-4 border border-border text-foreground rounded-xl hover:bg-accent transition">
                View Pricing Calculator
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Target Markets Carousel */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12">Perfect for:</h2>
          <ProductCarousel items={product.targetMarkets} />
        </div>
      </section>

      {/* Key Benefits Carousel */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12">Key Benefits:</h2>
          <ProductCarousel items={product.keyBenefits} />
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Pricing</h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl glass-card border border-border/50"
          >
            <p className="text-muted-foreground mb-2">{product.pricing.model}</p>
            <p className="text-4xl font-bold text-foreground mb-2">{product.pricing.starting}</p>
            <p className="text-sm text-muted-foreground">{product.pricing.minimum}</p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to transform your space with therapeutic music?
          </h2>
          <button className="px-8 py-4 bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground rounded-xl font-semibold hover:shadow-xl hover:shadow-primary/30 transition">
            {product.cta}
          </button>
        </div>
      </section>

      <Footer />
      <SalesAssistant />
    </div>
  );
};
