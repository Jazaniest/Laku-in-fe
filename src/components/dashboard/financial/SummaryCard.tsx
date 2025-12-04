import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SummaryCard = ({
  title,
  value,
  trend,
  icon: Icon,
  color
}: {
  title: string;
  value: string;
  trend?: number;
  icon: React.ElementType;
  color: string;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-zinc-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-zinc-900">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {trend >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(trend).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard