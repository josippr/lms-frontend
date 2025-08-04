import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";

function NetworkUsageChart() {
  const [timeRange, setTimeRange] = useState("6h");
  const networkUsageData = useSelector((state) => state.charts.networkUsage);

  const filterDataByTimeRange = (data) => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    let hoursToShow;
    
    switch(timeRange) {
      case "1h":
        hoursToShow = 1;
        break;
      case "6h":
        hoursToShow = 6;
        break;
      case "12h":
        hoursToShow = 12;
        break;
      case "24h":
      default:
        hoursToShow = 24;
        break;
    }
    
    const cutoffTime = new Date(now.getTime() - hoursToShow * 60 * 60 * 1000);
    return data.filter(item => new Date(item.timestamp) >= cutoffTime);
  };

  const [filteredData, setFilteredData] = useState(filterDataByTimeRange(networkUsageData));

  useEffect(() => {
    setFilteredData(filterDataByTimeRange(networkUsageData));
  }, [timeRange, networkUsageData]);

  if (!networkUsageData || networkUsageData.length === 0) return null;

  const chartConfig = {
    bandwidth: {
      color: "#3b82f6", // blue-500
      name: "Bandwidth",
      unit: "Mbps",
    },
  };

  const CustomLegendContent = () => (
    <div className="flex items-center justify-center gap-4 text-xs mt-4">
      <div className="flex items-center gap-2">
        <div 
          className="w-3 h-3 rounded-[3px]" 
          style={{ backgroundColor: chartConfig.bandwidth.color }}
        />
        <span>{chartConfig.bandwidth.name}</span>
        <span className="text-muted-foreground">({chartConfig.bandwidth.unit})</span>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full">
      <Card className="pt-0 w-full h-full">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-2 space-y-0 border-b py-4 sm:py-5">
          <div className="grid flex-1 gap-1">
            <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
              </span>
              Network Usage
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Showing inbound usage over time
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[160px] rounded-lg sm:ml-auto">
              <SelectValue placeholder="Last 24 hours" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="24h" className="rounded-lg">Last 24 hours</SelectItem>
              <SelectItem value="12h" className="rounded-lg">Last 12 hours</SelectItem>
              <SelectItem value="6h" className="rounded-lg">Last 6 hours</SelectItem>
              <SelectItem value="1h" className="rounded-lg">Last 1 hour</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className=" h-[calc(100%-68px)]">
          <ChartContainer config={chartConfig} className="h-[310px] sm:h-[310px] w-full">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="colorBandwidth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })
                }
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                width={40}
                tickFormatter={(value) => `${value} Mbps`}
              />
              <ChartTooltip
                cursor={{ stroke: '#94a3b8', strokeWidth: 1 }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        second: "2-digit",
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    }
                    indicator="none"
                  />
                }
              />
              <Area 
                type="monotone"
                dataKey="bandwidth"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorBandwidth)"
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <ChartLegend content={<CustomLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default NetworkUsageChart;