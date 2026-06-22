import { Building2, Heart, Briefcase, Code, Volume2 } from 'lucide-react';
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
    cta: "Learn More",
    savingsMessage: "Average customer will 50% savings for premium music for spaces, events, & experiences",
    path: "/products/environmental"
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
      starting: "Contact for pricing",
      minimum: "Varies by partnership type"
    },
    keyBenefits: [
      "Content licensing only",
      "White-label full platform",
      "OEM strategic integration",
      "API access",
      "Co-development opportunities"
    ],
    cta: "Learn More",
    path: "/products/partnerships"
  }
};
