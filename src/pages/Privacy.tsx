import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl mb-4" style={{ fontWeight: 400 }}>NeuroTunes — Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">Last updated: March 17, 2026</p>

        <p className="text-muted-foreground mb-8">
          This Privacy Policy explains how Neuropositive Tech, Inc., DBA Neuralpositive ("Neuropositive Tech, Inc., DBA Neuralpositive," "we," "us," or "our") collects, uses, stores, and protects information when you use the NeuroTunes application and related services (the "App"), including the NeuroTunes mobile application available on the Apple App Store and Google Play Store. By using NeuroTunes, you agree to the practices described in this Privacy Policy.
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4" style={{ fontWeight: 400 }}>1. Information We Collect</h2>

          <h3 className="text-xl mb-3 text-foreground/90" style={{ fontWeight: 400 }}>1.1 Information You Provide Directly</h3>
          <p className="text-muted-foreground mb-3">We may collect information you provide when you:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li><strong>Create or update an account</strong> — e.g., name, email address, username, password, profile settings</li>
            <li><strong>Subscribe or make a purchase</strong> — e.g., subscription plan selected, payment method (processed by our payment provider; we do not store full payment card numbers), transaction history, billing address</li>
            <li><strong>Use app features that require input</strong> — e.g., mood ratings, subjective cognitive or focus ratings, music preferences</li>
            <li><strong>Contact us for support or feedback</strong> — e.g., the content of your messages and any attachments you send</li>
          </ul>

          <h3 className="text-xl mb-3 text-foreground/90" style={{ fontWeight: 400 }}>1.2 Information Collected Automatically</h3>
          <p className="text-muted-foreground mb-3">When you use NeuroTunes, we may automatically collect:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li><strong>Usage data:</strong> in‑app actions, features used, session length, timestamps</li>
            <li><strong>Device and technical data:</strong> device type, operating system, app version, language, IP address, approximate location (city/region-level, not precise GPS)</li>
            <li><strong>Log data:</strong> crash reports, performance logs, diagnostics</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            If NeuroTunes is accessed through a web interface, we may use cookies or similar technologies for essential functionality and analytics (subject to your consent where required by law).
          </p>

          <h3 className="text-xl mb-3 text-foreground/90" style={{ fontWeight: 400 }}>1.3 Device Permissions</h3>
          <p className="text-muted-foreground mb-3">NeuroTunes may request access to certain device features. You can manage these permissions in your device settings at any time:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li><strong>Audio playback:</strong> Required to deliver therapeutic music and audio content</li>
            <li><strong>Notifications:</strong> Optional; used to send session reminders, new content alerts, and service updates</li>
            <li><strong>Network access:</strong> Required to stream audio content and sync your preferences</li>
            <li><strong>Background audio:</strong> Optional; allows music to continue playing while you use other apps</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            We do not access your camera, contacts, photo library, or precise GPS location.
          </p>

          <h3 className="text-xl mb-3 text-foreground/90" style={{ fontWeight: 400 }}>1.4 Optional Neuro‑Related or Behavioral Data</h3>
          <p className="text-muted-foreground mb-3">If you choose to use features related to mood, cognition, focus, or similar neuroscience‑inspired tools, we may collect:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li>Mood or state ratings (e.g., "stressed," "focused," "tired")</li>
            <li>Responses to in‑app tasks, questionnaires, or cognitive exercises</li>
            <li>Metadata about your listening behavior (e.g., tracks played, skips, session timing)</li>
          </ul>
          <p className="text-muted-foreground mb-3">We do not collect raw biometric or physiological signals (e.g., EEG, heart rate) unless:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li>The feature explicitly requires it,</li>
            <li>You are clearly informed, and</li>
            <li>You provide explicit consent.</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            If such features are introduced in the future, this Policy will be updated and any additional consent required will be requested in‑app.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4" style={{ fontWeight: 400 }}>2. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-3">We use the information we collect for purposes such as:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li><strong>Providing and maintaining the App</strong> — Operating core functionality, saving your settings, enabling personalization</li>
            <li><strong>Personalization and recommendations</strong> — Tailoring music or experiences based on your preferences and usage patterns</li>
            <li><strong>Subscription management</strong> — Processing payments, managing your subscription status, and providing purchase receipts</li>
            <li><strong>Improvement and analytics</strong> — Understanding how features are used, fixing bugs, optimizing performance</li>
            <li><strong>Communication</strong> — Responding to support requests; Sending important service notices (e.g., changes to terms, outages, security alerts)</li>
            <li><strong>Safety and integrity</strong> — Detecting and preventing abuse, fraud, or security incidents</li>
            <li><strong>Legal and compliance</strong> — Meeting legal obligations and enforcing our terms</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            <strong>We do not sell your personal data to third parties.</strong>
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4" style={{ fontWeight: 400 }}>3. Tracking, Advertising, and Analytics</h2>
          <p className="text-muted-foreground mb-3">
            NeuroTunes does <strong>not</strong> display third‑party advertisements. We do <strong>not</strong> use advertising identifiers (such as Apple's IDFA or Google's Advertising ID) for ad targeting or cross‑app tracking purposes.
          </p>
          <p className="text-muted-foreground mb-3">
            We may use first‑party analytics tools and privacy‑focused third‑party services to understand aggregate usage patterns. These analytics do not identify you personally and are used solely to improve the App.
          </p>
          <p className="text-muted-foreground mb-4">
            On iOS, we respect your App Tracking Transparency (ATT) preferences. If you decline tracking, we will not access your device's advertising identifier.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4" style={{ fontWeight: 400 }}>4. Legal Bases for Processing (EEA/UK Users)</h2>
          <p className="text-muted-foreground mb-3">If you are located in the European Economic Area (EEA) or the United Kingdom (UK), we process your personal data under one or more of the following legal bases:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li><strong>Contractual necessity:</strong> to provide, maintain, and support the App you have requested</li>
            <li><strong>Legitimate interests:</strong> to improve the App, maintain security, and perform aggregated analytics, where these interests are not overridden by your rights</li>
            <li><strong>Consent:</strong> for specific optional features (e.g., certain neuro‑related or mood features or certain analytics); you may withdraw consent at any time</li>
            <li><strong>Legal obligation:</strong> where processing is required to comply with applicable laws</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4" style={{ fontWeight: 400 }}>5. How We Share Your Information</h2>
          <p className="text-muted-foreground mb-3">We may share your information with:</p>

          <h3 className="text-xl mb-3 text-foreground/90" style={{ fontWeight: 400 }}>5.1 Service Providers</h3>
          <p className="text-muted-foreground mb-3">Trusted third‑party vendors that help us operate the App, such as:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li>Cloud hosting and storage (e.g., Supabase, AWS)</li>
            <li>Payment processing (e.g., Stripe, Apple In‑App Purchase, Google Play Billing)</li>
            <li>Analytics providers</li>
            <li>Customer support tools</li>
            <li>Authentication and security services</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            These providers are only allowed to process your data on our behalf, under contract, and for the specific purposes we define.
          </p>

          <h3 className="text-xl mb-3 text-foreground/90" style={{ fontWeight: 400 }}>5.2 Research and Analytics (If Applicable)</h3>
          <p className="text-muted-foreground mb-3">
            If we use data for research or product‑development purposes, we primarily do so in aggregated or de‑identified form so that individuals are not identifiable. If we ever wish to share identifiable data with research partners or for formal research studies, we will:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li>Clearly inform you, and</li>
            <li>Seek your explicit consent where required.</li>
          </ul>

          <h3 className="text-xl mb-3 text-foreground/90" style={{ fontWeight: 400 }}>5.3 Legal and Safety Reasons</h3>
          <p className="text-muted-foreground mb-3">We may disclose information:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li>When required by law, regulation, legal process, or governmental request</li>
            <li>To enforce our terms or protect our rights, privacy, safety, or property</li>
            <li>To investigate or prevent fraud, abuse, or security threats</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            <strong>We do not share your data with advertisers or data brokers.</strong>
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4" style={{ fontWeight: 400 }}>6. Data Security</h2>
          <p className="text-muted-foreground mb-3">We take technical and organizational measures to protect your information, including:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li>Encryption in transit (HTTPS/TLS) and at rest</li>
            <li>Access controls and authentication for internal systems</li>
            <li>Use of reputable, security‑focused infrastructure providers</li>
            <li>Monitoring and logging for suspicious activity where appropriate</li>
            <li>Row‑level security policies on user data</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            No system is completely immune from security risks, but we aim to minimize risk and respond appropriately to security incidents.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4" style={{ fontWeight: 400 }}>7. Data Retention</h2>
          <p className="text-muted-foreground mb-3">We keep personal data only for as long as necessary to:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li>Provide and maintain the App</li>
            <li>Fulfill the purposes described in this Policy</li>
            <li>Comply with legal or regulatory requirements</li>
            <li>Resolve disputes and enforce our agreements</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            If you request deletion of your data or your account (see Section 10), we will delete or anonymize your personal data, unless we are required by law to retain certain information.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4" style={{ fontWeight: 400 }}>8. Children's Privacy</h2>
          <p className="text-muted-foreground mb-4">
            NeuroTunes is not intended for children under 13 years of age (or the minimum age required in your jurisdiction). We do not knowingly collect personal information from children under this age. If we become aware that such data has been collected, we will take steps to delete it. If you believe a child has provided us with personal information, please contact us at{' '}
            <a href="mailto:help@neuralpositive.com" className="text-primary hover:underline">help@neuralpositive.com</a>.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4" style={{ fontWeight: 400 }}>9. International Data Transfers</h2>
          <p className="text-muted-foreground mb-3">
            Neuropositive Tech, Inc., DBA Neuralpositive is based in the United States and may process information in the U.S. and other countries. These countries may have data protection laws that differ from those in your jurisdiction. Where required by law, we implement appropriate safeguards for international transfers, such as:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li>Standard Contractual Clauses (SCCs)</li>
            <li>Other legally recognized mechanisms</li>
          </ul>
        </section>

        {/* Section 10 */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4" style={{ fontWeight: 400 }}>10. Your Rights and Choices</h2>
          <p className="text-muted-foreground mb-3">Depending on your location, you may have some or all of the following rights regarding your personal data:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li><strong>Access:</strong> request a copy of the personal data we hold about you</li>
            <li><strong>Rectification:</strong> request correction of inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> request deletion of your personal data, subject to legal obligations</li>
            <li><strong>Restriction:</strong> request that we limit how we process your data in certain circumstances</li>
            <li><strong>Objection:</strong> object to certain types of processing (e.g., based on legitimate interests)</li>
            <li><strong>Data portability:</strong> request a copy of your data in a structured, commonly used format (where applicable)</li>
            <li><strong>Withdraw consent:</strong> where processing is based on your consent, you may withdraw it at any time</li>
          </ul>
          <p className="text-muted-foreground mb-3"><strong>Account deletion:</strong> You may request deletion of your account and associated data at any time by contacting us at <a href="mailto:help@neuralpositive.com" className="text-primary hover:underline">help@neuralpositive.com</a> or through the account settings within the App. We will process your request within 30 days.</p>
          <p className="text-muted-foreground mb-4">
            We may need to verify your identity before responding to your request. You may also have the right to lodge a complaint with your local data protection authority if you believe your rights have been violated.
          </p>
        </section>

        {/* Section 11 — CCPA / US State Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4" style={{ fontWeight: 400 }}>11. Additional Disclosures for U.S. Residents</h2>

          <h3 className="text-xl mb-3 text-foreground/90" style={{ fontWeight: 400 }}>11.1 California Residents (CCPA / CPRA)</h3>
          <p className="text-muted-foreground mb-3">
            If you are a California resident, the California Consumer Privacy Act (CCPA), as amended by the California Privacy Rights Act (CPRA), provides you with additional rights:
          </p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li><strong>Right to Know:</strong> You may request the categories and specific pieces of personal information we have collected about you, the sources, the business purposes, and the categories of third parties with whom we share it.</li>
            <li><strong>Right to Delete:</strong> You may request deletion of your personal information, subject to certain exceptions.</li>
            <li><strong>Right to Correct:</strong> You may request correction of inaccurate personal information.</li>
            <li><strong>Right to Opt‑Out of Sale or Sharing:</strong> We do <strong>not</strong> sell your personal information. We do <strong>not</strong> share your personal information for cross‑context behavioral advertising.</li>
            <li><strong>Right to Non‑Discrimination:</strong> We will not discriminate against you for exercising your CCPA rights.</li>
          </ul>
          <p className="text-muted-foreground mb-3"><strong>Categories of personal information collected</strong> (in the preceding 12 months):</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li>Identifiers (name, email, IP address)</li>
            <li>Commercial information (subscription history, transaction records)</li>
            <li>Internet or electronic network activity (usage data, session logs)</li>
            <li>Inferences drawn from the above (music preferences, mood patterns)</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            To exercise your rights, contact us at <a href="mailto:help@neuralpositive.com" className="text-primary hover:underline">help@neuralpositive.com</a>. We will verify your identity and respond within 45 days.
          </p>

          <h3 className="text-xl mb-3 text-foreground/90" style={{ fontWeight: 400 }}>11.2 Other U.S. States</h3>
          <p className="text-muted-foreground mb-4">
            Residents of Virginia (VCDPA), Colorado (CPA), Connecticut (CTDPA), Utah (UCPA), and other states with comprehensive privacy laws may have similar rights, including the right to access, delete, correct, and opt‑out of certain processing. To exercise these rights, contact us at <a href="mailto:help@neuralpositive.com" className="text-primary hover:underline">help@neuralpositive.com</a>.
          </p>
        </section>

        {/* Section 12 */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4" style={{ fontWeight: 400 }}>12. Third‑Party Services and Links</h2>
          <p className="text-muted-foreground mb-3">
            NeuroTunes may contain links to third‑party websites or services, or integrations that rely on third‑party tools (for example, sign‑in providers, streaming services, or analytics platforms). Your use of those third‑party services is governed by their own terms and privacy policies. We are not responsible for the privacy practices of third parties, and we encourage you to review their policies.
          </p>
          <p className="text-muted-foreground mb-4">
            <strong>In‑App Purchases:</strong> Subscriptions purchased through the Apple App Store or Google Play Store are processed by Apple or Google, respectively, under their own privacy policies. We receive limited purchase confirmation data (e.g., subscription status, purchase date) but do not have access to your full payment details.
          </p>
        </section>

        {/* Section 13 */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4" style={{ fontWeight: 400 }}>13. Changes to This Privacy Policy</h2>
          <p className="text-muted-foreground mb-3">We may update this Privacy Policy from time to time. When we make material changes, we will:</p>
          <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2 ml-4">
            <li>Update the "Last updated" date at the top, and</li>
            <li>Provide additional notice in the App or via email where required by law.</li>
          </ul>
          <p className="text-muted-foreground mb-4">
            Your continued use of NeuroTunes after the effective date of changes indicates that you have read and understood the updated Policy.
          </p>
        </section>

        {/* Section 14 */}
        <section className="mb-8">
          <h2 className="text-2xl mb-4" style={{ fontWeight: 400 }}>14. Contact Us</h2>
          <p className="text-muted-foreground mb-3">
            If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, you can contact us at:
          </p>
          <div className="text-muted-foreground">
            <p className="mb-1"><strong>Neuropositive Tech, Inc., DBA Neuralpositive</strong></p>
            <p className="mb-1">
              Email: <a href="mailto:help@neuralpositive.com" className="text-primary hover:underline">help@neuralpositive.com</a>
            </p>
            <p>Address: 11 East Loop Road, Suite 381, New York, NY 10044</p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
