import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { SmartTitleParser } from '@/utils/smartTitleParser';
import { cn } from '@/lib/utils';

interface SmartTitleProps {
  title: string;
  context?: 'card' | 'player' | 'list';
  showMetadata?: boolean;
  maxLength?: number;
  className?: string;
}

export const SmartTitle: React.FC<SmartTitleProps> = ({ 
  title, 
  context = 'card', 
  showMetadata = false, 
  maxLength = 50, 
  className = '' 
}) => {
  const displayTitle = SmartTitleParser.getDisplayTitle(title, { context, maxLength });
  const metadata = SmartTitleParser.getTitleMetadata(title);

  return (
    <div className={cn(className)}>
      <h3 className="font-semibold text-foreground leading-tight" title={title}>
        {displayTitle}
      </h3>
      
      {showMetadata && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {metadata.purpose && (
            <Badge variant="secondary" className="text-xs">
              {metadata.purpose}
            </Badge>
          )}
          {metadata.genre && (
            <Badge variant="outline" className="text-xs">
              {metadata.genre}
            </Badge>
          )}
          {metadata.duration && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {metadata.duration}
            </span>
          )}
          {metadata.movement && (
            <span className="text-xs text-muted-foreground">
              {metadata.movement}
            </span>
          )}
        </div>
      )}
    </div>
  );
};