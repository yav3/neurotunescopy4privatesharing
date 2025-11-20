import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeamMember {
  name: string;
  credentials: string;
  role: string;
  title: string;
  image?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Yasmine Van Wilt",
    credentials: "PhD, FRSA",
    role: "Co-Founder",
    title: "CEO, CTO",
  },
  {
    name: "Peter Blumen",
    credentials: "ScM, MBA",
    role: "Co-Founder",
    title: "CIO",
  },
  {
    name: "Jim Anderson",
    credentials: "",
    role: "Co-Founder",
    title: "Chief Architect",
  },
  {
    name: "Brian E. Wallace",
    credentials: "MD, PhD, MBA",
    role: "CMedO, President",
    title: "",
  },
  {
    name: "Christopher Long",
    credentials: "MBA",
    role: "CFO, COO",
    title: "",
  },
  {
    name: "Joshua Langenthal",
    credentials: "MCRP, MLA",
    role: "",
    title: "",
  },
  {
    name: "Mike Larson",
    credentials: "",
    role: "Chief Sound Officer",
    title: '"The Minister of Sound"',
  },
  {
    name: "Marcin Waryszak",
    credentials: "",
    role: "SVP Operations",
    title: "",
  },
];

export const TeamCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-24 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <motion.h2
          className="text-5xl lg:text-6xl font-headers font-semibold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            background: 'linear-gradient(135deg, #e0f2f1 0%, #80cbc4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Our Team
        </motion.h2>

        <div className="relative">
          {/* Carousel Container */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center"
              >
                <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-md border border-white/10 rounded-3xl p-12 max-w-2xl w-full">
                  <div className="flex flex-col items-center text-center space-y-6">
                    {/* Avatar */}
                    <Avatar className="w-48 h-48 border-4 border-cyan-400/30 shadow-2xl shadow-cyan-500/30">
                      <AvatarImage src={teamMembers[currentIndex].image} />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white text-4xl font-semibold">
                        {getInitials(teamMembers[currentIndex].name)}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name */}
                    <h3 className="text-4xl font-headers font-semibold text-white">
                      {teamMembers[currentIndex].name}
                    </h3>

                    {/* Credentials */}
                    {teamMembers[currentIndex].credentials && (
                      <p className="text-2xl text-cyan-300 font-medium">
                        {teamMembers[currentIndex].credentials}
                      </p>
                    )}

                    {/* Role & Title */}
                    <div className="space-y-2">
                      {teamMembers[currentIndex].role && (
                        <p className="text-xl text-white/80 border-b border-white/20 pb-2">
                          {teamMembers[currentIndex].role}
                        </p>
                      )}
                      {teamMembers[currentIndex].title && (
                        <p className="text-xl text-white/70">
                          {teamMembers[currentIndex].title}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 bg-cyan-500/20 hover:bg-cyan-500/40 backdrop-blur-md border border-white/20 rounded-full p-4 transition-all duration-300 hover:scale-110"
            aria-label="Previous team member"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 bg-cyan-500/20 hover:bg-cyan-500/40 backdrop-blur-md border border-white/20 rounded-full p-4 transition-all duration-300 hover:scale-110"
            aria-label="Next team member"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-3 mt-12">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-cyan-400 w-12'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to team member ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
