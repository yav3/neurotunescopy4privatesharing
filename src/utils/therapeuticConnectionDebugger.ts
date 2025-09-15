// Debugging utility for therapeutic goal cards and buckets connection
export class TherapeuticConnectionDebugger {
  private goalCards: any[];
  private buckets: any[];
  private logLevel: 'basic' | 'detailed';

  constructor(goalCards: any[], buckets: any[], logLevel: 'basic' | 'detailed' = 'detailed') {
    this.goalCards = goalCards || [];
    this.buckets = buckets || [];
    this.logLevel = logLevel;
  }

  // Main debugging function
  debugConnections() {
    console.log('=== THERAPEUTIC GOAL CARDS & BUCKETS CONNECTION DEBUG ===\n');
    
    this.logDataOverview();
    this.checkDataIntegrity();
    this.analyzeConnections();
    this.identifyOrphanedItems();
    this.suggestFixes();
  }

  // Log basic data overview
  private logDataOverview() {
    console.log('📊 DATA OVERVIEW:');
    console.log(`Goal Cards: ${this.goalCards.length} items`);
    console.log(`Buckets: ${this.buckets.length} items`);
    console.log('');

    if (this.logLevel === 'detailed') {
      console.log('Goal Cards structure sample:');
      console.log(this.goalCards.slice(0, 2));
      console.log('\nBuckets structure sample:');
      console.log(this.buckets.slice(0, 2));
      console.log('');
    }
  }

  // Check data integrity
  private checkDataIntegrity() {
    console.log('🔍 DATA INTEGRITY CHECKS:');
    
    const issues: string[] = [];

    // Check for required IDs
    const cardsWithoutIds = this.goalCards.filter(card => !card.id);
    const bucketsWithoutIds = this.buckets.filter(bucket => !bucket.id);
    
    if (cardsWithoutIds.length) {
      issues.push(`${cardsWithoutIds.length} goal cards missing ID`);
    }
    if (bucketsWithoutIds.length) {
      issues.push(`${bucketsWithoutIds.length} buckets missing ID`);
    }

    // Check for connection fields (common field names)
    const connectionFields = ['bucketId', 'bucket_id', 'categoryId', 'category_id', 'groupId', 'group_id', 'buckets'];
    const cardConnectionFields = this.findConnectionFields(this.goalCards, connectionFields);
    const bucketConnectionFields = this.findConnectionFields(this.buckets, connectionFields);

    console.log(`Goal cards connection fields found: ${cardConnectionFields.join(', ') || 'NONE'}`);
    console.log(`Buckets connection fields found: ${bucketConnectionFields.join(', ') || 'NONE'}`);

    if (issues.length) {
      console.log(`❌ Issues found: ${issues.join(', ')}`);
    } else {
      console.log('✅ Basic data integrity looks good');
    }
    console.log('');
  }

  // Find potential connection fields
  private findConnectionFields(items: any[], possibleFields: string[]): string[] {
    if (!items.length) return [];
    const sampleItem = items[0];
    return possibleFields.filter(field => sampleItem.hasOwnProperty(field));
  }

  // Analyze current connections
  private analyzeConnections() {
    console.log('🔗 CONNECTION ANALYSIS:');
    
    // Try to detect connection method
    const connectionMethod = this.detectConnectionMethod();
    console.log(`Detected connection method: ${connectionMethod}`);

    switch (connectionMethod) {
      case 'bucketId':
        this.analyzeBucketIdConnections();
        break;
      case 'embedded':
        this.analyzeEmbeddedConnections();
        break;
      case 'array':
        this.analyzeArrayConnections();
        break;
      default:
        console.log('❌ No clear connection method detected');
        this.suggestConnectionMethods();
    }
    console.log('');
  }

  // Detect how connections should work
  private detectConnectionMethod(): string {
    if (!this.goalCards.length) return 'unknown';
    
    const sampleCard = this.goalCards[0];
    
    if (sampleCard.bucketId || sampleCard.bucket_id) return 'bucketId';
    if (sampleCard.bucket && typeof sampleCard.bucket === 'object') return 'embedded';
    if (sampleCard.buckets && Array.isArray(sampleCard.buckets)) return 'array';
    
    return 'unknown';
  }

  // Analyze bucketId-based connections
  private analyzeBucketIdConnections() {
    const bucketIdField = this.goalCards[0]?.bucketId ? 'bucketId' : 'bucket_id';
    const bucketIds = new Set(this.buckets.map(b => b.id));
    
    let connectedCards = 0;
    const disconnectedCards: any[] = [];
    
    this.goalCards.forEach(card => {
      const cardBucketId = card[bucketIdField];
      if (cardBucketId && bucketIds.has(cardBucketId)) {
        connectedCards++;
      } else {
        disconnectedCards.push({
          cardId: card.id,
          bucketId: cardBucketId,
          issue: cardBucketId ? 'bucket not found' : 'no bucket ID'
        });
      }
    });

    console.log(`✅ Connected cards: ${connectedCards}`);
    console.log(`❌ Disconnected cards: ${disconnectedCards.length}`);
    
    if (disconnectedCards.length && this.logLevel === 'detailed') {
      console.log('Disconnected cards details:');
      disconnectedCards.slice(0, 5).forEach(card => {
        console.log(`  Card ${card.cardId}: ${card.issue} (bucketId: ${card.bucketId})`);
      });
    }
  }

