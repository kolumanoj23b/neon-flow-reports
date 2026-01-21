import GlassCard from './GlassCard';
import useScrollReveal from '@/hooks/useScrollReveal';
import { Database, FileText, BarChart3, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Database,
    title: 'Automated Data Processing',
    description: 'Connect any data source - databases, APIs, spreadsheets. Our AI cleans, transforms, and structures your data automatically.',
    gradient: 'from-primary to-primary/50',
  },
  {
    icon: FileText,
    title: 'Smart Report Generation',
    description: 'Generate comprehensive reports with AI-powered insights. Every chart, table, and summary tailored to your needs.',
    gradient: 'from-accent to-accent/50',
  },
  {
    icon: BarChart3,
    title: 'Real-time Visual Analytics',
    description: 'Watch your data come alive with interactive dashboards. Live updates, drill-downs, and custom visualizations.',
    gradient: 'from-primary via-accent to-primary',
  },
  {
    icon: Download,
    title: 'Export & Customization',
    description: 'Export to PDF, Excel, or embed live dashboards. Customize colors, branding, and layouts to match your style.',
    gradient: 'from-accent via-primary to-accent',
  },
];

const FeaturesSection = () => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="relative py-32 overflow-hidden" id="features">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div 
          ref={ref}
          className={cn(
            'text-center mb-20 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <span className="inline-block text-primary text-sm font-medium tracking-wider uppercase mb-4">
            Powerful Features
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Everything you need to
            <span className="gradient-text block mt-2">master your data</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From raw data to actionable insights in minutes. Our platform handles the heavy lifting so you can focus on decisions.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-1000">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  feature: typeof features[0];
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const Icon = feature.icon;

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <GlassCard className="p-8 h-full group">
        {/* Icon */}
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-8 h-8 text-primary-foreground" />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:gradient-text transition-all duration-300">
          {feature.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {feature.description}
        </p>

        {/* Bottom glow line */}
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </GlassCard>
    </div>
  );
};

export default FeaturesSection;
