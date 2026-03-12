import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Send, Building2, User } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const SF = 'SF Pro, -apple-system, BlinkMacSystemFont, sans-serif';

const businessSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  company: z.string().trim().min(1, "Company name is required").max(200),
  employeeCount: z.string().min(1, "Please select a range"),
});

const personalSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
});

type AccountType = "business" | "personal";

export const EnterpriseWellnessTrial = () => {
  const [accountType, setAccountType] = useState<AccountType>("business");
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

    if (accountType === "business") {
      const result = businessSchema.safeParse(formData);
      if (!result.success) {
        toast.error(result.error.errors[0]?.message || "Please fill all fields");
        return;
      }
    } else {
      const result = personalSchema.safeParse(formData);
      if (!result.success) {
        toast.error(result.error.errors[0]?.message || "Please fill all fields");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contact_submissions").insert({
        name: formData.name,
        email: formData.email,
        company: accountType === "business" ? formData.company : null,
        interest_type: accountType === "business" ? "enterprise_wellness" : "personal_account",
        source: accountType === "business"
          ? `enterprise-wellness | ${formData.employeeCount} employees`
          : "personal-account-request",
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success(
        accountType === "business"
          ? "Thank you! Our sales team will be in touch shortly."
          : "Thank you! We'll notify you when access is available."
      );
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = {
    fontFamily: SF,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
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
            <span className="text-sm" style={{ fontFamily: SF }}>Back to Enterprise Wellness</span>
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
              {/* Account Type Toggle */}
              <div className="flex rounded-xl overflow-hidden mb-8" style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {([
                  { key: "business" as const, icon: Building2, label: "Business Account" },
                  { key: "personal" as const, icon: User, label: "Personal Account" },
                ]).map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => { setAccountType(key); setIsSubmitted(false); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 text-sm transition-all"
                    style={{
                      fontFamily: SF,
                      backgroundColor: accountType === key ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                      color: accountType === key ? '#06b6d4' : 'rgba(255, 255, 255, 0.4)',
                      borderRight: key === "business" ? '1px solid rgba(255, 255, 255, 0.1)' : undefined,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Header */}
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }}
                >
                  {accountType === "business" ? <Building2 className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h1 className="text-lg font-medium text-white" style={{ fontFamily: SF }}>
                    {accountType === "business" ? "Contact Sales" : "Request Access"}
                  </h1>
                  <p className="text-sm text-white/50" style={{ fontFamily: SF }}>
                    {accountType === "business"
                      ? "Register interest in a business account"
                      : "Request access for a personal account"}
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
                  <h2 className="text-2xl font-light text-white mb-3" style={{ fontFamily: SF }}>
                    {accountType === "business" ? "We'll be in touch" : "You're on the list"}
                  </h2>
                  <p className="text-white/50 text-sm max-w-sm mx-auto" style={{ fontFamily: SF }}>
                    {accountType === "business"
                      ? `Our sales team will reach out to ${formData.email} within one business day.`
                      : `We'll notify ${formData.email} as soon as personal access is available.`}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider" style={{ fontFamily: SF }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Smith"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider" style={{ fontFamily: SF }}>
                      {accountType === "business" ? "Work Email" : "Email"}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={accountType === "business" ? "jane@company.com" : "jane@email.com"}
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                      style={inputStyle}
                    />
                  </div>

                  {accountType === "business" && (
                    <>
                      <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider" style={{ fontFamily: SF }}>
                          Company
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Acme Corp"
                          className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
                          style={inputStyle}
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider" style={{ fontFamily: SF }}>
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
                                fontFamily: SF,
                                backgroundColor: formData.employeeCount === range ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                                border: formData.employeeCount === range ? '1px solid rgba(6, 182, 212, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                                color: formData.employeeCount === range ? '#06b6d4' : 'rgba(255, 255, 255, 0.5)',
                              }}
                            >
                              {range}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="border-b border-white/10 my-2" />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: SF, background: 'linear-gradient(135deg, #06b6d4, #2563eb)' }}
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : accountType === "business"
                        ? "Contact Sales"
                        : "Request Access"}
                  </button>

                  <p className="text-center text-xs text-white/30" style={{ fontFamily: SF }}>
                    {accountType === "business"
                      ? "No commitment required • We'll respond within one business day"
                      : "No commitment required • We'll notify you when access is available"}
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
