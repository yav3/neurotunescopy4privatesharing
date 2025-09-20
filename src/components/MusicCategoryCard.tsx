import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

interface MusicCategoryCardProps {
  title: string;
  image: string;
  className?: string;
  onClick?: () => void;
}

export const MusicCategoryCard = ({ title, image, className, onClick }: MusicCategoryCardProps) => {
  return (
    <Card 
      className={cn(
        "relative overflow-hidden cursor-pointer group",
        "bg-gradient-card shadow-card",
        "transition-all duration-500 ease-out",
        "hover:shadow-[0_20px_60px_hsl(217_91%_60%_/_0.3),_0_8px_24px_hsl(217_91%_5%_/_0.6)]",
        "hover:border-primary/40 hover:-translate-y-2 hover:scale-[1.02]",
        "animate-fade-in",
        className
      )}
      onClick={onClick}
    >
      <div className="aspect-square relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 group-hover:from-black/70 transition-all duration-500" />
        
        {/* Animated glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-t from-primary/50 to-transparent" />
        
        {/* Content - Responsive text sizing and better spacing */}
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
          <div className="transform transition-transform duration-300 group-hover:translate-y-[-2px]">
            <h3 className="text-foreground font-semibold text-sm sm:text-base md:text-lg leading-tight drop-shadow-lg break-words hyphens-auto">{title}</h3>
          </div>
        </div>
      </div>
    </Card>
  );
};