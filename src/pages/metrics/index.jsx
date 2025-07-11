"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/themeProvider.jsx";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarRadiusAxis,
  Label as RechartsLabel,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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

import { formatDistanceToNow, parseISO } from "date-fns";
import { fetchMetrics } from "@/service/apiService.js";
import socket from "@/lib/socket";

const MAX_POINTS = 30;

const chartConfig = {
  metrics: {
    label: "System Metrics",
  },
  temperature: {
    label: "CPU Temp (°C)",
    color: "var(--chart-1)",
  },
  cpuPercent: {
    label: "CPU Usage (%)",
    color: "var(--chart-4)",
  },
  memoryUsed: {
    label: "RAM Used (%)",
    color: "var(--chart-5)",
  },
};

function RadialChartCard({ value, label, color = "var(--chart-2)" }) {
  const chartData = [
    { name: label, value, fill: color },
    { name: "bg", value: 100, fill: "var(--muted)" },
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
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
  const [historicalMetrics, setHistoricalMetrics] = useState([]);
  const [timeRange, setTimeRange] = useState("24h");
  const [uid, setUid] = useState(null);

  const latest = metrics.at(-1);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Listen to WebSocket live updates
  useEffect(() => {
    socket.on("new_metric", (metric) => {
      const isoMetric = {
        ...metric,
        timestamp: new Date(metric.timestamp).toISOString(),
      };

      setMetrics((prev) => {
        const updated = [...prev, isoMetric];
        return updated.slice(-MAX_POINTS);
      });

      if (!uid && metric.uid) setUid(metric.uid);
    });

    return () => socket.off("new_metric");
  }, [uid]);

  // Fetch historical metrics for the given UID
  useEffect(() => {
    const fetchHistorical = async () => {
      if (!uid || !token) return;
      try {
        const data = await fetchMetrics(uid, token);
        const formatted = data.map((entry) => ({
          timestamp: new Date(entry.timestamp).toISOString(),
          temperature: entry.hardware.cpu_temperature_c,
          memory: entry.hardware.memory_total_mb,
          disk: entry.hardware.disk_total_mb,
          cpuPercent: entry.hardware.cpu_percent,
          memoryUsed: entry.hardware.memory_used_percent,
        }));
        setHistoricalMetrics(formatted);
        setHistoricalMetrics(formatted);
      } catch (error) {
        console.error("Failed to fetch historical metrics:", error);
      }
    };

    fetchHistorical();
  }, [uid, token]);

  const filteredData = historicalMetrics.filter((item) => {
    const date = new Date(item.timestamp);
    const now = new Date();
    const startDate = new Date(now);
    if (timeRange === "6h") startDate.setHours(now.getHours() - 6);
    else if (timeRange === "12h") startDate.setHours(now.getHours() - 12);
    else startDate.setHours(now.getHours() - 24);
    return date >= startDate;
  });

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
              <div className="text-lg font-medium">{latest?.hostname || "..."}</div>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">UID</Label>
              <div className="text-sm break-all">{latest?.uid || "..."}</div>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">CPU Temp</Label>
              <div className="text-sm">{latest?.temperature ?? "--"}°C</div>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Disk Size</Label>
              <div className="text-sm">{latest?.disk ?? "--"} MB</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="col-span-2">
              <RadialChartCard
                value={latest?.cpuPercent || 0}
                label="CPU Usage"
                color="var(--chart-3)"
              />
            </div>
            <div className="col-span-2">
              <RadialChartCard
                value={latest?.memoryUsed || 0}
                label="RAM Usage"
                color="var(--chart-4)"
              />
            </div>
            <div className="col-span-4">
              <Card className="pt-0">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                  <div className="grid flex-1 gap-1">
                    <CardTitle>System Metrics</CardTitle>
                    <CardDescription>
                      Showing system performance metrics over time
                    </CardDescription>
                  </div>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex">
                      <SelectValue placeholder="Last 24 hours" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="24h" className="rounded-lg">Last 24 hours</SelectItem>
                      <SelectItem value="12h" className="rounded-lg">Last 12 hours</SelectItem>
                      <SelectItem value="6h" className="rounded-lg">Last 6 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                  <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                    <LineChart data={filteredData}>
                      <CartesianGrid vertical={false} />
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
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            labelFormatter={(value) =>
                              new Date(value).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                second: "2-digit",
                              })
                            }
                            indicator="dot"
                          />
                        }
                      />
                      <Line dataKey="temperature" type="monotone" stroke="var(--chart-1)" dot={false} activeDot={{ r: 6 }} />
                      <Line dataKey="cpuPercent" type="monotone" stroke="var(--chart-4)" dot={false} activeDot={{ r: 6 }} />
                      <Line dataKey="memoryUsed" type="monotone" stroke="var(--chart-5)" dot={false} activeDot={{ r: 6 }} />
                      <ChartLegend content={<ChartLegendContent />} />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MetricsPage;
