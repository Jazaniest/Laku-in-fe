import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const SummaryCard = ({
  title,
  value,
  trend,
  icon: Icon,
  color,
  isLoading = false
}: {
  title: string;
  value: string;
  trend?: number;
  icon: React.ElementType;
  color: string;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return (
      <Card className="p-3 sm:p-4">
        <CardContent className="p-0 space-y-2">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 sm:h-4 w-16 sm:w-24" />
              <Skeleton className="h-6 sm:h-8 w-20 sm:w-32" />
              <Skeleton className="h-3 sm:h-4 w-12 sm:w-16 mt-1 sm:mt-2" />
            </div>
            <Skeleton className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-3 sm:p-4">
      <CardContent className="p-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-zinc-600 mb-1">{title}</p>
            <p className="text-lg sm:text-2xl font-bold text-zinc-900">{value}</p>
            {trend !== undefined && (
              <div className="flex items-center gap-1 mt-2">
                {trend >= 0 ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                )}
                <span className={`text-xs sm:text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(trend).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg ${color} flex items-center justify-center shrink-0`}>
            <Icon className="w-3 h-3 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;