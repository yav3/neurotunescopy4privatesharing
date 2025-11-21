import { NEUROTUNES_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';
import productBg1 from '@/assets/product-bg-1.png';
import productBg2 from '@/assets/product-bg-2.png';
import productBg3 from '@/assets/product-bg-3.png';

export const ProductsOverview = () => {
  const cardBackgrounds = [productBg1, productBg2, productBg3, productBg1, productBg2];
  
  return (
    <div className="min-h-screen bg-background relative">
      <NavigationHeader />
      
      {/* Background with layered teal waves */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 opacity-40">
          <img src={productBg1} alt="" className="absolute top-0 left-0 w-full h-1/3 object-cover mix-blend-screen" />
          <img src={productBg2} alt="" className="absolute top-1/3 left-0 w-full h-1/3 object-cover mix-blend-screen" />
          <img src={productBg3} alt="" className="absolute top-2/3 left-0 w-full h-1/3 object-cover mix-blend-screen" />
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
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
                backgroundImage={cardBackgrounds[index]} 
              />
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
