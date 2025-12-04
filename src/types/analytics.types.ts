export interface AnalyticsMetric {
  id: string;
  title: string;
  value: number | string;
  change: number;
  changeType: 'increase' | 'decrease';
  insight: string;
  recommendation: string;
}

export interface PerformanceScore {
  category: string;
  score: number; // 0-100
  previousScore: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
  description: string;
}

export interface TrendData {
  period: string;
  revenue: number;
  expense: number;
  profit: number;
  growth: number;
}

export interface CustomerInsight {
  id: string;
  metric: string;
  value: string;
  insight: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ProductPerformance {
  id: string;
  category: string;
  revenue: number;
  unitsSold: number;
  growthRate: number;
  margin: number;
  status: 'trending' | 'stable' | 'declining';
}

export interface AIPrediction {
  id: string;
  type: 'revenue' | 'expense' | 'profit' | 'growth';
  prediction: number;
  confidence: number; // 0-100
  timeframe: string;
  reasoning: string;
}

export interface AIInsight {
  id: string;
  title: string;
  category: 'opportunity' | 'risk' | 'recommendation' | 'alert';
  severity: 'high' | 'medium' | 'low';
  description: string;
  impact: string;
  actionItems: string[];
  generatedAt: Date;
}

export interface ComparisonData {
  metric: string;
  currentPeriod: number;
  previousPeriod: number;
  industryAverage?: number;
  change: number;
  status: 'outperforming' | 'matching' | 'underperforming';
}

export interface BusinessAnalytics {
  period: {
    startDate: Date;
    endDate: Date;
    label: string;
  };
  overallScore: number;
  metrics: AnalyticsMetric[];
  performanceScores: PerformanceScore[];
  trends: TrendData[];
  customerInsights: CustomerInsight[];
  productPerformance: ProductPerformance[];
  predictions: AIPrediction[];
  aiInsights: AIInsight[];
  comparisons: ComparisonData[];
}

export interface AnalyticsFilters {
  period?: 'week' | 'month' | 'quarter' | 'year';
  category?: string;
  compareWith?: 'previous' | 'industry';
}