import { useState, useEffect, useMemo } from 'react';
import GlassCard from './GlassCard';
import useScrollReveal from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';
import { FileUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ParsedData } from './FileUploadSection';

// Default mock data
const defaultLineData = [
  { name: 'Jan', value: 400, value2: 240 },
  { name: 'Feb', value: 300, value2: 456 },
  { name: 'Mar', value: 600, value2: 321 },
  { name: 'Apr', value: 800, value2: 567 },
  { name: 'May', value: 500, value2: 432 },
  { name: 'Jun', value: 900, value2: 678 },
  { name: 'Jul', value: 750, value2: 543 },
];

const defaultBarData = [
  { name: 'Mon', desktop: 186, mobile: 80 },
  { name: 'Tue', desktop: 305, mobile: 200 },
  { name: 'Wed', desktop: 237, mobile: 120 },
  { name: 'Thu', desktop: 273, mobile: 190 },
  { name: 'Fri', desktop: 209, mobile: 130 },
  { name: 'Sat', desktop: 314, mobile: 140 },
  { name: 'Sun', desktop: 187, mobile: 100 },
];

const defaultPieData = [
  { name: 'Marketing', value: 400 },
  { name: 'Sales', value: 300 },
  { name: 'Development', value: 300 },
  { name: 'Support', value: 200 },
];

const COLORS = ['hsl(168, 80%, 40%)', 'hsl(292, 84%, 72%)', 'hsl(200, 80%, 50%)', 'hsl(340, 80%, 60%)', 'hsl(45, 80%, 50%)', 'hsl(120, 60%, 45%)'];

interface VisualizationSectionProps {
  parsedData?: ParsedData | null;
}

