// Stripe Price IDs Configuration
// Replace these placeholder IDs with your actual Stripe Price IDs from the Stripe Dashboard

export const STRIPE_PRICES = {
  // Clinical Pricing (/pricing)
  SMALL_BUSINESS: 'price_small_business_yearly',        // $29.99/user/year (min 40 seats)
  CLINICAL: 'price_clinical_monthly',                   // $299/month
  ENTERPRISE_CUSTOM: 'price_enterprise_custom',         // Custom pricing (contact sales)

  // Consumer Pricing (/app-download)
  INDIVIDUAL: 'price_individual_yearly',                // $59.99/year
  STUDENT_SERVICE: 'price_student_service_yearly',      // $49.99/year
  FAMILY: 'price_family_yearly',                        // $99.99/year

  // Enterprise Wellness (/products/enterprise-wellness)
  ENTERPRISE_WELLNESS: 'price_enterprise_wellness_yearly', // $14.99/user/year (min 1,000 seats)
};
