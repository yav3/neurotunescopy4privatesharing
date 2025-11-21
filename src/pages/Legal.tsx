import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';

const Legal = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Legal & Cookies</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
          <p className="text-muted-foreground mb-4">
            By accessing and using NeuroTunes, you agree to be bound by these Terms of Service. 
            Our platform provides neuroscience-backed therapeutic music designed to support cognitive 
            and emotional well-being.
          </p>
          <p className="text-muted-foreground mb-4">
            All music content provided through NeuroTunes is 100% owned by us, ensuring no licensing 
            fees or restrictions for our users. You may not redistribute, resell, or claim ownership 
            of any content provided through our platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookie Policy</h2>
          <p className="text-muted-foreground mb-4">
            NeuroTunes uses cookies to enhance your experience and provide personalized therapeutic 
            recommendations. Cookies help us understand your preferences and improve our service.
          </p>
          <p className="text-muted-foreground mb-4">
            We use the following types of cookies:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and choices</li>
            <li><strong>Therapeutic Cookies:</strong> Track your listening patterns to optimize recommendations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Medical Disclaimer</h2>
          <p className="text-muted-foreground mb-4">
            NeuroTunes provides therapeutic music based on neuroscience research and clinical validation. 
            However, our service is not a substitute for professional medical advice, diagnosis, or treatment. 
            Always consult with qualified healthcare professionals regarding any medical conditions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
          <p className="text-muted-foreground mb-4">
            All music, compositions, branding, and technology provided through NeuroTunes are protected 
            by copyright, trademark, and patent laws. Our proprietary therapeutic algorithms and music 
            compositions represent years of research and development.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact</h2>
          <p className="text-muted-foreground">
            For legal inquiries, please contact us at{' '}
            <a href="mailto:legal@neurotunes.com" className="text-primary hover:underline">
              legal@neurotunes.com
            </a>
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Legal;
