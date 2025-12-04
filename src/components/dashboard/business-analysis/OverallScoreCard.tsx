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
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-300 mb-2">Overall Business Health</p>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-bold">{score}</span>
              <span className="text-2xl text-zinc-400">/100</span>
            </div>
            <p className="text-zinc-300 mt-2">{getScoreLabel(score)}</p>
          </div>
          <div className="w-32 h-32 rounded-full border-8 border-white/20 flex items-center justify-center">
            <BarChart3 className="w-16 h-16 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallScoreCard;