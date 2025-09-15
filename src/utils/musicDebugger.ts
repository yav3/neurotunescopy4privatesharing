// Music Bucket Connection Debugger - Tailored for your app
export class TherapeuticMusicDebugger {
  bucketIdentifiers: string[];
  displayNameMappings: Record<string, string>;

  constructor() {
    // Your internal bucket identifiers
    this.bucketIdentifiers = [
      'neuralpositivemusic',
      'ENERGYBOOST', 
      'focus-music',
      'opera',
      'HIIT',
      'samba',
      'Chopin',
      'albumart',
      'classicalfocus',
      'newageworldstressanxietyreduction',
      'moodboostremixesworlddance',
      'pop',
      'countryandamericana',
      'gentleclassicalforpain',
      'sonatasforstress',
      'painreducingworld',
      'NewAgeandWorldFocus'
    ];
    
    // Likely display name mappings (inferred from your screenshot)
    this.displayNameMappings = {
      'newageworldstressanxietyreduction': 'New Age & World Stress Relief',
      'painreducingworld': 'Stress & Anxiety Support',
      'sonatasforstress': 'Stress & Anxiety Support',
      'gentleclassicalforpain': 'Pain Relief',
      'focus-music': 'Focus & Concentration',
      'classicalfocus': 'Focus & Concentration',
      'NewAgeandWorldFocus': 'Focus & Concentration',
      'ENERGYBOOST': 'Energy & Motivation',
      'neuralpositivemusic': 'Positive Mood',
      'moodboostremixesworlddance': 'Mood Boost'
    };
  }

  debugMusicConnection(selectedBucket: any, musicTracks: any[], allBuckets?: any[]) {
    console.log('🎵 THERAPEUTIC MUSIC CONNECTION DEBUG');
    console.log('====================================');
    
    console.log('Selected Bucket:', selectedBucket);
    console.log('Music Tracks Count:', musicTracks?.length || 0);
    console.log('Available Buckets:', allBuckets?.length || 0);
    console.log('');

    this.checkBucketIdentifierMatch(selectedBucket);
    this.checkMusicTrackStructure(musicTracks);
    this.testConnectionMethods(selectedBucket, musicTracks);
    this.provideSpecificSolutions(selectedBucket);
  }

  checkBucketIdentifierMatch(selectedBucket: any) {
    console.log('🎯 BUCKET IDENTIFIER ANALYSIS:');
    
    if (!selectedBucket) {
      console.log('❌ No bucket selected');
      return;
    }

    const bucketName = selectedBucket.name || selectedBucket.title || selectedBucket.displayName;
    const bucketId = selectedBucket.id;
    
    console.log(`Display Name: "${bucketName}"`);
    console.log(`Bucket ID: "${bucketId}"`);
    
    // Check if bucket ID matches any of your identifiers
    const matchingIdentifier = this.bucketIdentifiers.find(id => 
      id.toLowerCase() === bucketId?.toLowerCase()
    );
    
    if (matchingIdentifier) {
      console.log(`✅ Bucket ID "${bucketId}" matches identifier: ${matchingIdentifier}`);
    } else {
      console.log(`❌ Bucket ID "${bucketId}" doesn't match any known identifiers`);
      console.log('Known identifiers:', this.bucketIdentifiers.join(', '));
    }

    // Check for display name mapping
    const possibleIds = Object.keys(this.displayNameMappings).filter(id => 
      this.displayNameMappings[id] === bucketName
    );
    
    if (possibleIds.length > 0) {
      console.log(`💡 Display name "${bucketName}" might map to: ${possibleIds.join(', ')}`);
    }
    console.log('');
  }

  checkMusicTrackStructure(musicTracks: any[]) {
    console.log('🎼 MUSIC TRACK STRUCTURE:');
    
    if (!musicTracks || musicTracks.length === 0) {
      console.log('❌ No music tracks available');
      return;
    }

    const sampleTrack = musicTracks[0];
    console.log('Sample track structure:');
    console.log(JSON.stringify(sampleTrack, null, 2));
    
    // Check which of your bucket identifiers appear in the music tracks
    const foundIdentifiers = new Set<string>();
    const connectionFields = new Set<string>();
    
    musicTracks.forEach(track => {
      // Check all possible connection fields
      Object.keys(track).forEach(key => {
        if (typeof track[key] === 'string' && this.bucketIdentifiers.includes(track[key])) {
          foundIdentifiers.add(track[key]);
          connectionFields.add(key);
        }
        if (Array.isArray(track[key])) {
          track[key].forEach((value: any) => {
            if (this.bucketIdentifiers.includes(value)) {
              foundIdentifiers.add(value);
              connectionFields.add(key);
            }
          });
        }
      });
    });

    console.log(`✅ Found identifiers in tracks: ${Array.from(foundIdentifiers).join(', ')}`);
    console.log(`✅ Connection fields used: ${Array.from(connectionFields).join(', ')}`);
    console.log('');
  }

