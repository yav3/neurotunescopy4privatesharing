import { NEUROTUNES_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import liquidGlassBg from '@/assets/liquid-glass-bg.png';
import bgAbstract1 from '@/assets/bg-abstract-1.png';
import bgAbstract2 from '@/assets/bg-abstract-2.png';

export const ProductsOverview = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <NavigationHeader />
      
      {/* Background with teal liquid glass */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 opacity-30">
          <img src={liquidGlassBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <img src={bgAbstract1} alt="" className="absolute top-0 left-0 w-1/2 h-1/2 object-cover mix-blend-screen" />
          <img src={bgAbstract2} alt="" className="absolute bottom-0 right-0 w-1/2 h-1/2 object-cover mix-blend-screen" />
        </div>
        <div className="absolute inset-0 backdrop-blur-3xl bg-gradient-to-br from-cyan-950/30 via-background/50 to-teal-950/30" />
      </div>
      
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose the right solution
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
                for your needs
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Clinical-grade therapeutic music deployed across multiple platforms and scales
            </p>
          </div>

          {/* Product Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(NEUROTUNES_PRODUCTS).map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* Not Sure? */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">Not sure which solution fits your needs?</p>
            <button className="px-8 py-3 border border-border text-foreground rounded-xl hover:bg-accent transition">
              Chat with Sales Assistant
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <SalesAssistant />
    </div>
  );
};
