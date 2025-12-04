import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/helper/formatCurrency';
import type { ProductPerformance } from '@/types/analytics.types';

const ProductPerformanceCard = ({ products }: { products: ProductPerformance[] }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'trending': return <Badge className="bg-green-100 text-green-800">🔥 Trending</Badge>;
      case 'stable': return <Badge className="bg-blue-100 text-blue-800">📊 Stable</Badge>;
      case 'declining': return <Badge className="bg-red-100 text-red-800">📉 Declining</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Performance</CardTitle>
        <CardDescription>Performa kategori produk</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-zinc-900">{product.category}</p>
                  {getStatusBadge(product.status)}
                </div>
                <div className="flex items-center gap-4 text-sm text-zinc-600">
                  <span>{formatCurrency(product.revenue)}</span>
                  <span>•</span>
                  <span>{product.unitsSold} units</span>
                  <span>•</span>
                  <span>Margin {product.margin}%</span>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${product.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.growthRate >= 0 ? '+' : ''}{product.growthRate}%
                </p>
                <p className="text-xs text-zinc-500">Growth</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductPerformanceCard;