const VisualizationSection = ({ parsedData }: VisualizationSectionProps) => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const [animationActive, setAnimationActive] = useState(false);

  const hasData = parsedData && parsedData.rows.length > 0;

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setAnimationActive(true), 200);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Transform parsed data for charts
  const { areaData, barData, pieData, metrics } = useMemo(() => {
    if (!hasData) {
      return {
        areaData: defaultLineData,
        barData: defaultBarData,
        pieData: defaultPieData,
        metrics: null
      };
    }

    const { headers, rows, numericColumns, columnStats } = parsedData;
    const numericKeys = Object.keys(numericColumns);
    
    // Find a label column (first non-numeric column)
    const labelColIndex = headers.findIndex((h, i) => {
      const values = rows.map(row => parseFloat(row[i]));
      return values.some(v => isNaN(v));
    });
    const labelKey = labelColIndex >= 0 ? headers[labelColIndex] : 'Row';

    // Area/Line chart data - use first 2 numeric columns
    const areaChartData = rows.slice(0, 12).map((row, i) => {
      const item: Record<string, string | number> = {
        name: labelColIndex >= 0 ? row[labelColIndex] : `Row ${i + 1}`
      };
      numericKeys.slice(0, 2).forEach((key, idx) => {
        const colIndex = headers.indexOf(key);
        const val = parseFloat(row[colIndex]);
        item[idx === 0 ? 'value' : 'value2'] = isNaN(val) ? 0 : val;
      });
      return item;
    });

    // Bar chart data - use first 2 numeric columns
    const barChartData = rows.slice(0, 7).map((row, i) => {
      const item: Record<string, string | number> = {
        name: labelColIndex >= 0 ? (row[labelColIndex]?.slice(0, 10) || `R${i + 1}`) : `R${i + 1}`
      };
      numericKeys.slice(0, 2).forEach((key, idx) => {
        const colIndex = headers.indexOf(key);
        const val = parseFloat(row[colIndex]);
        item[idx === 0 ? 'desktop' : 'mobile'] = isNaN(val) ? 0 : val;
      });
      return item;
    });

    // Pie chart data - aggregate first numeric column by category, or use column sums
    let pieChartData: { name: string; value: number }[];
    if (numericKeys.length > 0) {
      // Use column sums for pie chart
      pieChartData = numericKeys.slice(0, 6).map(key => ({
        name: key.length > 15 ? key.slice(0, 12) + '...' : key,
        value: Math.round(columnStats[key]?.sum || 0)
      }));
    } else {
      pieChartData = defaultPieData;
    }

    // Calculate metrics from first numeric column
    const firstNumericKey = numericKeys[0];
    const stats = firstNumericKey ? columnStats[firstNumericKey] : null;
    const calculatedMetrics = stats ? {
      total: { label: 'Total Sum', value: stats.sum.toLocaleString(), change: `${rows.length} rows` },
      average: { label: 'Average', value: stats.avg.toFixed(2), change: `${firstNumericKey}` },
      min: { label: 'Minimum', value: stats.min.toLocaleString(), change: 'lowest value' },
      max: { label: 'Maximum', value: stats.max.toLocaleString(), change: 'highest value' }
    } : null;

    return {
      areaData: areaChartData.length > 0 ? areaChartData : defaultLineData,
      barData: barChartData.length > 0 ? barChartData : defaultBarData,
      pieData: pieChartData.length > 0 ? pieChartData : defaultPieData,
      metrics: calculatedMetrics
    };
  }, [parsedData, hasData]);

  return (
    <section className="relative py-32 overflow-hidden" id="visualizations">
      {/* Background glow */}
      <div 
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
        style={{ background: 'radial-gradient(circle, hsl(var(--accent)), transparent)' }}
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
          <span className="inline-block text-accent text-sm font-medium tracking-wider uppercase mb-4">
            Visualization Showcase
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Charts that
            <span className="gradient-text block mt-2">tell your story</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {hasData 
              ? `Visualizing data from your uploaded file with ${parsedData.rows.length} rows and ${parsedData.headers.length} columns`
              : 'Upload a CSV file above to see your data visualized here. Beautiful, interactive charts that make complex data easy to understand.'
            }
          </p>
          {hasData && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
              <FileUp className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary">Showing your uploaded data</span>
            </div>
          )}
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Area Chart */}
          <ChartCard 
            title={hasData ? "Data Trends" : "Revenue Trends"}
            subtitle={hasData ? "Values from your CSV" : "Monthly performance comparison"}
            delay={0}
          >
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(168, 80%, 40%)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(168, 80%, 40%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorValue2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(292, 84%, 72%)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(292, 84%, 72%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 20%)" />
                <XAxis dataKey="name" stroke="hsl(240, 5%, 65%)" fontSize={12} />
                <YAxis stroke="hsl(240, 5%, 65%)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(240, 10%, 10%)', 
                    border: '1px solid hsl(240, 10%, 20%)',
                    borderRadius: '8px',
                  }} 
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(168, 80%, 40%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  isAnimationActive={animationActive}
                  animationDuration={2000}
                />
                <Area
                  type="monotone"
                  dataKey="value2"
                  stroke="hsl(292, 84%, 72%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue2)"
                  isAnimationActive={animationActive}
                  animationDuration={2000}
                  animationBegin={300}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Bar Chart */}
          <ChartCard 
            title={hasData ? "Value Comparison" : "Weekly Traffic"}
            subtitle={hasData ? "Side-by-side column values" : "Desktop vs Mobile visits"}
            delay={100}
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 20%)" />
                <XAxis dataKey="name" stroke="hsl(240, 5%, 65%)" fontSize={12} />
                <YAxis stroke="hsl(240, 5%, 65%)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(240, 10%, 10%)', 
                    border: '1px solid hsl(240, 10%, 20%)',
                    borderRadius: '8px',
                  }} 
                />
                <Bar 
                  dataKey="desktop" 
                  fill="hsl(168, 80%, 40%)" 
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={animationActive}
                  animationDuration={1500}
                />
                <Bar 
                  dataKey="mobile" 
                  fill="hsl(292, 84%, 72%)" 
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={animationActive}
                  animationDuration={1500}
                  animationBegin={200}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Pie Chart */}
          <ChartCard 
            title={hasData ? "Column Distribution" : "Budget Allocation"}
            subtitle={hasData ? "Sum by column" : "Department spending breakdown"}
            delay={200}
          >
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  isAnimationActive={animationActive}
                  animationDuration={1500}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(240, 10%, 10%)', 
                    border: '1px solid hsl(240, 10%, 20%)',
                    borderRadius: '8px',
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          {/* Metrics Card */}
          <ChartCard 
            title={hasData ? "Data Statistics" : "Live Metrics"}
            subtitle={hasData ? "Calculated from your data" : "Real-time data updates"}
            delay={300}
          >
            <div className="grid grid-cols-2 gap-4">
              {metrics ? (
                <>
                  <MetricCard label={metrics.total.label} value={metrics.total.value} change={metrics.total.change} positive />
                  <MetricCard label={metrics.average.label} value={metrics.average.value} change={metrics.average.change} positive />
                  <MetricCard label={metrics.min.label} value={metrics.min.value} change={metrics.min.change} positive />
                  <MetricCard label={metrics.max.label} value={metrics.max.value} change={metrics.max.change} positive />
                </>
              ) : (
                <>
                  <MetricCard label="Active Users" value="2,847" change="+12.5%" positive />
                  <MetricCard label="Conversion Rate" value="3.24%" change="+0.8%" positive />
                  <MetricCard label="Avg. Session" value="4m 32s" change="-0.3%" positive={false} />
                  <MetricCard label="Bounce Rate" value="42.1%" change="-2.1%" positive />
                </>
              )}
            </div>
          </ChartCard>
        </div>
      </div>
    </section>
  );
};

interface ChartCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  delay: number;
}

const ChartCard = ({ title, subtitle, children, delay }: ChartCardProps) => {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <GlassCard className="p-6 chart-glow">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </GlassCard>
    </div>
  );
};

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

const MetricCard = ({ label, value, change, positive }: MetricCardProps) => (
  <div className="glass p-4 rounded-xl">
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className={cn('text-sm mt-1', positive ? 'text-primary' : 'text-destructive')}>
      {change}
    </p>
  </div>
);

export default VisualizationSection;
