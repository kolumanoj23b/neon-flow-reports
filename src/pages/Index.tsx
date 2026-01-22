import { useState, useCallback } from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import FileUploadSection, { ParsedData } from '@/components/FileUploadSection';
import VisualizationSection from '@/components/VisualizationSection';
import WorkflowSection from '@/components/WorkflowSection';
import DashboardPreview from '@/components/DashboardPreview';
import Footer from '@/components/Footer';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);

  const handleDataParsed = useCallback((data: ParsedData | null) => {
    setParsedData(data);
  }, []);

  return (
    <div className="min-h-screen bg-background noise">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      <HeroSection />
      <FeaturesSection />
      <FileUploadSection onDataParsed={handleDataParsed} />
      <VisualizationSection parsedData={parsedData} />
      <WorkflowSection />
      <DashboardPreview />
      <Footer />
    </div>
  );
};

export default Index;
