import welconyLogo from '@/assets/welcony-logo.png';

export const WelconyBanner = () => {
  return (
    <div className="w-full bg-[#020203] py-2.5 flex items-center justify-center gap-3 border-t border-white/[0.04]">
      <span className="text-[10px] text-white/30 tracking-[0.12em]">Distributed by</span>
      <div className="h-6 overflow-hidden" style={{ width: '100px' }}>
        <img src={welconyLogo} alt="Welcony" className="h-6 object-cover opacity-70" style={{ filter: 'brightness(0) invert(0.85)', objectPosition: 'right center' }} />
      </div>
    </div>
  );
};
