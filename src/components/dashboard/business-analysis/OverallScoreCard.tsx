import { Card, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const OverallScoreCard = ({ score }: { score: number }) => {
  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <Card className="bg-linear-to-br from-zinc-900 to-zinc-800 text-white">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 lg:gap-8">
          <div>
            <p className="text-sm lg:text-base text-zinc-300 mb-1 sm:mb-2">Overall Business Health</p>
            <div className="flex items-baseline gap-1 sm:gap-3">
              <span className="text-3xl sm:text-4xl md:text-6xl font-bold">{score}</span>
              <span className="text-lg sm:text-2xl text-zinc-400">/100</span>
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-zinc-300 mt-1 sm:mt-2">{getScoreLabel(score)}</p>
          </div>
          <div className="w-16 h-16 sm:w-24 lg:w-32 md:w-20 rounded-full border-4 sm:border-6 md:border-8 border-white/20 flex items-center justify-center self-center sm:self-auto">
            <BarChart3 className="w-6 h-6 sm:w-10 lg:w-16 md:w-12 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallScoreCard;