import { Link } from "react-router-dom";
import { Linkedin, Youtube, Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Bottom Navigation Tabs */}
      <nav className="bg-background/95 backdrop-blur-sm border-t border-b border-border/50 sticky bottom-0 z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => scrollToSection('science')}
              className="px-6 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              Science & Excellence
            </button>
            <button
              onClick={() => scrollToSection('sessions')}
              className="px-6 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              Featured Sessions
            </button>
            <button
              onClick={() => scrollToSection('benefits')}
              className="px-6 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              Benefits
            </button>
            <button
              onClick={() => scrollToSection('partners')}
              className="px-6 py-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
            >
              Partners
            </button>
          </div>
        </div>
      </nav>

      {/* Footer Content */}
      <footer className="bg-muted/30 backdrop-blur-sm border-t border-border/50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1 - Product */}
          <div>
            <ul className="space-y-3">
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How it works
                </Link>
              </li>
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
              <li>
                <Link to="/add-ons" className="text-muted-foreground hover:text-foreground transition-colors">
                  Add-ons
                </Link>
              </li>
              <li>
                <Link to="/apps-hardware" className="text-muted-foreground hover:text-foreground transition-colors">
                  Apps & hardware
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - Resources */}
          <div>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/licensing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Licensing
                </Link>
              </li>
              <li>
                <Link to="/business-types" className="text-muted-foreground hover:text-foreground transition-colors">
                  Business types
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-muted-foreground hover:text-foreground transition-colors">
                  Research
                </Link>
              </li>
              <li>
                <Link to="/alternatives" className="text-muted-foreground hover:text-foreground transition-colors">
                  Alternatives
                </Link>
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
                <Link to="/press" className="text-muted-foreground hover:text-foreground transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-muted-foreground hover:text-foreground transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-muted-foreground hover:text-foreground transition-colors">
                  Our API
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Social & Language */}
          <div className="space-y-6">
            <div>
              <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                English
              </button>
            </div>
            
            <div className="flex gap-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
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
              <span>NeuroTunes™</span>
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
