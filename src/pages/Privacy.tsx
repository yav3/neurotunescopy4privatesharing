import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Commitment to Privacy</h2>
          <p className="text-muted-foreground mb-4">
            At NeuroTunes, we are committed to protecting your privacy and personal information. 
            This Privacy Policy explains how we collect, use, and safeguard your data when you 
            use our therapeutic music platform.
          </p>
          <p className="text-muted-foreground mb-4">
            <strong>Last Updated:</strong> November 2025
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="text-muted-foreground mb-4">
            We collect the following types of information:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, and company details</li>
            <li><strong>Usage Data:</strong> Listening patterns, session duration, and therapeutic preferences</li>
            <li><strong>Technical Data:</strong> Device information, IP address, and browser type</li>
            <li><strong>Health & Wellness Data:</strong> Self-reported therapeutic goals and outcomes (optional)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="text-muted-foreground mb-4">
            Your information is used to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>Provide personalized therapeutic music recommendations</li>
            <li>Improve our algorithms and therapeutic effectiveness</li>
            <li>Send service updates and therapeutic insights</li>
            <li>Conduct research to advance music therapy (with your consent)</li>
            <li>Ensure platform security and prevent fraud</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
          <p className="text-muted-foreground mb-4">
            We implement industry-standard security measures to protect your data, including:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>End-to-end encryption for sensitive data</li>
            <li>Regular security audits and penetration testing</li>
            <li>HIPAA-compliant data handling for healthcare organizations</li>
            <li>Secure cloud infrastructure with redundant backups</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
          <p className="text-muted-foreground mb-4">
            We do not sell your personal information. We may share data only in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>With your explicit consent</li>
            <li>To comply with legal obligations</li>
            <li>With service providers who support our platform (under strict confidentiality agreements)</li>
            <li>In anonymized, aggregated form for research purposes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
          <p className="text-muted-foreground mb-4">
            You have the right to:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
            <li>Access and download your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of marketing communications</li>
            <li>Withdraw consent for data processing</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
          <p className="text-muted-foreground mb-4">
            Your data may be processed in countries outside your residence. We ensure all transfers 
            comply with applicable data protection laws through standard contractual clauses and 
            Privacy Shield frameworks where applicable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-muted-foreground">
            For privacy-related inquiries or to exercise your rights, contact us at{' '}
            <a href="mailto:privacy@neurotunes.com" className="text-primary hover:underline">
              privacy@neurotunes.com
            </a>
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
