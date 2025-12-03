import React from 'react';
import { 
  TrendingUp,
  FileText,
  Upload,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { QuickAction as QuickActionType } from '@/types/dashboard.types';

// Icon mapping helper
const iconMap: Record<string, React.ElementType> = {
  FileText,
  TrendingUp,
  Upload,
  Wand2
};

const QuickActionCard = ({ action }: { action: QuickActionType }) => {
  const IconComponent = iconMap[action.icon] || FileText;
  
  const handleClick = () => {
    console.log(`Quick action: ${action.action}`);
    // TODO: Implement action handler
  };

  const iconColorMap: Record<string, string> = {
    'bg-blue-100': 'text-blue-600',
    'bg-purple-100': 'text-purple-600',
    'bg-orange-100': 'text-orange-600',
    'bg-green-100': 'text-green-600'
  };

  return (
    <Button 
      variant="outline" 
      className="justify-start h-auto py-4"
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
          <IconComponent className={`w-5 h-5 ${iconColorMap[action.color] || 'text-zinc-600'}`} />
        </div>
        <div className="text-left">
          <div className="font-semibold">{action.title}</div>
          <div className="text-xs text-zinc-500">{action.description}</div>
        </div>
      </div>
    </Button>
  );
};

export default QuickActionCard