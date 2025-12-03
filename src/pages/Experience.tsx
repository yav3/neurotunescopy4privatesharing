import { useState } from "react";
import { NavigationHeader } from "@/components/navigation/NavigationHeader";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { RegistrationChatAssistant } from "@/components/registration/RegistrationChatAssistant";
import FeaturedSessions from "@/components/FeaturedSessions";


export default function Experience() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationHeader />
      <RegistrationChatAssistant 
        isOpen={isRegistrationOpen} 
        onClose={() => setIsRegistrationOpen(false)} 
      />

      {/* FEATURED SESSIONS */}
      <FeaturedSessions />


      <Footer />
    </div>
  );
}
