import GlassCard from './GlassCard';
import useScrollReveal from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';
import { Database, Cpu, LineChart, BarChart3, FileText, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Database,
    title: 'Connect Data',
    description: 'Link your databases, APIs, or upload files directly',
    color: 'primary',
  },
  {
    icon: Cpu,
    title: 'Process',
    description: 'AI cleans, validates, and transforms your data',
    color: 'accent',
  },
  {
    icon: LineChart,
    title: 'Analyze',
    description: 'Discover patterns, trends, and anomalies',
    color: 'primary',
  },
  {
    icon: BarChart3,
    title: 'Visualize',
    description: 'Create stunning charts and dashboards',
    color: 'accent',
  },
  {
    icon: FileText,
    title: 'Report',
    description: 'Generate comprehensive, shareable reports',
    color: 'primary',
  },
];

const WorkflowSection = () => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="relative py-32 overflow-hidden" id="workflow">
      {/* Background */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-5 blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary)), hsl(var(--accent)), transparent)' }}
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
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            From raw data to
            <span className="gradient-text block mt-2">actionable insights</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our streamlined workflow takes you from scattered data to polished reports in five simple steps.
          </p>
        </div>

        {/* Workflow steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <WorkflowStep key={step.title} step={step} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface WorkflowStepProps {
  step: typeof steps[0];
  index: number;
}

const WorkflowStep = ({ step, index }: WorkflowStepProps) => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const Icon = step.icon;
  const isAccent = step.color === 'accent';

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex flex-col items-center text-center transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Step number */}
      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-sm font-bold text-muted-foreground z-10">
        {index + 1}
      </div>

      {/* Icon container */}
      <GlassCard className="p-6 mb-6 group cursor-default">
        <div 
          className={cn(
            'p-4 rounded-2xl transition-all duration-300 group-hover:scale-110',
            isAccent 
              ? 'bg-gradient-to-br from-accent to-accent/50' 
              : 'bg-gradient-to-br from-primary to-primary/50'
          )}
        >
          <Icon className="w-8 h-8 text-primary-foreground" />
        </div>
      </GlassCard>

      {/* Content */}
      <h3 className="text-xl font-bold mb-2 text-foreground">{step.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

      {/* Arrow (hidden on last item and mobile) */}
      {index < steps.length - 1 && (
        <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
          <ArrowRight 
            className={cn(
              'w-6 h-6 transition-all duration-500',
              isVisible ? 'opacity-50 translate-x-0' : 'opacity-0 -translate-x-4',
              isAccent ? 'text-accent' : 'text-primary'
            )}
            style={{ transitionDelay: `${(index + 1) * 150 + 200}ms` }}
          />
        </div>
      )}
    </div>
  );
};

export default WorkflowSection;
