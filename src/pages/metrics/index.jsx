"use client";

import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/themeProvider.jsx';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Label } from '@/components/ui/label';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
  PolarGrid,
  Label as RechartsLabel,
} from 'recharts';

import { ChartContainer } from '@/components/ui/chart';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { TrendingUp } from 'lucide-react';

import socket from '@/lib/socket';

const MAX_POINTS = 30;

function RadialChartCard({ value, label, color = 'var(--chart-2)' }) {
  const chartData = [
    { name: label, value, fill: color },
    { name: 'bg', value: 100, fill: 'var(--muted)' }, // background track
  ];

  const chartConfig = {
    value: { label },
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{label}</CardTitle>
        <CardDescription>Live % Usage</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={450}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar
              dataKey="value"
              background
              cornerRadius={10}
              isAnimationActive={false}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <RechartsLabel
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {Math.round(value)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          {label}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

function MetricsPage() {
  const { theme } = useTheme();
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    socket.on('new_metric', (metric) => {
      setMetrics((prev) => {
        const updated = [...prev, {
          ...metric,
          timestamp: new Date(metric.timestamp).toISOString(),
        }];
        return updated.slice(-MAX_POINTS);
      });
    });

    return () => socket.off('new_metric');
  }, []);

  const latest = metrics.at(-1);

  return (
    <div className={`${theme} text-foreground bg-background w-full min-h-screen p-6 space-y-6`}>
      <Card className="p-4 dark:bg-muted bg-white shadow-xl rounded-2xl">
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Live Device Metrics</h3>
            {latest && (
              <span className="text-sm text-muted-foreground">
                Updated {formatDistanceToNow(parseISO(latest.timestamp))} ago
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <Label className="text-muted-foreground text-xs">Hostname</Label>
              <div className="text-lg font-medium">{latest?.hostname || '...'}</div>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">UID</Label>
              <div className="text-sm break-all">{latest?.uid || '...'}</div>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">CPU Temp</Label>
              <div className="text-sm">{latest?.temperature ?? '--'}°C</div>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Disk Usage</Label>
              <div className="text-sm">{latest?.disk ?? '--'} MB</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="col-span-1">
              <RadialChartCard value={latest?.cpuPercent || 0} label="CPU Usage" color="var(--chart-3)" />
            </div>
            <div className="col-span-1">
              <RadialChartCard value={latest?.memoryUsed || 0} label="RAM Usage" color="var(--chart-4)" />
            </div>
            <div className="col-span-2">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={metrics}>
                  <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" name="CPU Temp (°C)" stroke="#F87171" dot={false} />
                  <Line type="monotone" dataKey="memory" name="Memory (MB)" stroke="#60A5FA" dot={false} />
                  <Line type="monotone" dataKey="disk" name="Disk (MB)" stroke="#34D399" dot={false} />
                  <Line type="monotone" dataKey="cpuPercent" name="CPU Usage (%)" stroke="#FBBF24" dot={false} />
                  <Line type="monotone" dataKey="memoryUsed" name="RAM Used (%)" stroke="#A78BFA" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MetricsPage;
