import GlassCard from './GlassCard';
import useScrollReveal from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';
import { TrendingUp, Users, FileText, Activity } from 'lucide-react';

const DashboardPreview = () => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="relative py-32 overflow-hidden" id="dashboard">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div 
          ref={ref}
          className={cn(
            'text-center mb-16 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <span className="inline-block text-accent text-sm font-medium tracking-wider uppercase mb-4">
            Dashboard Preview
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your command center for
            <span className="gradient-text block mt-2">data-driven decisions</span>
          </h2>
        </div>

        {/* Dashboard mockup */}
        <div className={cn(
          'perspective-1000 transition-all duration-1000',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        )}>
          <GlassCard className="p-8 preserve-3d" style={{ transform: 'rotateX(5deg)' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { icon: FileText, label: 'Total Reports', value: '1,284', color: 'primary' },
                { icon: Activity, label: 'Data Processed', value: '847 GB', color: 'accent' },
                { icon: Users, label: 'Active Users', value: '12,549', color: 'primary' },
                { icon: TrendingUp, label: 'Growth Rate', value: '+24.5%', color: 'accent' },
              ].map((stat, i) => (
                <div key={stat.label} className="glass p-4 rounded-xl hover-lift" style={{ transitionDelay: `${i * 100}ms` }}>
                  <stat.icon className={cn('w-5 h-5 mb-2', stat.color === 'accent' ? 'text-accent' : 'text-primary')} />
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass p-4 rounded-xl col-span-2 h-32 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg animate-pulse" />
              </div>
              <div className="glass p-4 rounded-xl h-32 flex items-center justify-center">
                <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg animate-pulse" />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