  // Analyze embedded connections
  private analyzeEmbeddedConnections() {
    let connectedCards = 0;
    const issues: string[] = [];

    this.goalCards.forEach(card => {
      if (card.bucket && card.bucket.id) {
        const bucketExists = this.buckets.some(b => b.id === card.bucket.id);
        if (bucketExists) {
          connectedCards++;
        } else {
          issues.push(`Card ${card.id}: embedded bucket ${card.bucket.id} not found in buckets array`);
        }
      } else {
        issues.push(`Card ${card.id}: no embedded bucket or missing bucket.id`);
      }
    });

    console.log(`✅ Connected cards: ${connectedCards}`);
    console.log(`❌ Issues: ${issues.length}`);
    
    if (issues.length && this.logLevel === 'detailed') {
      issues.slice(0, 5).forEach(issue => console.log(`  ${issue}`));
    }
  }

  // Analyze array-based connections
  private analyzeArrayConnections() {
    const bucketIds = new Set(this.buckets.map(b => b.id));
    let totalConnections = 0;
    let invalidConnections = 0;

    this.goalCards.forEach(card => {
      if (card.buckets && Array.isArray(card.buckets)) {
        card.buckets.forEach((bucketId: string) => {
          totalConnections++;
          if (!bucketIds.has(bucketId)) {
            invalidConnections++;
          }
        });
      }
    });

    console.log(`Total connections: ${totalConnections}`);
    console.log(`✅ Valid connections: ${totalConnections - invalidConnections}`);
    console.log(`❌ Invalid connections: ${invalidConnections}`);
  }

  // Find orphaned items
  private identifyOrphanedItems() {
    console.log('🏝️  ORPHANED ITEMS:');
    
    // Find buckets with no cards
    const usedBucketIds = new Set<string>();
    this.goalCards.forEach(card => {
      const bucketId = card.bucketId || card.bucket_id || (card.bucket && card.bucket.id);
      if (bucketId) usedBucketIds.add(bucketId);
      
      // Also check buckets array
      if (card.buckets && Array.isArray(card.buckets)) {
        card.buckets.forEach((id: string) => usedBucketIds.add(id));
      }
    });

    const orphanedBuckets = this.buckets.filter(bucket => !usedBucketIds.has(bucket.id));
    console.log(`Buckets with no cards: ${orphanedBuckets.length}`);
    
    if (orphanedBuckets.length && this.logLevel === 'detailed') {
      orphanedBuckets.slice(0, 3).forEach(bucket => {
        console.log(`  Bucket: ${bucket.id} (${bucket.name || bucket.title || 'unnamed'})`);
      });
    }
    console.log('');
  }

  // Suggest fixes
  private suggestFixes() {
    console.log('🔧 SUGGESTED FIXES:');
    
    const suggestions: string[] = [];
    
    if (this.goalCards.length && this.buckets.length) {
      suggestions.push('1. Verify connection field names match between cards and buckets');
      suggestions.push('2. Check if IDs are strings vs numbers (type mismatch)');
      suggestions.push('3. Ensure data is loaded before establishing connections');
      suggestions.push('4. Add null/undefined checks in connection logic');
      suggestions.push('5. Implement connection validation in your data layer');
    }

    if (!this.goalCards.length) {
      suggestions.push('1. Check if goal cards are being loaded properly');
    }
    
    if (!this.buckets.length) {
      suggestions.push('1. Check if buckets are being loaded properly');
    }

    suggestions.forEach(suggestion => console.log(suggestion));
    console.log('');
    console.log('=== END DEBUG REPORT ===\n');
  }

  // Helper method to test a specific connection
  testConnection(cardId: string, bucketId: string): boolean {
    console.log(`🧪 TESTING CONNECTION: Card ${cardId} → Bucket ${bucketId}`);
    
    const card = this.goalCards.find(c => c.id === cardId);
    const bucket = this.buckets.find(b => b.id === bucketId);
    
    if (!card) {
      console.log(`❌ Card ${cardId} not found`);
      return false;
    }
    
    if (!bucket) {
      console.log(`❌ Bucket ${bucketId} not found`);
      return false;
    }
    
    console.log(`✅ Both items exist`);
    console.log(`Card data:`, card);
    console.log(`Bucket data:`, bucket);
    
    return true;
  }

  private suggestConnectionMethods() {
    console.log('🔄 SUGGESTED CONNECTION METHODS:');
    console.log('1. Use bucketId field in goal cards to reference bucket.id');
    console.log('2. Use buckets array in goal cards with bucket ID strings');
    console.log('3. Embed bucket object directly in goal cards');
    console.log('4. Use category/group ID system');
  }
}

// Helper to create debugger with current app data
export function createTherapeuticDebugger(goalCards: any[], buckets: any[]) {
  return new TherapeuticConnectionDebugger(goalCards, buckets);
}