import useScrollReveal from '@/hooks/useScrollReveal';
import MagneticButton from './MagneticButton';
import { cn } from '@/lib/utils';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  return (
    <footer ref={ref} className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 animated-gradient opacity-50" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* CTA Section */}
        <div className={cn(
          'text-center mb-16 transition-all duration-700',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your data?
          </h2>
          <p className="text-muted-foreground mb-8">Start generating insights in minutes, not hours.</p>
          <MagneticButton variant="primary" size="lg">Get Started Free</MagneticButton>
        </div>

        {/* Footer links */}
        <div className="glass p-8 rounded-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-2xl font-bold gradient-text">ReportAI</div>
            
            <div className="flex items-center gap-4">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-foreground"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="border-t border-border mt-6 pt-6 text-center text-sm text-muted-foreground">
            © 2026 ReportAI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
