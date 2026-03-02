import welconyLogo from '@/assets/welcony-logo.png';

export const WelconyBanner = () => {
  return (
    <div className="w-full bg-black py-1.5 flex items-center justify-center gap-2">
      <span className="text-[11px] text-white/50 tracking-wide">Distributed by</span>
      <img 
        src={welconyLogo} 
        alt="Welcony" 
        className="h-4 opacity-70 brightness-0 invert"
      />
    </div>
  );
};
