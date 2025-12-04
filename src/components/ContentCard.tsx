import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Clock, Hash } from "lucide-react";
import { ContentPiece } from "@/data/mockContent";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  content: ContentPiece;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const platformConfig = {
  tiktok: {
    label: "TikTok",
    bgClass: "bg-[hsl(349,100%,60%)]/10",
    textClass: "text-[hsl(349,100%,60%)]",
    borderClass: "border-[hsl(349,100%,60%)]/30",
    icon: "📱"
  },
  twitter: {
    label: "Twitter/X",
    bgClass: "bg-[hsl(203,89%,53%)]/10",
    textClass: "text-[hsl(203,89%,53%)]",
    borderClass: "border-[hsl(203,89%,53%)]/30",
    icon: "🐦"
  },
  linkedin: {
    label: "LinkedIn",
    bgClass: "bg-[hsl(201,100%,35%)]/10",
    textClass: "text-[hsl(201,100%,35%)]",
    borderClass: "border-[hsl(201,100%,35%)]/30",
    icon: "💼"
  },
  newsletter: {
    label: "Newsletter",
    bgClass: "bg-[hsl(142,71%,45%)]/10",
    textClass: "text-[hsl(142,71%,45%)]",
    borderClass: "border-[hsl(142,71%,45%)]/30",
    icon: "📧"
  }
};

const ContentCard = ({ content, isExpanded, onToggle }: ContentCardProps) => {
  const [copied, setCopied] = useState(false);
  const config = platformConfig[content.type];

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(content.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg border",
        config.borderClass,
        isExpanded && "ring-2 ring-primary"
      )}
      onClick={onToggle}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <Badge variant="secondary" className={cn("mb-2", config.bgClass, config.textClass)}>
                {config.label}
              </Badge>
              <h3 className="font-semibold text-foreground line-clamp-1">{content.title}</h3>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="w-4 h-4 text-[hsl(142,71%,45%)]" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {content.hook && (
          <p className="text-sm font-medium text-primary mb-3 italic">
            "{content.hook}"
          </p>
        )}
        
        <div className={cn(
          "text-sm text-muted-foreground whitespace-pre-wrap transition-all duration-300",
          !isExpanded && "line-clamp-3"
        )}>
          {content.content}
        </div>
        
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Day {content.day} • {content.time}</span>
          </div>
          
          {content.tags && content.tags.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Hash className="w-3 h-3" />
              <span>{content.tags.slice(0, 2).join(", ")}</span>
            </div>
          )}
        </div>
        
        {!isExpanded && (
          <p className="text-xs text-primary mt-2">Click to expand →</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentCard;