  testConnectionMethods(selectedBucket: any, musicTracks: any[]) {
    console.log('🔗 CONNECTION METHOD TESTING:');
    
    if (!selectedBucket || !musicTracks?.length) {
      console.log('❌ Missing bucket or music data for testing');
      return;
    }

    const bucketId = selectedBucket.id;
    const bucketName = selectedBucket.name || selectedBucket.title;
    
    // Test Method 1: Direct ID match
    const directMatches = musicTracks.filter(track => 
      track.bucketId === bucketId || 
      track.bucket_id === bucketId ||
      track.categoryId === bucketId ||
      track.category === bucketId
    );
    console.log(`Method 1 (Direct ID): ${directMatches.length} matches`);

    // Test Method 2: Display name to identifier mapping
    const possibleIds = Object.keys(this.displayNameMappings).filter(id => 
      this.displayNameMappings[id] === bucketName
    );
    
    let mappingMatches = 0;
    if (possibleIds.length > 0) {
      possibleIds.forEach(id => {
        const matches = musicTracks.filter(track => 
          track.bucketId === id || 
          track.bucket_id === id ||
          track.categoryId === id ||
          track.category === id ||
          (track.categories && track.categories.includes(id)) ||
          (track.tags && track.tags.includes(id))
        );
        mappingMatches += matches.length;
        if (matches.length > 0) {
          console.log(`  Using identifier "${id}": ${matches.length} matches`);
          console.log(`  Sample tracks: ${matches.slice(0, 3).map(t => t.title || t.name).join(', ')}`);
        }
      });
    }
    console.log(`Method 2 (Mapping): ${mappingMatches} total matches`);

    // Test Method 3: Fuzzy string matching
    const fuzzyMatches = musicTracks.filter(track => {
      const trackFields = [
        track.bucketId, track.bucket_id, track.category, track.categoryId,
        ...(track.categories || []), ...(track.tags || [])
      ];
      return trackFields.some((field: any) => 
        field && typeof field === 'string' && 
        (field.toLowerCase().includes(bucketName?.toLowerCase()) ||
         bucketName?.toLowerCase().includes(field.toLowerCase()))
      );
    });
    console.log(`Method 3 (Fuzzy): ${fuzzyMatches.length} matches`);
    console.log('');
  }

  provideSpecificSolutions(selectedBucket: any) {
    console.log('💡 SPECIFIC SOLUTIONS FOR YOUR APP:');
    
    const bucketName = selectedBucket?.name || selectedBucket?.title;
    
    console.log('1. CHECK YOUR BUCKET ID MAPPING:');
    console.log(`   If displaying "${bucketName}", ensure the bucket object has:`);
    console.log(`   { id: "newageworldstressanxietyreduction", name: "${bucketName}" }`);
    console.log('');
    
    console.log('2. ADD THIS DEBUG CODE TO YOUR COMPONENT:');
    console.log(`
// In your music filtering component:
useEffect(() => {
  console.log('=== MUSIC FILTER DEBUG ===');
  console.log('Selected Bucket:', selectedBucket);
  console.log('Music Tracks Sample:', musicTracks?.slice(0, 2));
  
  // Test with your actual identifiers
  const testIds = ['newageworldstressanxietyreduction', 'painreducingworld', 'sonatasforstress'];
  testIds.forEach(testId => {
    const matches = musicTracks?.filter(track => 
      track.bucketId === testId || 
      track.category === testId ||
      (track.categories && track.categories.includes(testId))
    );
    console.log(\`Tracks for \${testId}: \${matches?.length || 0}\`);
    if (matches?.length > 0) {
      console.log('  Sample:', matches.slice(0, 2).map(t => t.title));
    }
  });
}, [selectedBucket, musicTracks]);
    `);
    
    console.log('3. VERIFY YOUR FILTER FUNCTION:');
    console.log(`
// Your filter should probably look like:
const filterMusicForBucket = (bucket, tracks) => {
  if (!bucket || !tracks) return [];
  
  return tracks.filter(track => {
    // Try multiple connection methods
    return track.bucketId === bucket.id ||
           track.category === bucket.id ||
           (track.categories && track.categories.includes(bucket.id)) ||
           (track.tags && track.tags.includes(bucket.id));
  });
};
    `);
    
    console.log('4. COMMON FIXES:');
    console.log('   ✓ Ensure bucket.id uses internal identifier (e.g., "newageworldstressanxietyreduction")');
    console.log('   ✓ Check music tracks have matching bucketId/category field');
    console.log('   ✓ Verify data loads before filtering runs');
    console.log('   ✓ Check for string vs number ID type mismatches');
    console.log('   ✓ Make sure bucket selection properly sets the selected bucket state');
  }

  // Quick test for specific scenarios
  testStressAnxietyBucket(musicTracks: any[]) {
    console.log('🧪 TESTING STRESS & ANXIETY BUCKET:');
    
    const possibleIds = ['newageworldstressanxietyreduction', 'painreducingworld', 'sonatasforstress'];
    
    possibleIds.forEach(id => {
      const matches = musicTracks?.filter(track => 
        track.bucketId === id || 
        track.category === id ||
        (track.categories && track.categories.includes(id))
      );
      
      console.log(`ID "${id}": ${matches?.length || 0} tracks`);
      if (matches?.length > 0) {
        console.log(`  Titles: ${matches.slice(0, 3).map(t => t.title || t.name).join(', ')}`);
      }
    });
  }
}

// Quick standalone test
export const runQuickTest = (selectedBucket: any, musicTracks: any[], allBuckets?: any[]) => {
  const musicDebugger = new TherapeuticMusicDebugger();
  musicDebugger.debugMusicConnection(selectedBucket, musicTracks, allBuckets);
};