
    import React from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { DollarSign, TrendingUp, Package, Star } from 'lucide-react';
    import { motion } from 'framer-motion';

    // Simple placeholder for a bar chart bar
    const ChartBar = ({ value, maxValue, label, colorClass = 'bg-primary' }) => {
      const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
      return (
        <div className="flex flex-col items-center space-y-1">
          <div className="w-8 h-32 bg-muted rounded flex items-end">
            <motion.div
              className={`w-full rounded ${colorClass}`}
              initial={{ height: 0 }}
              animate={{ height: `${heightPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      );
    };

    const AnalyticsCharts = () => {
      // Fictional data
      const salesData = [
        { label: 'Jan', value: 1200 },
        { label: 'Feb', value: 1800 },
        { label: 'Mar', value: 1500 },
        { label: 'Apr', value: 2100 },
        { label: 'May', value: 2500 },
      ];
      const maxSales = Math.max(...salesData.map(d => d.value), 0);

      const topProducts = [
        { name: 'Wooden Bowl', sales: 85 },
        { name: 'Cutting Board', sales: 60 },
        { name: 'Ceramic Mug', sales: 40 },
      ];

      return (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="glassmorphism">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$9,100.00</div>
                <p className="text-xs text-muted-foreground">+15.2% from last month</p>
              </CardContent>
            </Card>
             <Card className="glassmorphism">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+185</div>
                <p className="text-xs text-muted-foreground">+25 from last month</p>
              </CardContent>
            </Card>
             <Card className="glassmorphism">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                 <p className="text-xs text-muted-foreground">1 inactive</p>
              </CardContent>
            </Card>
             <Card className="glassmorphism">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-xs text-muted-foreground">Based on 52 reviews</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Monthly Sales Trend</CardTitle>
                <CardDescription>Fictional sales data for the last 5 months.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-around items-end h-40">
                  {salesData.map((data) => (
                    <ChartBar key={data.label} value={data.value} maxValue={maxSales} label={data.label} />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glassmorphism">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Products with the most sales this month (fictional).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center">
                    <span className="text-sm font-medium flex-1">{product.name}</span>
                    <span className="text-sm text-muted-foreground">{product.sales} sales</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      );
    };

    export default AnalyticsCharts;
  