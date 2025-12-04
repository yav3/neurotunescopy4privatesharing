import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';

const Legal = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-normal mb-8">Terms and Conditions</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">1. Ownership of Content and Intellectual Property</h2>
          <p className="text-muted-foreground mb-4">
            All content, materials, products, software, algorithms, code, audio, visual assets, trademarks, patents, and other intellectual property made available by Neuropositive Tech, Inc., DBA Neuralpositive ("Neuralpositive") (collectively, "Content") are proprietary and protected under applicable copyright, trademark, patent, and other intellectual property laws.
          </p>
          <p className="text-muted-foreground mb-4">
            No rights are granted to you in the Content except as expressly provided in these Terms. You may not copy, reproduce, modify, distribute, perform, display, transmit, create derivative works from, or otherwise exploit any Content without the prior written consent of Neuralpositive. Any unauthorized use constitutes a material breach of these Terms.
          </p>
          <p className="text-muted-foreground mb-4">
            These Terms apply to all Neuralpositive platforms, applications, and services accessed on any device.
          </p>
          <p className="text-muted-foreground mb-4">
            By accessing Neuralpositive, you affirm you have read, understood, and agree to comply with these Terms and all applicable laws. You further affirm that all information you provide is accurate and truthful. Inquiries may be directed to{' '}
            <a href="mailto:help@neuralpositive.com" className="text-primary hover:underline">
              help@neuralpositive.com
            </a>.
          </p>
          <p className="text-muted-foreground mb-4">
            Neuralpositive reserves the right to modify these Terms at any time. Notice will be provided via email, in-app prompts, or other reasonable means. Continued use constitutes acceptance of revised Terms; if you do not agree, you must discontinue your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">2. Medical Disclaimer</h2>
          <p className="text-muted-foreground mb-4">
            Information made available through Neuralpositive is for general informational purposes only and does not constitute medical advice or treatment. It is not intended to diagnose, treat, cure, or prevent any medical condition. Always consult a qualified healthcare provider regarding any questions or concerns. Neuralpositive makes no representations or warranties regarding therapeutic or clinical outcomes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">3. Accounts and Access Restrictions</h2>
          <h3 className="text-xl font-normal mb-3 text-foreground/90">3.1 Enterprise-Only Access</h3>
          <p className="text-muted-foreground mb-4">
            Neuralpositive accounts are not designed for individual consumer use. Access is granted exclusively through an enterprise distributor, enterprise client, or authorized enterprise partner that has entered into a contract with Neuralpositive.
          </p>
          <p className="text-muted-foreground mb-4">
            If you receive access through such an enterprise arrangement, your login credentials, access code(s), and permitted uses are governed by the relevant enterprise agreement and these Terms.
          </p>
          <h3 className="text-xl font-normal mb-3 text-foreground/90">3.2 User Responsibilities</h3>
          <p className="text-muted-foreground mb-4">
            Upon accessing Neuralpositive, you must create or authenticate an account using approved enterprise credentials. You are solely responsible for maintaining the confidentiality of your username, password, and any other access keys. You agree to maintain the accuracy of your user information and promptly update it as needed.
          </p>
          <p className="text-muted-foreground mb-4">
            Unauthorized access, credential sharing, sublicensing, or use outside an approved enterprise relationship constitutes a breach of these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">4. Minors</h2>
          <p className="text-muted-foreground mb-4">
            You must be at least 18 years of age, or the age of majority in your jurisdiction, to use Neuralpositive. Users under 18 may only access the platform with direct supervision of a parent or legal guardian and only where such access is permitted under the enterprise agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">5. Suspension and Termination</h2>
          <p className="text-muted-foreground mb-4">
            Neuralpositive may suspend, restrict, or terminate your account at any time, without prior notice, for violations of these Terms, fraudulent activity, or unauthorized use of Content. Grounds for termination include, but are not limited to, copying, distributing, modifying, performing, creating derivative works from, or otherwise exploiting Neuralpositive Content without permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">6. DMCA Compliance</h2>
          <p className="text-muted-foreground mb-4">
            Neuralpositive complies with the Digital Millennium Copyright Act ("DMCA"). Users may not download, store, distribute, upload, or otherwise use Neuralpositive Content in a manner that infringes intellectual property rights. Unauthorized use of protected works is strictly prohibited. Third-party licensors retain all rights in their respective content and may enforce those rights directly.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">7. Unauthorized Use and Proprietary Rights</h2>
          <p className="text-muted-foreground mb-4">
            All Neuralpositive trademarks, service marks, logos, designs, software, algorithms, data structures, and related intellectual property are owned by Neuralpositive or its licensors. You may not use, alter, display, or reference any such materials for commercial, promotional, or public purposes without explicit written authorization.
          </p>
          <p className="text-muted-foreground mb-4">
            Any attempt to reverse engineer, decompile, scrape, extract, or otherwise obtain the underlying structure or source of Neuralpositive Content or systems is strictly prohibited.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">8. Privacy Policy</h2>
          <p className="text-muted-foreground mb-4">
            Neuralpositive's Privacy Policy forms part of these Terms and is available at{' '}
            <a href="/privacy" className="text-primary hover:underline">
              www.neuralpositive.com
            </a>. Questions may be directed to{' '}
            <a href="mailto:help@neuralpositive.com" className="text-primary hover:underline">
              help@neuralpositive.com
            </a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">9. Third-Party Services</h2>
          <p className="text-muted-foreground mb-4">
            Neuralpositive may include links to or integrations with third-party platforms or services. Such entities operate under their own terms, rules, and privacy practices. Neuralpositive does not endorse, control, or assume responsibility for any third-party content, actions, or functionality.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">10. Product Availability</h2>
          <p className="text-muted-foreground mb-4">
            Neuralpositive endeavors to provide reliable and continuous service but does not guarantee uninterrupted availability or error-free operation. Temporary outages or updates do not modify subscription obligations or constitute grounds for refunds except as explicitly provided in the enterprise agreement. Report technical issues to{' '}
            <a href="mailto:help@neuralpositive.com" className="text-primary hover:underline">
              help@neuralpositive.com
            </a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">11. User-Generated Content</h2>
          <p className="text-muted-foreground mb-4">
            Users may upload certain limited content (e.g., profile images). By uploading, you represent that you hold all rights necessary to do so and that such content does not violate any law or infringe the rights of others. Neuralpositive does not endorse user content and may remove or retain such content at its sole discretion.
          </p>
          <p className="text-muted-foreground mb-4">
            You agree to indemnify Neuralpositive against all claims, damages, and expenses arising from content you upload.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">12. Governing Law and Jurisdiction</h2>
          <p className="text-muted-foreground mb-4">
            These Terms are governed by the laws of the State of California, without regard to conflict-of-laws principles. Except for claims subject to arbitration, the parties agree to the exclusive jurisdiction of the United States District Court for the Southern District of California.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">13. Arbitration Agreement and Class Action Waiver</h2>
          <h3 className="text-xl font-normal mb-3 text-foreground/90">13.1 Mandatory Arbitration</h3>
          <p className="text-muted-foreground mb-4">
            Except for claims seeking injunctive or equitable relief relating to intellectual property or unauthorized use, all disputes arising out of or relating to these Terms or your use of Neuralpositive shall be resolved through binding arbitration under the Federal Arbitration Act and the Consumer Arbitration Rules of the American Arbitration Association ("AAA"). The arbitrator has exclusive authority to resolve all disputes.
          </p>
          <h3 className="text-xl font-normal mb-3 text-foreground/90">13.2 Waiver of Jury Trial and Class Proceedings</h3>
          <p className="text-muted-foreground mb-4">
            By agreeing to these Terms, you waive any right to a jury trial or participation in a class, collective, or representative action, except where prohibited by law.
          </p>
          <h3 className="text-xl font-normal mb-3 text-foreground/90">13.3 Enforceability</h3>
          <p className="text-muted-foreground mb-4">
            If the arbitration requirement is found unenforceable in whole or part, disputes shall be resolved exclusively as provided in Section 12.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">14. Limitation of Liability</h2>
          <p className="text-muted-foreground mb-4">
            Neuralpositive is not liable for damages arising from misuse of the platform, reliance on third-party devices or integrations, service interruptions, or use outside the intended enterprise context. You agree to use Neuralpositive products solely as intended and in accordance with all applicable enterprise agreements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-normal mb-4">15. Entire Agreement</h2>
          <p className="text-muted-foreground mb-4">
            These Terms constitute the full and final agreement between you and Neuralpositive and supersede all prior or contemporaneous communications, representations, or understandings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-normal mb-4">16. Contact Information</h2>
          <p className="text-muted-foreground mb-2">
            For questions or notices under these Terms:
          </p>
          <p className="text-muted-foreground">
            Neuropositive Tech, Inc., DBA Neuralpositive<br />
            11 East Loop Road, Suite 381<br />
            New York, NY 10044<br />
            <a href="mailto:help@neuralpositive.com" className="text-primary hover:underline">
              help@neuralpositive.com
            </a>
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Legal;
