import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Send, Building2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  company: z.string().trim().min(1, "Company name is required").max(200),
  employeeCount: z.string().min(1, "Please select a range"),
});

export const EnterpriseWellnessTrial = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    employeeCount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const employeeRanges = ["1–50", "51–200", "201–1,000", "1,000+"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      toast.error(result.error.errors[0]?.message || "Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        interest_type: "enterprise_wellness",
        source: `enterprise-wellness-trial | ${formData.employeeCount} employees`,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Thank you! Our sales team will be in touch shortly.");
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050607' }}>
      <NavigationHeader />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            to="/products/enterprise-wellness"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm" style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}>
              Back to Enterprise Wellness
            </span>
          </Link>

          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-3xl p-8 flex flex-col"
              style={{
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 12, 0.98) 100%)',
                backdropFilter: 'blur(40px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
              }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                  }}
                >
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1
                    className="text-lg font-medium text-white"
                    style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}
                  >
                    Contact Sales
                  </h1>
                  <p
                    className="text-sm text-white/50"
                    style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}
                  >
                    Register interest in a business account
                  </p>
                </div>
              </div>

              <div className="border-b border-white/10 my-6" />

              {isSubmitted ? (
                <div className="py-16 text-center">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }}
                  >
                    <Send className="w-7 h-7 text-white" />
                  </div>
                  <h2
                    className="text-2xl font-light text-white mb-3"
                    style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}
                  >
                    We'll be in touch
                  </h2>
                  <p
                    className="text-white/50 text-sm max-w-sm mx-auto"
                    style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}
                  >
                    Our sales team will reach out to {formData.email} within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label
                      className="block text-xs text-white/40 mb-2 uppercase tracking-wider"
                      style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Smith"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                      style={{
                        fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="block text-xs text-white/40 mb-2 uppercase tracking-wider"
                      style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}
                    >
                      Work Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                      style={{
                        fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label
                      className="block text-xs text-white/40 mb-2 uppercase tracking-wider"
                      style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Corp"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                      style={{
                        fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    />
                  </div>

                  {/* Employee Count */}
                  <div>
                    <label
                      className="block text-xs text-white/40 mb-2 uppercase tracking-wider"
                      style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}
                    >
                      Number of Employees
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {employeeRanges.map((range) => (
                        <button
                          key={range}
                          type="button"
                          onClick={() => setFormData({ ...formData, employeeCount: range })}
                          className="px-3 py-2.5 rounded-xl text-sm transition-all"
                          style={{
                            fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                            backgroundColor:
                              formData.employeeCount === range
                                ? 'rgba(6, 182, 212, 0.15)'
                                : 'rgba(255, 255, 255, 0.04)',
                            border:
                              formData.employeeCount === range
                                ? '1px solid rgba(6, 182, 212, 0.5)'
                                : '1px solid rgba(255, 255, 255, 0.1)',
                            color:
                              formData.employeeCount === range
                                ? '#06b6d4'
                                : 'rgba(255, 255, 255, 0.5)',
                          }}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-b border-white/10 my-2" />

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif',
                      background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
                    }}
                  >
                    {isSubmitting ? "Submitting..." : "Contact Sales"}
                  </button>

                  <p
                    className="text-center text-xs text-white/30"
                    style={{ fontFamily: 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif' }}
                  >
                    No commitment required • We'll respond within one business day
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EnterpriseWellnessTrial;
