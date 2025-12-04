import React from 'react';
import { 
  TrendingUp,
  FileText,
  Upload,
  Wand2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Feature as FeatureType } from '@/types/dashboard.types';

// Icon mapping helper
const iconMap: Record<string, React.ElementType> = {
  FileText,
  TrendingUp,
  Upload,
  Wand2
};

const FeatureCard = ({ feature }: { feature: FeatureType }) => {
  const IconComponent = iconMap[feature.icon] || FileText;
  
  const handleClick = () => {
    if (feature.path) {
      window.location.href = feature.path;
    }
  };

  return (
    <Card 
      className={`group transition-all duration-300 cursor-default ${!feature.isActive && 'opacity-50 cursor-not-allowed'}`}
      onClick={feature.isActive ? handleClick : undefined}
    >
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon Container */}
          <div 
            className={`w-20 h-20 rounded-2xl ${feature.color} flex items-center justify-center transition-transform duration-300`}
          >
            <IconComponent className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-zinc-900">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-zinc-600 text-sm leading-relaxed">
            {feature.description}
          </p>

          {/* CTA Button */}
          <Button 
            variant="ghost" 
            className="mt-2 cursor-pointer"
            disabled={!feature.isActive}
          >
            {feature.isActive ? 'Buka Fitur' : 'Segera Hadir'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard