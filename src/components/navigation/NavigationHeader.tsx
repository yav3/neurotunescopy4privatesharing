import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X, Plus } from "lucide-react";
import dropdownBg from "@/assets/dropdown-bg.png";

export const NavigationHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const enterpriseCorporate = [
    {
      category: "Health & Beauty",
      items: [
        { name: "Gyms", path: "/business/gyms" },
        { name: "Medical", path: "/business/medical", badge: "First Responder Discount" },
        { name: "Dental", path: "/business/dental" },
        { name: "Salons", path: "/business/salons" },
        { name: "Spas", path: "/business/spas" },
        { name: "Senior Communities", path: "/business/senior-communities", badge: "Special Pricing" },
      ]
    },
    {
      category: "Retail",
      items: [
        { name: "Retail stores", path: "/business/retail" },
        { name: "Grocery stores", path: "/business/grocery" },
        { name: "Shopping malls", path: "/business/shopping-malls" },
        { name: "Car dealerships", path: "/business/car-dealerships" },
      ]
    },
    {
      category: "Service Industry",
      items: [
        { name: "Restaurants", path: "/business/restaurants" },
        { name: "Hotels", path: "/business/hotels" },
        { name: "Cafés & coffee shops", path: "/business/cafes" },
        { name: "Bars & pubs", path: "/business/bars" },
      ]
    },
    {
      category: "Community",
      items: [
        { name: "Churches", path: "/business/churches" },
        { name: "Offices", path: "/business/offices" },
        { name: "Schools", path: "/business/schools" },
        { name: "Academic Hospitals", path: "/business/academic-hospitals", badge: "Academic Discount" },
        { name: "Cultural spaces", path: "/business/cultural-spaces" },
      ]
    }
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <header className="hidden md:flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 relative">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <Plus 
              className="w-8 h-8 text-cyan-400/80" 
              strokeWidth={2}
            />
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-base">
                  Products & Solutions
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div 
                    className="w-[900px] p-8 relative overflow-hidden"
                    style={{
                      backgroundImage: `url(${dropdownBg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Glassmorphic overlay */}
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Three Main Pathways */}
                      <div className="grid grid-cols-3 gap-8 mb-8">
                        {/* Enterprise & Corporate */}
                        <div className="space-y-4 col-span-2">
                          <h2 className="font-bold text-lg mb-4 text-foreground border-b border-primary/20 pb-2">
                            Enterprise & Corporate
                          </h2>
                          <div className="grid grid-cols-2 gap-6">
                            {enterpriseCorporate.map((category) => (
                              <div key={category.category} className="space-y-3">
                                <h3 className="font-semibold text-xs uppercase tracking-widest text-primary/80">
                                  {category.category}
                                </h3>
                                <ul className="space-y-1.5">
                                  {category.items.map((item) => (
                                    <li key={item.name}>
                                      <Link
                                        to={item.path}
                                        className="group flex flex-col gap-1 p-2 rounded-lg hover:bg-primary/10 transition-all duration-200 border border-transparent hover:border-primary/20"
                                      >
                                        <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors">
                                          {item.name}
                                        </span>
                                        {item.badge && (
                                          <Badge className="text-[10px] w-fit bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 px-2 py-0.5">
                                            {item.badge}
                                          </Badge>
                                        )}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Wellness Apps & APIs */}
                        <div className="space-y-6">
                          {/* Wellness Apps */}
                          <div className="space-y-3">
                            <h2 className="font-bold text-lg text-foreground border-b border-primary/20 pb-2">
                              Wellness Apps
                            </h2>
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-xl border border-primary/20">
                              <p className="text-sm text-muted-foreground/90 mb-3">
                                Access personalized wellness content
                              </p>
                              <Link to="/subscribe" className="block mb-2">
                                <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                                  Subscribe to Web App
                                </Button>
                              </Link>
                              <Link to="/app-store" className="block">
                                <Button size="sm" variant="outline" className="w-full">
                                  Get iOS/Android App
                                </Button>
                              </Link>
                            </div>
                          </div>

                          {/* APIs & Partnerships */}
                          <div className="space-y-3">
                            <h2 className="font-bold text-lg text-foreground border-b border-primary/20 pb-2">
                              APIs & Partnerships
                            </h2>
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-xl border border-primary/20">
                              <p className="text-sm text-muted-foreground/90 mb-3">
                                Integrate NeuroTunes into your platform
                              </p>
                              <Link to="/contact">
                                <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                                  Chat with AI Assistant
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-primary/10">
                        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-6 rounded-xl border border-primary/20 backdrop-blur-sm">
                          <h4 className="font-bold text-lg mb-2 text-foreground">Special Discounts Available</h4>
                          <p className="text-sm text-muted-foreground/90 mb-4">
                            Talk to the experts and find out how NeuroTunes can work for your business.
                          </p>
                          <div className="flex gap-3">
                            <Link to="/contact" className="flex-1">
                              <Button size="sm" className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                                Chat to Sales Assistant
                              </Button>
                            </Link>
                            <Link to="/deals" className="flex-1">
                              <Button size="sm" variant="outline" className="w-full">
                                Inquire About Deals
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link to="/how-it-works" className="text-base hover:text-primary transition-colors">
            How it works
          </Link>
          <Link to="/licensing" className="text-base hover:text-primary transition-colors">
            Licensing
          </Link>
          <Link to="/pricing" className="text-base hover:text-primary transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/auth" className="text-base hover:text-primary transition-colors">
            Log in
          </Link>
          <Link to="/demo">
            <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full px-6">
              See Samples
            </Button>
          </Link>
        </div>
      </header>

      {/* Mobile Navigation */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-50">
        <Link to="/" className="flex items-center">
          <Plus 
            className="w-7 h-7 text-cyan-400/80" 
            strokeWidth={2}
          />
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="w-6 h-0.5 bg-foreground" />
              <div className="w-6 h-0.5 bg-foreground" />
              <div className="w-6 h-0.5 bg-foreground" />
            </div>
          )}
        </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] bg-background z-40 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Enterprise & Corporate */}
            <div>
              <h2 className="font-bold text-lg mb-4 text-foreground border-b border-primary/20 pb-2">
                Enterprise & Corporate
              </h2>
              {enterpriseCorporate.map((category) => (
                <div key={category.category} className="mb-6">
                  <h3 className="font-semibold mb-3 text-sm text-primary/80 uppercase tracking-wide">
                    {category.category}
                  </h3>
                  <ul className="space-y-2 ml-4">
                    {category.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-muted-foreground hover:text-foreground transition-colors flex flex-col gap-1"
                        >
                          {item.name}
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs w-fit">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Wellness Apps */}
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <h2 className="font-bold text-lg mb-2 text-foreground">Wellness Apps</h2>
              <p className="text-sm text-muted-foreground mb-3">Access personalized wellness content</p>
              <Link to="/subscribe" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full mb-2">Subscribe to Web App</Button>
              </Link>
              <Link to="/app-store" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Get iOS/Android App</Button>
              </Link>
            </div>

            {/* APIs & Partnerships */}
            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <h2 className="font-bold text-lg mb-2 text-foreground">APIs & Partnerships</h2>
              <p className="text-sm text-muted-foreground mb-3">Integrate NeuroTunes into your platform</p>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Chat with AI Assistant</Button>
              </Link>
            </div>

            <div className="pt-6 border-t border-border space-y-4">
              <Link
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-muted-foreground hover:text-foreground"
              >
                How it works
              </Link>
              <Link
                to="/licensing"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-muted-foreground hover:text-foreground"
              >
                Licensing
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Link>
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-muted-foreground hover:text-foreground"
              >
                Log in
              </Link>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg space-y-3">
              <h4 className="font-semibold mb-2">Talk to Sales</h4>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Chat to Sales Assistant</Button>
              </Link>
              <Link to="/deals" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">Inquire About Deals</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
