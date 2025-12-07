import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';

const StatsCard = ({ title, value, description, trend }: {
  title: string;
  value: string;
  description: string;
  trend: number;
}) => {
  return (
    <Card className="p-3 sm:p-4">
      <CardHeader className="pb-2">
        <CardDescription className="text-xs sm:text-sm md:text-base">{title}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-0">
        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900">{value}</div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-xs sm:text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-xs sm:text-sm text-zinc-500">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard