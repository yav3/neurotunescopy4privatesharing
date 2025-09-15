import React from 'react';
import { TherapeuticRow } from './TherapeuticRow';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { cn } from '@/lib/utils';
import { createTherapeuticDebugger } from '@/utils/therapeuticConnectionDebugger';

// Add scrollbar hide styles to index.css instead
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

// Inject styles into document head
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('scrollbar-hide-styles');
  if (!existingStyle) {
    const style = document.createElement('style');
    style.id = 'scrollbar-hide-styles';
    style.textContent = scrollbarHideStyles;
    document.head.appendChild(style);
  }
}

interface TherapeuticRowsLayoutProps {
  className?: string;
}

export const TherapeuticRowsLayout: React.FC<TherapeuticRowsLayoutProps> = ({ className }) => {
  // DEBUG: Check therapeutic goals structure and connections
  React.useEffect(() => {
    console.log('🚨 THERAPEUTIC ROWS LAYOUT DEBUG 🚨');
    console.log('Total therapeutic goals loaded:', THERAPEUTIC_GOALS.length);
    
    // Create mock buckets for debugging
    const mockMusicBuckets = [
      { id: 'classicalfocus', name: 'Classical Focus' },
      { id: 'NewAgeandWorldFocus', name: 'New Age World Focus' },
      { id: 'focus-music', name: 'Focus Music' },
      { id: 'Chopin', name: 'Chopin' },
      { id: 'opera', name: 'Opera' },
      { id: 'sonatasforstress', name: 'Sonatas for Stress' },
      { id: 'samba', name: 'Samba' },
      { id: 'neuralpositivemusic', name: 'Neural Positive Music' },
      { id: 'gentleclassicalforpain', name: 'Gentle Classical for Pain' },
      { id: 'painreducingworld', name: 'Pain Reducing World' },
      { id: 'pop', name: 'Pop' },
      { id: 'moodboostremixesworlddance', name: 'Mood Boost Remixes' },
      { id: 'HIIT', name: 'HIIT' },
      { id: 'house', name: 'House' },
      { id: 'ENERGYBOOST', name: 'Energy Boost' }
    ];

    const rowsDebugger = createTherapeuticDebugger(THERAPEUTIC_GOALS, mockMusicBuckets);
    rowsDebugger.debugConnections();

    console.log('🎵 MUSIC BUCKET CONNECTIONS BY GOAL:');
    THERAPEUTIC_GOALS.forEach(goal => {
      console.log(`Goal: ${goal.name} (${goal.slug})`);
      console.log(`  Music buckets:`, goal.musicBuckets);
      console.log(`  Backend key:`, goal.backendKey);
      console.log(`  Bucket connections test:`);
      goal.musicBuckets.forEach(bucket => {
        const exists = mockMusicBuckets.some(mb => mb.id === bucket);
        console.log(`    ${bucket}: ${exists ? '✅' : '❌'}`);
      });
      console.log('  ---');
    });
  }, []);

  return (
    <section className={cn("px-4 md:px-8 mb-32 pt-8 sm:pt-12", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Therapeutic rows */}
        <div className="space-y-6 sm:space-y-8">
          {THERAPEUTIC_GOALS.map((goal) => (
            <TherapeuticRow 
              key={goal.id} 
              goal={goal} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};