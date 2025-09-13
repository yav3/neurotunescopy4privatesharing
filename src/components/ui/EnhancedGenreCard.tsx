import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedGenreCardProps {
  genre: {
    id: string;
    name: string;
    description: string;
    trackCount?: string;
    image: string;
  };
  onSelect: (genreId: string) => void;
  index: number;
}

export const EnhancedGenreCard: React.FC<EnhancedGenreCardProps> = ({ 
  genre, 
  onSelect, 
  index 
}) => {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden cursor-pointer h-80",
        "backdrop-blur-xl bg-white/10 border border-white/20",
        "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
        "transition-all duration-700 ease-out",
        "hover:shadow-[0_20px_60px_rgba(31,38,135,0.6)]",
        "hover:border-white/40 hover:-translate-y-4 hover:scale-105",
        "animate-fade-in",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
        "before:translate-x-[-100%] before:transition-transform before:duration-1000",
        "hover:before:translate-x-[100%]"
      )}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
      onClick={() => onSelect(genre.id)}
    >
      {/* Background Image with Luminous Effect */}
      <div className="absolute inset-0">
        <img 
          src={genre.image} 
          alt={genre.name}
          className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 group-hover:brightness-125 group-hover:saturate-125"
        />
        {/* Multi-layered Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 group-hover:from-black/10 transition-all duration-700" />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />
        
        {/* Illuminated Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700 bg-gradient-radial from-white/20 via-transparent to-transparent blur-sm" />
      </div>

      {/* Floating Track Count Badge */}
      {genre.trackCount && (
        <Badge 
          variant="secondary" 
          className={cn(
            "absolute top-4 right-4 z-10",
            "backdrop-blur-md bg-white/20 border border-white/30",
            "text-white font-medium",
            "shadow-lg",
            "transition-all duration-500 ease-out",
            "group-hover:bg-white/30 group-hover:border-white/50",
            "group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)]"
          )}
        >
          {genre.trackCount} tracks
        </Badge>
      )}

      {/* Premium Content Container */}
      <div className="relative h-full flex flex-col justify-end p-6 z-10">
        {/* Clean Title without Box */}
        <div className="mb-4">
          <h3 className={cn(
            "text-white text-2xl font-bold mb-3 leading-tight",
            "drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]",
            "transition-all duration-500",
            "group-hover:drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]",
            "group-hover:text-white"
          )}>
            {genre.name}
          </h3>
          
          {/* Enhanced Description with Better Contrast */}
          <p className={cn(
            "text-white/95 text-sm leading-relaxed",
            "drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]",
            "opacity-80 group-hover:opacity-100 transition-all duration-500",
            "max-h-0 overflow-hidden group-hover:max-h-20 transition-all duration-700"
          )}>
            {genre.description}
          </p>
        </div>

        {/* Premium Action Button */}
        <Button 
          className={cn(
            "w-full backdrop-blur-md bg-white/20 border border-white/30",
            "text-white font-semibold",
            "shadow-lg hover:shadow-xl",
            "transition-all duration-500 ease-out",
            "hover:bg-white/30 hover:border-white/50",
            "hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]",
            "group-hover:scale-105",
            "opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(genre.id);
          }}
        >
          <Play className="w-4 h-4 mr-2" />
          Begin Session
        </Button>
      </div>

      {/* Animated Light Particles */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-1 h-1 bg-white/60 rounded-full",
              "animate-pulse"
            )}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 200}ms`,
              animationDuration: '2s',
            }}
          />
        ))}
      </div>
    </Card>
  );
};