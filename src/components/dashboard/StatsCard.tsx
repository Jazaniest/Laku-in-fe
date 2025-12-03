import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';

const StatsCard = ({ title, value, description, trend }: {
  title: string;
  value: string;
  description: string;
  trend: number;
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-zinc-900">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-sm font-semibold ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-sm text-zinc-500">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard