import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { PerformanceScore } from '@/types/analytics.types';

const PerformanceScoreCard = ({ scores }: { scores: PerformanceScore[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Scores</CardTitle>
        <CardDescription>Skor kesehatan bisnis per kategori</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {scores.map((score) => (
          <div key={score.category}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{score.category}</span>
              <span className="text-sm font-bold text-zinc-900">{score.score}/100</span>
            </div>
            <Progress value={score.score} className="h-2" />
            <p className="text-xs text-zinc-600 mt-1">{score.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PerformanceScoreCard;
