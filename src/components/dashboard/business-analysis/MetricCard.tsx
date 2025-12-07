import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Lightbulb, Target } from 'lucide-react';
import type { AnalyticsMetric } from '@/types/analytics.types';

const MetricCard = ({ metric }: { metric: AnalyticsMetric }) => {
  const Icon = metric.changeType === 'increase' ? TrendingUp : TrendingDown;
  const colorClass = metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600';

  return (
    <Card className="p-3 sm:p-4">
      <CardContent className="p-0 space-y-3">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <div>
            <p className="text-xs sm:text-sm text-zinc-600 mb-1">{metric.title}</p>
            <p className="text-lg sm:text-2xl font-bold text-zinc-900">{metric.value}</p>
          </div>
          <div className={`flex items-center gap-1 ${colorClass}`}>
            <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-semibold">{Math.abs(metric.change)}%</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 mt-0.5 shrink-0" />
            <p className="text-xs text-zinc-600 leading-relaxed">{metric.insight}</p>
          </div>
          <div className="flex items-start gap-2">
            <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-zinc-600 leading-relaxed">{metric.recommendation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;