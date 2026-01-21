import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import VisualizationSection from '@/components/VisualizationSection';
import WorkflowSection from '@/components/WorkflowSection';
import DashboardPreview from '@/components/DashboardPreview';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background noise">
      <HeroSection />
      <FeaturesSection />
      <VisualizationSection />
      <WorkflowSection />
      <DashboardPreview />
      <Footer />
    </div>
  );
};

export default Index;
