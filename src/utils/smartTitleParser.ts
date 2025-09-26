// Smart title parsing for therapeutic music tracks
export interface TitleMetadata {
  purpose?: string;
  movement?: string;
  duration?: string;
  genre?: string;
  clinical?: string;
  session?: string;
}

export interface ParsedTitle {
  mainTitle: string;
  metadata: TitleMetadata;
  cleanTitle: string;
}

export class SmartTitleParser {
  private static patterns = {
    purpose: /\b(Focus|Relaxation|Sleep|Stress Relief|Meditation|Anxiety|Depression|ADHD)\b/gi,
    movement: /\b(Movement \d+|Allegro|Adagio|Andante|Presto|Largo)\b/gi,
    duration: /\b\d+\s?(min|minutes?|hr|hours?|sec|seconds?)\b/gi,
    genre: /\b(Classical|Ambient|Nature|Binaural|Pink Noise|White Noise)\b/gi,
    clinical: /\b(Therapeutic|Clinical|Medical|Treatment|Therapy)\b/gi,
    session: /\b(Session \d+|Track \d+|Part \d+)\b/gi
  };

  static parseTitle(rawTitle: string): ParsedTitle {
    let cleanTitle = rawTitle;
    const metadata: TitleMetadata = {};

    // Extract metadata
    const purposeMatch = rawTitle.match(this.patterns.purpose);
    if (purposeMatch) metadata.purpose = purposeMatch[0];

    const movementMatch = rawTitle.match(this.patterns.movement);
    if (movementMatch) metadata.movement = movementMatch[0];

    const durationMatch = rawTitle.match(this.patterns.duration);
    if (durationMatch) metadata.duration = durationMatch[0];

    const genreMatch = rawTitle.match(this.patterns.genre);
    if (genreMatch) metadata.genre = genreMatch[0];

    const clinicalMatch = rawTitle.match(this.patterns.clinical);
    if (clinicalMatch) metadata.clinical = clinicalMatch[0];

    const sessionMatch = rawTitle.match(this.patterns.session);
    if (sessionMatch) metadata.session = sessionMatch[0];

    // Clean the title by removing metadata patterns
    Object.values(this.patterns).forEach(pattern => {
      cleanTitle = cleanTitle.replace(pattern, '');
    });

    // Clean up punctuation and spacing
    cleanTitle = cleanTitle
      .replace(/\s*[-–—]\s*/g, ' - ')
      .replace(/\s*[:|;]\s*/g, ': ')
      .replace(/\s+/g, ' ')
      .replace(/^\s*[-–—:;]\s*/g, '')
      .replace(/\s*[-–—:;]\s*$/g, '')
      .trim();

    // Fallback if title becomes too short
    if (cleanTitle.length < 5) {
      cleanTitle = rawTitle.substring(0, 40).trim();
    }

    return { 
      mainTitle: rawTitle, 
      metadata, 
      cleanTitle 
    };
  }

  static getDisplayTitle(rawTitle: string, options: { maxLength?: number; context?: string } = {}): string {
    const { maxLength = 50 } = options;
    const parsed = this.parseTitle(rawTitle);
    
    let displayTitle = parsed.cleanTitle;

    if (displayTitle.length > maxLength) {
      const truncated = displayTitle.substring(0, maxLength - 3).trim();
      const lastSpace = truncated.lastIndexOf(' ');
      displayTitle = (lastSpace > maxLength * 0.7 ? truncated.substring(0, lastSpace) : truncated) + '...';
    }

    return displayTitle;
  }

  static getTitleMetadata(rawTitle: string): TitleMetadata {
    const parsed = this.parseTitle(rawTitle);
    return parsed.metadata;
  }
}