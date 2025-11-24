import { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { NEUROTUNES_PRODUCTS } from '@/data/products';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { RegistrationChatAssistant } from '@/components/registration/RegistrationChatAssistant';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import liquidGlassBg from '@/assets/liquid-glass-bg.png';
import bgAbstract1 from '@/assets/bg-abstract-1.png';

export const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const product = productId ? Object.values(NEUROTUNES_PRODUCTS).find(p => p.id === productId) : null;
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  if (!product) {
    return <Navigate to="/products" replace />;
  }

  const Icon = product.icon;

  return (
    <div className="min-h-screen bg-background relative">
      <NavigationHeader />
      <RegistrationChatAssistant isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)} />

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
          
          {/* Back Button */}
          <Link 
            to="/products"
            className="inline-flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Products</span>
          </Link>
          
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
              <button 
                onClick={() => setIsRegistrationOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground rounded-xl font-semibold hover:shadow-xl hover:shadow-primary/30 transition"
              >
                {product.cta}
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

      {/* CTA */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Ready to transform your space with therapeutic music?
          </h2>
          <button 
            onClick={() => setIsRegistrationOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-primary to-cyan-500 text-primary-foreground rounded-xl font-semibold hover:shadow-xl hover:shadow-primary/30 transition"
          >
            {product.cta}
          </button>
        </div>
      </section>

      <Footer />
      <SalesAssistant />
    </div>
  );
};
