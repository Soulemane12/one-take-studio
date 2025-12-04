import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mic, 
  Zap, 
  Calendar, 
  Copy, 
  BarChart3, 
  Sparkles 
} from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "One Raw Recording",
    description: "Just hit record and rant for 20-30 minutes. No scripts, no editing, no polish required."
  },
  {
    icon: Sparkles,
    title: "AI Theme Detection",
    description: "Our AI finds the hooks, spicy takes, and quotable moments hidden in your stream of consciousness."
  },
  {
    icon: Zap,
    title: "Instant Content Explosion",
    description: "In seconds, generate TikToks, Twitter threads, LinkedIn posts, and newsletter outlines."
  },
  {
    icon: Calendar,
    title: "Ready-to-Schedule Calendar",
    description: "Content is organized into a 5-day posting calendar. Just plug it into your scheduler."
  },
  {
    icon: Copy,
    title: "One-Click Copy",
    description: "Every piece of content is copy-ready with hashtags, hooks, and shot instructions included."
  },
  {
    icon: BarChart3,
    title: "Reach Estimation",
    description: "See estimated reach potential for your content batch before you post."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 px-4 bg-card/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            From Chaos to Content Calendar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop spending hours repurposing content. One rant, one click, one week of posts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
