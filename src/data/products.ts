import { Building2, Heart, Briefcase, Smartphone, Code, Volume2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Product {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  targetMarkets: string[];
  pricing: {
    model: string;
    starting: string;
    minimum: string;
  };
  keyBenefits: string[];
  cta: string;
  path: string;
  savingsMessage?: string;
  secondaryCta?: string;
}

export const NEUROTUNES_PRODUCTS: Record<string, Product> = {
  environmental: {
    id: "environmental",
    icon: Volume2,
    title: "Environmental & Background",
    tagline: "Therapeutic ambient music for spaces",
    description: "PRO-free environmental music for facilities, retail, hospitality, and public spaces",
    targetMarkets: [
      "Senior living facilities",
      "Retail stores & shopping centers",
      "Hotels & hospitality",
      "Restaurants & cafés",
      "Spas & wellness centers",
      "Gyms & fitness centers",
      "Dental & medical offices (waiting rooms)",
      "Churches & cultural spaces"
    ],
    pricing: {
      model: "Per site/square footage",
      starting: "$7K-$17K per site per year",
      minimum: "75,000+ sq ft typical"
    },
    keyBenefits: [
      "Zero PRO licensing fees (100% proprietary)",
      "Multi-room zone control",
      "Time-of-day programming",
      "Eliminates ASCAP/BMI/SESAC costs",
      "Cloud-managed system"
    ],
    cta: "Buy",
    secondaryCta: "Request Site Assessment",
    savingsMessage: "Average customer will 50% savings for premium music for spaces, events, & experiences",
    path: "/products/environmental"
  },

  populationHealth: {
    id: "population-health",
    icon: Heart,
    title: "Enterprise Population Health",
    tagline: "Clinical-grade therapeutic music at scale",
    description: "Deployed across health systems, insurance networks, and government wellness programs",
    targetMarkets: [
      "Hospital systems (5,000+ patients)",
      "Health insurance networks",
      "Government health programs (VA, Military)",
      "National wellness initiatives",
      "Pharmacy benefit managers",
      "Accountable care organizations (ACOs)"
    ],
    pricing: {
      model: "Per patient/member population",
      starting: "$250K-$1.5M per year",
      minimum: "5,000+ covered lives"
    },
    keyBenefits: [
      "Reduce patient anxiety 30-45%",
      "Lower perceived pain scores",
      "Improve HCAHPS satisfaction",
      "EMR/EHR integration",
      "Clinical outcomes tracking",
      "Population-scale analytics"
    ],
    cta: "Schedule Clinical Consultation",
    path: "/products/population-health"
  },

  enterpriseWellness: {
    id: "enterprise-wellness",
    icon: Briefcase,
    title: "Enterprise Wellness",
    tagline: "Workplace mental health & productivity",
    description: "Corporate wellness programs for employee mental health, focus, and resilience",
    targetMarkets: [
      "Corporate offices (1,000+ employees)",
      "Call centers & customer service",
      "Creative agencies & studios",
      "Universities & academic institutions",
      "Government offices",
      "Tech companies & startups"
    ],
    pricing: {
      model: "Per employee or site-based",
      starting: "Custom pricing for organizations",
      minimum: "1,000+ employees typical"
    },
    keyBenefits: [
      "Boost productivity 15-25%",
      "Reduce stress-related absence",
      "Improve focus & cognitive performance",
      "Enhance employee retention",
      "Mental wellness support",
      "Integration with HR systems"
    ],
    cta: "Request Wellness Consultation",
    path: "/products/enterprise-wellness"
  },

  consumer: {
    id: "consumer",
    icon: Smartphone,
    title: "Personal Wellness App",
    tagline: "Individual therapeutic music",
    description: "iOS and Android app for personal anxiety relief, focus, sleep, and wellness",
    targetMarkets: [
      "Individual consumers",
      "Clinicians for personal use",
      "Wellness enthusiasts",
      "Anyone seeking therapeutic music"
    ],
    pricing: {
      model: "🎉 Black Friday Special",
      starting: "$25.99/year or $5.99/month",
      minimum: "Web, iOS & Android"
    },
    keyBenefits: [
      "8,500+ therapeutic tracks",
      "Offline download",
      "Mood tracking",
      "Personalized recommendations",
      "Family plan available (up to 6 accounts)"
    ],
    cta: "Download App",
    path: "/app-download"
  },

  partnerships: {
    id: "partnerships",
    icon: Code,
    title: "Partnerships & Integration",
    tagline: "White-label, OEM, API",
    description: "Platform integration, content licensing, and co-development for wellness platforms",
    targetMarkets: [
      "Wellness app platforms",
      "Health tech companies",
      "Automotive (in-car wellness)",
      "Airlines (in-flight wellness)",
      "Smart home devices",
      "Wearable manufacturers"
    ],
    pricing: {
      model: "Custom partnership agreements",
      starting: "$150K-$5M per year",
      minimum: "Varies by partnership type"
    },
    keyBenefits: [
      "Content licensing only",
      "White-label full platform",
      "OEM strategic integration",
      "API access",
      "Co-development opportunities"
    ],
    cta: "Explore Partnership",
    path: "/products/partnerships"
  }
};
