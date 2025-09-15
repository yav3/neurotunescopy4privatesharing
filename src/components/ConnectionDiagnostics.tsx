import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createTherapeuticDebugger } from '@/utils/therapeuticConnectionDebugger';
import { THERAPEUTIC_GOALS } from '@/config/therapeuticGoals';
import { useTherapeuticGoals } from '@/hooks/useTherapeuticGoals';

export const ConnectionDiagnostics: React.FC = () => {
  const { goals, isLoading } = useTherapeuticGoals();

  const runFullDiagnostics = () => {
    console.clear();
    console.log('🚨🚨🚨 RUNNING FULL CONNECTION DIAGNOSTICS 🚨🚨🚨');
    
    // Known buckets from your Supabase storage
    const actualBuckets = [
      { id: 'patientkpi', name: 'Patient KPI' },
      { id: 'neuralpositivemusic', name: 'Neural Positive Music' },
      { id: 'stems', name: 'Stems' },
      { id: 'financial data for chris', name: 'Financial Data' },
      { id: 'neurotunesaiappcondensedmusiclibrary', name: 'Neurotunes Library' },
      { id: 'audio', name: 'Audio' },
      { id: 'ENERGYBOOST', name: 'Energy Boost' },
      { id: 'focus-music', name: 'Focus Music' },
      { id: 'opera', name: 'Opera' },
      { id: 'samba', name: 'Samba' },
      { id: 'HIIT', name: 'HIIT' },
      { id: 'Chopin', name: 'Chopin' },
      { id: 'albumart', name: 'Album Art' },
      { id: 'curated-music-collection', name: 'Curated Music Collection' },
      { id: 'classicalfocus', name: 'Classical Focus' },
      { id: 'newageworldstressanxietyreduction', name: 'New Age World Stress' },
      { id: 'moodboostremixesworlddance', name: 'Mood Boost Remixes' },
      { id: 'pop', name: 'Pop' },
      { id: 'countryandamericana', name: 'Country and Americana' },
      { id: 'gentleclassicalforpain', name: 'Gentle Classical for Pain' },
      { id: 'sonatasforstress', name: 'Sonatas for Stress' },
      { id: 'painreducingworld', name: 'Pain Reducing World' },
      { id: 'NewAgeandWorldFocus', name: 'New Age and World Focus' }
    ];

    console.log('\n📊 BUCKET AVAILABILITY CHECK:');
    console.log(`Total actual buckets: ${actualBuckets.length}`);
    actualBuckets.forEach(bucket => {
      console.log(`✅ ${bucket.id} - ${bucket.name}`);
    });

    console.log('\n🎯 THERAPEUTIC GOALS vs BUCKETS:');
    const configDebugger = createTherapeuticDebugger(THERAPEUTIC_GOALS, actualBuckets);
    configDebugger.debugConnections();

    console.log('\n📈 LOADED GOALS vs BUCKETS:');
    if (goals.length > 0) {
      const goalsDebugger = createTherapeuticDebugger(goals, actualBuckets);
      goalsDebugger.debugConnections();
    } else {
      console.log('❌ No goals loaded yet');
    }

    console.log('\n🔍 DETAILED GOAL ANALYSIS:');
    THERAPEUTIC_GOALS.forEach(goal => {
      console.log(`\nGoal: ${goal.name} (${goal.slug})`);
      console.log(`  ID: ${goal.id}`);
      console.log(`  Backend Key: ${goal.backendKey}`);
      console.log(`  Music Buckets: ${goal.musicBuckets.join(', ')}`);
      console.log(`  BPM Range: ${goal.bpmRange.min}-${goal.bpmRange.max}`);
      
      console.log(`  Bucket Status:`);
      goal.musicBuckets.forEach(bucket => {
        const exists = actualBuckets.some(ab => ab.id === bucket);
        const status = exists ? '✅ EXISTS' : '❌ MISSING';
        console.log(`    ${bucket}: ${status}`);
      });
    });

    console.log('\n🎵 GENRE MAPPING TEST (Sample Goal):');
    const focusGoal = THERAPEUTIC_GOALS.find(g => g.slug === 'focus-enhancement');
    if (focusGoal) {
      console.log(`Testing ${focusGoal.name} genre mappings...`);
      console.log(`Goal buckets:`, focusGoal.musicBuckets);
      
      // Test how GenreView maps these
      const mockGenreOptions = [
        { id: 'crossover-classical', name: 'Crossover Classical', buckets: ['classicalfocus'] },
        { id: 'new-age', name: 'New Age & World Focus', buckets: ['NewAgeandWorldFocus'] },
        { id: 'bach-transpositions', name: 'Focus Music', buckets: ['focus-music'] },
        { id: 'peaceful-piano', name: 'Chopin', buckets: ['Chopin'] },
        { id: 'opera-focus', name: 'Opera', buckets: ['opera'] }
      ];

      mockGenreOptions.forEach(genre => {
        console.log(`  Genre: ${genre.name}`);
        console.log(`    Expected buckets: ${genre.buckets.join(', ')}`);
        genre.buckets.forEach(bucket => {
          const exists = actualBuckets.some(ab => ab.id === bucket);
          console.log(`    ${bucket}: ${exists ? '✅' : '❌'}`);
        });
      });
    }

    console.log('\n🚨 CONNECTION PROBLEMS SUMMARY:');
    const allReferencedBuckets = new Set<string>();
    THERAPEUTIC_GOALS.forEach(goal => {
      goal.musicBuckets.forEach(bucket => allReferencedBuckets.add(bucket));
    });

    const missingBuckets: string[] = [];
    const existingBuckets: string[] = [];
    
    allReferencedBuckets.forEach(bucket => {
      const exists = actualBuckets.some(ab => ab.id === bucket);
      if (exists) {
        existingBuckets.push(bucket);
      } else {
        missingBuckets.push(bucket);
      }
    });

    console.log(`✅ Working connections: ${existingBuckets.length}`);
    console.log(`❌ Broken connections: ${missingBuckets.length}`);
    
    if (missingBuckets.length > 0) {
      console.log('\nMISSING BUCKETS:');
      missingBuckets.forEach(bucket => console.log(`  ❌ ${bucket}`));
    }

    console.log('\n🚨🚨🚨 DIAGNOSTICS COMPLETE 🚨🚨🚨');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Connection Diagnostics</CardTitle>
        <CardDescription>
          Debug therapeutic goals and music bucket connections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground">
            Goals loaded: {goals.length} | Loading: {isLoading ? 'Yes' : 'No'}
          </p>
          <Button 
            onClick={runFullDiagnostics}
            className="w-full"
          >
            Run Full Connection Diagnostics
          </Button>
          <p className="text-xs text-muted-foreground">
            Check browser console for detailed output
          </p>
        </div>
      </CardContent>
    </Card>
  );
};