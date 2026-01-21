import { useEffect, useState } from 'react';
import ParticleField from './ParticleField';
import MagneticButton from './MagneticButton';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden animated-gradient">
      {/* Particle background */}
      <ParticleField count={40} />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating glass layers */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className={`absolute top-20 left-10 w-72 h-72 glass rounded-3xl opacity-30 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-30' : '-translate-y-20 opacity-0'}`}
          style={{ 
            transform: 'rotate(-12deg) translateZ(50px)',
            animationDelay: '0.2s',
          }}
        />
        <div 
          className={`absolute top-40 right-20 w-48 h-48 glass rounded-2xl opacity-20 animate-float transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-20' : '-translate-y-20 opacity-0'}`}
          style={{ transform: 'rotate(15deg)' }}
        />
        <div 
          className={`absolute bottom-32 left-1/4 w-64 h-64 glass rounded-3xl opacity-25 animate-float-delayed transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-25' : 'translate-y-20 opacity-0'}`}
          style={{ transform: 'rotate(8deg)' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div 
          className={`inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">AI-Powered Analytics Platform</span>
        </div>

        {/* Main heading */}
        <h1 
          className={`text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="block text-foreground">Transform Data into</span>
          <span className="gradient-text">Insights, Automatically</span>
        </h1>

        {/* Subheading */}
        <p 
          className={`text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          Generate stunning reports and visualizations from your data in seconds. 
          Powered by advanced AI to uncover patterns you never knew existed.
        </p>

        {/* CTA buttons */}
        <div 
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <MagneticButton variant="primary" size="lg">
            <span className="flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </span>
          </MagneticButton>
          <MagneticButton variant="outline" size="lg">
            <span className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </span>
          </MagneticButton>
        </div>

        {/* Stats */}
        <div 
          className={`grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto transition-all duration-700 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {[
            { value: '10M+', label: 'Reports Generated' },
            { value: '500K+', label: 'Active Users' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
