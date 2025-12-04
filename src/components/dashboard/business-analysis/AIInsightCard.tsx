import {
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AIInsight } from '@/types/analytics.types';

const AIInsightCard = ({ insight }: { insight: AIInsight }) => {
  const getIcon = () => {
    switch (insight.category) {
      case 'opportunity': return <Sparkles className="w-5 h-5" />;
      case 'risk': return <AlertTriangle className="w-5 h-5" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5" />;
      case 'alert': return <AlertTriangle className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getColor = () => {
    switch (insight.category) {
      case 'opportunity': return 'bg-green-100 text-green-800 border-green-200';
      case 'risk': return 'bg-red-100 text-red-800 border-red-200';
      case 'recommendation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'alert': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  const getSeverityBadge = () => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return <Badge className={colors[insight.severity]}>{insight.severity.toUpperCase()}</Badge>;
  };

  return (
    <Card className={`border-2 ${getColor()}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getColor()}`}>
              {getIcon()}
            </div>
            <div>
              <CardTitle className="text-base">{insight.title}</CardTitle>
              <CardDescription className="text-zinc-600 mt-1">{insight.impact}</CardDescription>
            </div>
          </div>
          {getSeverityBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-700">{insight.description}</p>
        <div>
          <p className="text-sm font-semibold text-zinc-900 mb-2">Action Items:</p>
          <ul className="space-y-2">
            {insight.actionItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-zinc-700">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsightCard