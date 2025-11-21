import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { Shield, Lock, FileCheck, UserCheck } from "lucide-react";

export const HIPAA = () => {
  const compliance = [
    {
      icon: Shield,
      title: "HIPAA Compliance",
      description: "Fully compliant with Health Insurance Portability and Accountability Act requirements"
    },
    {
      icon: Lock,
      title: "Data Encryption",
      description: "All PHI encrypted at rest and in transit using AES-256 and TLS 1.3"
    },
    {
      icon: FileCheck,
      title: "Business Associate Agreement",
      description: "BAA signed with all covered entities using NeuroTunes"
    },
    {
      icon: UserCheck,
      title: "Access Controls",
      description: "Role-based access control and comprehensive audit logging"
    }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />
      
      <main className="pt-32 pb-28">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-6xl font-light tracking-tight text-white mb-6">
              HIPAA Compliance Statement
            </h1>
            <p className="text-2xl font-light text-neutral-300">
              Protecting patient privacy and securing health information
            </p>
          </div>

          {/* Compliance Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {compliance.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="rounded-3xl p-8"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    boxShadow: '0 0 40px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  <div className="w-12 h-12 rounded-full mb-4 flex items-center justify-center"
                    style={{ background: 'rgba(16, 185, 129, 0.15)' }}
                  >
                    <Icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-xl font-light text-white mb-2">{item.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>

          {/* Details */}
          <div className="space-y-12 text-neutral-400 leading-relaxed">
            
            <section>
              <h2 className="text-3xl font-light text-white mb-6">Our Commitment</h2>
              <p>
                NeuroPositive Tech is committed to maintaining the highest standards of data protection and privacy. 
                We implement comprehensive administrative, physical, and technical safeguards to protect Protected Health 
                Information (PHI) in compliance with HIPAA regulations.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-light text-white mb-6">Security Measures</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <span>End-to-end encryption for all data transmission</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <span>Regular security audits and penetration testing</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <span>Multi-factor authentication for all user accounts</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <span>Comprehensive activity logging and monitoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <span>Regular staff training on HIPAA compliance</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <span>Incident response and breach notification procedures</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-light text-white mb-6">Business Associate Agreements</h2>
              <p className="mb-4">
                We execute Business Associate Agreements (BAAs) with all covered entities that use NeuroTunes. 
                These agreements outline our responsibilities in safeguarding PHI and our compliance with HIPAA requirements.
              </p>
              <p>
                For BAA requests or compliance questions, please contact our compliance team at compliance@neuralpositive.com
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-light text-white mb-6">Certifications & Audits</h2>
              <p>
                NeuroTunes undergoes regular third-party security audits and maintains compliance certifications. 
                Our infrastructure providers are HIPAA-compliant and SOC 2 Type II certified.
              </p>
            </section>

          </div>

          {/* CTA */}
          <div className="mt-20">
            <div 
              className="rounded-3xl p-12 text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.10)'
              }}
            >
              <h3 className="text-2xl font-light text-white mb-4">
                Questions About HIPAA Compliance?
              </h3>
              <p className="text-neutral-400 mb-6 max-w-xl mx-auto">
                Our compliance team is here to answer your questions
              </p>
              <button 
                className="px-8 py-3 rounded-full text-sm font-medium transition-all"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.10)',
                  color: 'white'
                }}
              >
                Contact Compliance Team
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HIPAA;
