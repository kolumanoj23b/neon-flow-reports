import { useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

interface ParticleFieldProps {
  count?: number;
  className?: string;
}

const ParticleField = ({ count = 50, className = '' }: ParticleFieldProps) => {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 20,
      size: 2 + Math.random() * 4,
      opacity: 0.1 + Math.random() * 0.4,
    }));
  }, [count]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            bottom: '-10px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, hsl(var(--primary) / ${particle.opacity}), transparent)`,
            animation: `particle ${particle.duration}s linear ${particle.delay}s infinite`,
          }}
        />
      ))}
      {/* Glowing orbs */}
      <div 
        className="absolute w-64 h-64 rounded-full blur-3xl animate-float opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary)), transparent)',
          top: '20%',
          left: '10%',
        }}
      />
      <div 
        className="absolute w-96 h-96 rounded-full blur-3xl animate-float-delayed opacity-15"
        style={{
          background: 'radial-gradient(circle, hsl(var(--accent)), transparent)',
          top: '40%',
          right: '5%',
          animationDelay: '2s',
        }}
      />
      <div 
        className="absolute w-48 h-48 rounded-full blur-3xl animate-float opacity-10"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary)), transparent)',
          bottom: '20%',
          left: '30%',
          animationDelay: '4s',
        }}
      />
    </div>
  );
};

export default ParticleField;
