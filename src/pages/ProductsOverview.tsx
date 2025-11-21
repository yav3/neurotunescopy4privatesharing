import { NEUROTUNES_PRODUCTS } from '@/data/products';
import { ProductCard } from '@/components/products/ProductCard';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { SalesAssistant } from '@/components/sales/SalesAssistant';

export const ProductsOverview = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <NavigationHeader />
      
      <section className="py-24 px-6 bg-gradient-to-b from-gray-900 via-slate-900 to-gray-900">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Choose the right solution
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                for your needs
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
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
            <p className="text-gray-400 mb-4">Not sure which solution fits your needs?</p>
            <button className="px-8 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition">
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
