import React, { useEffect, useRef, useState } from "react";

interface DynamicCodeRevealProps {
  codeBlocks: string[];
}

export const DynamicCodeReveal: React.FC<DynamicCodeRevealProps> = ({ codeBlocks }) => {
  return (
    <div className="w-[90%] mx-auto py-16">
      {codeBlocks.map((block, index) => (
        <RevealSection key={index} index={index}>
          {block}
        </RevealSection>
      ))}
    </div>
  );
};

interface RevealSectionProps {
  children: string;
  index: number;
}

const RevealSection: React.FC<RevealSectionProps> = ({ children, index }) => {
  const ref = useRef<HTMLPreElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    const el = ref.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <pre
      ref={ref}
      className={`
        transition-all duration-[1200ms] ease-[cubic-bezier(0.25,0.8,0.25,1)]
        bg-white/[0.03] backdrop-blur-[20px]
        border border-white/[0.08] rounded-2xl
        p-8 my-8
        font-mono text-[0.95rem]
        cursor-pointer
        ${visible 
          ? 'opacity-100 translate-y-0 scale-100 shadow-[0_12px_40px_hsl(var(--liquid-aquatic-deep)/0.5)]' 
          : 'opacity-0 translate-y-10 scale-[0.98] shadow-[0_8px_30px_hsl(var(--liquid-glass-shadow)/0.3)]'
        }
        hover:brightness-[1.2] hover:contrast-[1.1]
        hover:shadow-[0_16px_50px_hsl(var(--liquid-cyan-core)/0.5)]
        hover:bg-white/[0.06]
      `}
      style={{
        transitionDelay: `${Math.random() * 0.5}s`,
        color: 'hsl(var(--liquid-pearl-highlight))',
        backdropFilter: 'blur(20px) saturate(140%)'
      }}
    >
      <code className="text-[hsl(var(--liquid-pearl-highlight))]">
        {children}
      </code>
    </pre>
  );
};
