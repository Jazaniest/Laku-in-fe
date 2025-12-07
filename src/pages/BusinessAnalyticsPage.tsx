import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBusinessAnalytics } from '@/hooks/useBusinessAnalytics';
import PageHeader from '@/components/dashboard/business-analysis/PageHeader';
import LoadingState from '@/components/dashboard/business-analysis/LoadingState';
import OverallScoreCard from '@/components/dashboard/business-analysis/OverallScoreCard';
import AIChatAssistant from '@/components/dashboard/business-analysis/AIChatAssistant';
import MetricCard from '@/components/dashboard/business-analysis/MetricCard';
import PerformanceScoreCard from '@/components/dashboard/business-analysis/PerformanceScoreCard';
import AIInsightCard from '@/components/dashboard/business-analysis/AIInsightCard';
import ProductPerformanceCard from '@/components/dashboard/business-analysis/ProductPerformanceCard';
import { formatCurrency } from '@/helper/formatCurrency';

const BusinessAnalyticsPage = () => {
    const { data, loading, error, refreshAnalytics } = useBusinessAnalytics();

    const handleBack = () => {
        window.location.href = '/dashboard';
    };

    return (
    <div className="min-h-screen bg-zinc-50">
        <PageHeader onBack={handleBack} />

        <main className="py-4 sm:py-6 md:p-6 px-4 sm:px-4 md:px-6 max-w-7xl mx-auto">
        {loading ? (
            <LoadingState />
        ) : error ? (
            <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-zinc-900 font-semibold mb-2">Terjadi Kesalahan</p>
                <p className="text-zinc-600 mb-4">{error}</p>
                <Button onClick={refreshAnalytics}>Coba Lagi</Button>
            </CardContent>
            </Card>
        ) : data ? (
            <div className="space-y-6">
            {/* Overall Score */}
            <OverallScoreCard score={data.overallScore} />

            {/* AI Chat Assistant */}
            <AIChatAssistant />

            {/* Key Metrics */}
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-3 sm:mb-4">Key Metrics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {data.metrics.map((metric) => (
                    <MetricCard key={metric.id} metric={metric} />
                ))}
                </div>
            </div>

            {/* Performance Scores & Product Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PerformanceScoreCard scores={data.performanceScores} />
                <ProductPerformanceCard products={data.productPerformance} />
            </div>

            {/* AI Insights */}
            <div>
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900 mb-3 sm:mb-4">AI-Powered Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {data.aiInsights.map((insight) => (
                    <AIInsightCard key={insight.id} insight={insight} />
                ))}
                </div>
            </div>

            {/* Predictions */}
            <Card>
                <CardHeader>
                <CardTitle>AI Predictions</CardTitle>
                <CardDescription>Prediksi berdasarkan data historis</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {data.predictions.map((pred) => (
                    <div key={pred.id} className="p-3 sm:p-4 border border-zinc-200 rounded-lg">
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <Badge className="bg-purple-100 text-purple-800 text-xs sm:text-sm">{pred.timeframe}</Badge>
                        <span className="text-xs text-zinc-600 font-medium hidden sm:inline">{pred.confidence}% confidence</span>
                        </div>
                        <p className="text-base sm:text-xl font-bold text-zinc-900 mb-1">
                        {pred.type === 'revenue' || pred.type === 'profit' 
                            ? formatCurrency(pred.prediction)
                            : `${pred.prediction}%`
                        }
                        </p>
                        <p className="text-xs text-zinc-600 mb-2 capitalize">{pred.type}</p>
                        <p className="text-xs text-zinc-700 leading-relaxed">{pred.reasoning}</p>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>
            </div>
        ) : null}
        </main>
    </div>
    );
};

export default BusinessAnalyticsPage;