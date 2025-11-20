import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NavigationHeader } from '@/components/navigation/NavigationHeader';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Sparkles, Users, TrendingUp, Shield } from 'lucide-react';
import businessBg from '@/assets/business-bg.png';

interface BusinessTypeData {
  name: string;
  title: string;
  description: string;
  badge?: string;
  benefits: string[];
  features: string[];
  useCases: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

const businessData: Record<string, BusinessTypeData> = {
  gyms: {
    name: 'Gyms',
    title: 'Transform Your Gym Experience',
    description: 'Enhance workout motivation and recovery with scientifically-designed music therapy',
    benefits: [
      'Boost member motivation during workouts',
      'Accelerate recovery with targeted soundscapes',
      'Reduce member churn with enhanced experiences',
      'Create distinct zones with therapeutic music'
    ],
    features: [
      'High-energy tracks for cardio zones',
      'Calming music for yoga and stretching areas',
      'Focus-enhancing audio for strength training',
      'Post-workout recovery playlists'
    ],
    useCases: [
      'Group fitness classes',
      'Personal training sessions',
      'Recovery and cool-down areas',
      'Meditation and yoga studios'
    ]
  },
  medical: {
    name: 'Medical',
    title: 'Healing Through Sound',
    description: 'Evidence-based music therapy for clinical environments',
    badge: 'First Responder Discount',
    benefits: [
      'Reduce patient anxiety and stress',
      'Improve clinical outcomes',
      'Support healthcare worker wellbeing',
      'Create calming treatment environments'
    ],
    features: [
      'Pre-procedure anxiety reduction',
      'Pain management support',
      'Post-operative recovery enhancement',
      'Staff stress relief programs'
    ],
    useCases: [
      'Waiting rooms',
      'Treatment areas',
      'Recovery rooms',
      'Staff break rooms'
    ]
  },
  dental: {
    name: 'Dental',
    title: 'Ease Dental Anxiety',
    description: 'Reduce patient stress and improve treatment experiences',
    benefits: [
      'Decrease patient anxiety by up to 40%',
      'Reduce perceived treatment time',
      'Improve patient satisfaction scores',
      'Create a relaxing practice atmosphere'
    ],
    features: [
      'Anxiety-reducing soundscapes',
      'Procedure-specific playlists',
      'Pediatric-friendly music options',
      'Noise-masking audio therapy'
    ],
    useCases: [
      'Waiting areas',
      'Treatment rooms',
      'Pediatric zones',
      'Recovery areas'
    ]
  },
  salons: {
    name: 'Salons',
    title: 'Elevate the Salon Experience',
    description: 'Create a luxurious, relaxing atmosphere for your clients',
    benefits: [
      'Enhance client relaxation',
      'Increase appointment durations',
      'Boost retail sales through ambiance',
      'Differentiate your brand'
    ],
    features: [
      'Spa-quality soundscapes',
      'Energizing morning playlists',
      'Relaxing afternoon sessions',
      'Customizable by service type'
    ],
    useCases: [
      'Hair styling areas',
      'Spa treatment rooms',
      'Nail stations',
      'Waiting lounges'
    ]
  },
  spas: {
    name: 'Spas',
    title: 'The Ultimate Spa Atmosphere',
    description: 'Scientifically-designed audio for maximum relaxation',
    benefits: [
      'Deepen relaxation states',
      'Enhance treatment effectiveness',
      'Increase booking values',
      'Create memorable experiences'
    ],
    features: [
      'Multi-sensory audio experiences',
      'Treatment-specific soundscapes',
      'Nature-inspired compositions',
      'Binaural and spatial audio options'
    ],
    useCases: [
      'Massage rooms',
      'Facial treatment areas',
      'Hydrotherapy spaces',
      'Relaxation lounges'
    ]
  },
  'senior-communities': {
    name: 'Senior Communities',
    title: 'Wellness for Senior Living',
    description: 'Cognitive support and emotional wellbeing through music therapy',
    badge: 'Special Pricing',
    benefits: [
      'Support cognitive function',
      'Reduce agitation and anxiety',
      'Improve quality of life',
      'Foster social connection'
    ],
    features: [
      'Memory-stimulating playlists',
      'Calming evening soundscapes',
      'Social activity music programs',
      'Therapeutic intervention support'
    ],
    useCases: [
      'Common areas',
      'Dining rooms',
      'Activity centers',
      'Individual living spaces'
    ]
  },
  retail: {
    name: 'Retail Stores',
    title: 'Drive Sales Through Sound',
    description: 'Create shopping environments that increase dwell time and purchases',
    benefits: [
      'Increase average transaction value',
      'Extend customer dwell time',
      'Reduce perceived wait times',
      'Enhance brand perception'
    ],
    features: [
      'Peak hours energy boost',
      'Slow shopping tempo music',
      'Seasonal mood enhancement',
      'Brand-aligned soundscapes'
    ],
    useCases: [
      'Sales floors',
      'Checkout areas',
      'Fitting rooms',
      'Customer service desks'
    ]
  },
  grocery: {
    name: 'Grocery Stores',
    title: 'Enhance Shopping Flow',
    description: 'Optimize customer experience and basket size through strategic audio',
    benefits: [
      'Increase basket size',
      'Smooth traffic flow',
      'Reduce checkout stress',
      'Improve staff morale'
    ],
    features: [
      'Morning energy tracks',
      'Afternoon relaxation',
      'Evening wind-down',
      'Department-specific audio'
    ],
    useCases: [
      'Produce sections',
      'Checkout lanes',
      'Deli counters',
      'Bakery areas'
    ]
  },
  'shopping-malls': {
    name: 'Shopping Malls',
    title: 'Create Destination Experiences',
    description: 'Transform mall environments into engaging destinations',
    benefits: [
      'Increase visitor duration',
      'Drive foot traffic to tenants',
      'Create memorable experiences',
      'Support tenant success'
    ],
    features: [
      'Zone-specific soundscapes',
      'Event-responsive audio',
      'Seasonal programming',
      'Common area enhancement'
    ],
    useCases: [
      'Atriums and commons',
      'Food courts',
      'Corridors',
      'Seating areas'
    ]
  },
  'car-dealerships': {
    name: 'Car Dealerships',
    title: 'Close More Deals',
    description: 'Reduce buyer anxiety and create premium experiences',
    benefits: [
      'Reduce purchase anxiety',
      'Create premium perception',
      'Improve customer satisfaction',
      'Enhance showroom atmosphere'
    ],
    features: [
      'Luxury brand audio',
      'Test drive mood setting',
      'Service lounge comfort',
      'Negotiation space calming'
    ],
    useCases: [
      'Showroom floors',
      'Customer lounges',
      'Service areas',
      'Test drive preparation'
    ]
  },
  restaurants: {
    name: 'Restaurants',
    title: 'Perfect Dining Ambiance',
    description: 'Enhance dining experiences and increase table turnover',
    benefits: [
      'Increase per-table spending',
      'Optimize table turnover',
      'Enhance food perception',
      'Create memorable dining'
    ],
    features: [
      'Dining tempo management',
      'Cuisine-appropriate soundscapes',
      'Time-of-day programming',
      'Private event audio'
    ],
    useCases: [
      'Dining rooms',
      'Bar areas',
      'Outdoor seating',
      'Private rooms'
    ]
  },
  hotels: {
    name: 'Hotels',
    title: 'Exceptional Guest Experiences',
    description: 'From lobby to room, create unforgettable stays',
    benefits: [
      'Increase guest satisfaction scores',
      'Reduce perceived stress',
      'Enhance sleep quality',
      'Drive positive reviews'
    ],
    features: [
      'Lobby welcoming audio',
      'In-room relaxation',
      'Spa and pool soundscapes',
      'Conference room focus'
    ],
    useCases: [
      'Lobbies',
      'Guest rooms',
      'Spas and pools',
      'Restaurants and bars'
    ]
  },
  cafes: {
    name: 'Cafés & Coffee Shops',
    title: 'The Perfect Coffee Shop Vibe',
    description: 'Create environments where customers want to stay and work',
    benefits: [
      'Increase dwell time',
      'Boost afternoon sales',
      'Create work-friendly atmosphere',
      'Differentiate from chains'
    ],
    features: [
      'Morning energy boost',
      'Afternoon focus support',
      'Evening wind-down',
      'Study-friendly audio'
    ],
    useCases: [
      'Seating areas',
      'Counter service',
      'Outdoor patios',
      'Study corners'
    ]
  },
  bars: {
    name: 'Bars & Pubs',
    title: 'Elevate the Bar Experience',
    description: 'Create the perfect atmosphere for every hour',
    benefits: [
      'Extend patron stay time',
      'Increase drink orders',
      'Create distinct atmospheres',
      'Reduce noise complaints'
    ],
    features: [
      'Happy hour energy',
      'Late night atmosphere',
      'Event-specific audio',
      'Conversation-friendly levels'
    ],
    useCases: [
      'Bar areas',
      'Lounge spaces',
      'Outdoor areas',
      'Private rooms'
    ]
  },
  churches: {
    name: 'Churches',
    title: 'Sacred Sound Experiences',
    description: 'Enhance worship and community spaces',
    benefits: [
      'Deepen spiritual connection',
      'Support meditation and prayer',
      'Enhance community events',
      'Create peaceful environments'
    ],
    features: [
      'Pre-service meditation',
      'Post-service reflection',
      'Community space audio',
      'Youth program soundscapes'
    ],
    useCases: [
      'Sanctuaries',
      'Prayer rooms',
      'Community halls',
      'Youth spaces'
    ]
  },
  offices: {
    name: 'Offices',
    title: 'Productive Work Environments',
    description: 'Boost focus, creativity, and employee wellbeing',
    benefits: [
      'Increase productivity by up to 30%',
      'Reduce stress and burnout',
      'Mask distracting noise',
      'Support different work modes'
    ],
    features: [
      'Focus-enhancing audio',
      'Creative brainstorming soundscapes',
      'Break room relaxation',
      'Meeting room clarity'
    ],
    useCases: [
      'Open office areas',
      'Private offices',
      'Conference rooms',
      'Break rooms'
    ]
  },
  schools: {
    name: 'Schools',
    title: 'Learning Through Sound',
    description: 'Support student focus, creativity, and emotional regulation',
    benefits: [
      'Improve student focus',
      'Support emotional regulation',
      'Enhance creative activities',
      'Reduce classroom stress'
    ],
    features: [
      'Focus music for study time',
      'Calming transition audio',
      'Creative project soundscapes',
      'Teacher wellness support'
    ],
    useCases: [
      'Classrooms',
      'Libraries',
      'Common areas',
      'Special education spaces'
    ]
  },
  'academic-hospitals': {
    name: 'Academic Hospitals',
    title: 'Research-Based Healing',
    description: 'Clinical excellence meets cutting-edge music therapy',
    badge: 'Academic Discount',
    benefits: [
      'Support clinical research',
      'Improve patient outcomes',
      'Reduce healthcare costs',
      'Enhance learning environments'
    ],
    features: [
      'Research-backed protocols',
      'Clinical trial support',
      'Teaching integration',
      'Staff wellness programs'
    ],
    useCases: [
      'Patient rooms',
      'Research facilities',
      'Teaching spaces',
      'Staff areas'
    ]
  },
  'cultural-spaces': {
    name: 'Cultural Spaces',
    title: 'Enhance Cultural Experiences',
    description: 'Complement exhibitions and performances with therapeutic audio',
    benefits: [
      'Deepen visitor engagement',
      'Extend visit duration',
      'Support diverse programming',
      'Create memorable experiences'
    ],
    features: [
      'Exhibition soundscapes',
      'Event pre-show audio',
      'Intermission programming',
      'Lobby atmosphere'
    ],
    useCases: [
      'Exhibition spaces',
      'Performance venues',
      'Lobbies',
      'Outdoor areas'
    ]
  }
};

export const BusinessType = () => {
  const { type } = useParams<{ type: string }>();
  const data = businessData[type || ''];

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Business Type Not Found</h1>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      
      {/* Hero Section */}
      <section 
        className="relative py-32 px-6 overflow-hidden"
        style={{
          backgroundImage: `url(${businessBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {data.badge && (
              <Badge className="mb-6 text-sm px-4 py-2 bg-primary/20 text-primary border-primary/30">
                {data.badge}
              </Badge>
            )}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              {data.title}
            </h1>
            <p className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
              {data.description}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/demo">
                <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full px-8 text-lg">
                  See Samples <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="rounded-full px-8 text-lg border-primary/30 hover:bg-primary/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-primary/10">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-4xl font-bold">Key Benefits</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {data.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-6 rounded-xl bg-background/50 border border-border/50 hover:bg-background/80 transition-all"
                >
                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-lg">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-4xl font-bold">Features & Capabilities</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all group"
                >
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-base font-medium">{feature}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-4xl font-bold">Common Use Cases</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.useCases.map((useCase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="p-5 rounded-xl bg-background/50 border border-primary/20 text-center hover:bg-background/80 hover:border-primary/40 transition-all"
                >
                  <p className="font-medium">{useCase}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-12">
              Join hundreds of {data.name.toLowerCase()} using NeuroTunes to enhance their spaces
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/demo">
                <Button size="lg" className="bg-primary hover:bg-primary/90 rounded-full px-8 text-lg">
                  Explore Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="rounded-full px-8 text-lg border-primary/30 hover:bg-primary/10">
                  Talk to Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};