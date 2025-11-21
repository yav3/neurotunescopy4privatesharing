import { Link } from "react-router-dom";

export const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Savings Banner */}
      <div className="bg-gradient-to-r from-primary/20 to-cyan-500/20 border-t border-b border-primary/30 py-3 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-foreground text-sm md:text-base font-medium">
            Customers can, on average, save up to 60% by switching to us. We not only provide more premium, specialized experiences that respond to customers' unique needs, we also cut extraneous and surprise billing because we own 100% of our original professional music.
          </p>
        </div>
      </div>

      {/* Footer Content */}
      <footer className="bg-muted/30 backdrop-blur-sm border-t border-border/50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - Product */}
          <div>
            <ul className="space-y-3">
              <li>
                <Link to="/demo" className="text-muted-foreground hover:text-foreground transition-colors">
                  Demo
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Resources */}
          <div>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:info@neurotunes.com?subject=Research Pack Request" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Research
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div>
            <ul className="space-y-3">
              <li>
                <Link to="/our-story" className="text-muted-foreground hover:text-foreground transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-muted-foreground hover:text-foreground transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-muted-foreground hover:text-foreground transition-colors">
                  Our API
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Language */}
          <div>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              English
            </button>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="8" cy="12" r="3" />
                <circle cx="16" cy="12" r="3" />
              </svg>
              <span className="text-xl font-bold">NeuroTunes</span>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>+NeuroTunes</span>
              <Link to="/legal" className="hover:text-foreground transition-colors">
                Legal & cookies
              </Link>
              <Link to="/privacy" className="hover:text-foreground transition-colors">
                Our privacy policy
              </Link>
              <button className="hover:text-foreground transition-colors">
                Cookie preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};
