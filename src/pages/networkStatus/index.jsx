"use client";

import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
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
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { fetchNetworkStatus } from "@/service/apiService.js";
import { DataTable } from "@/components/ui/data-table";
import { deviceColumns } from "@/components/activeDevicesTable.jsx";
import {
  setNetworkStatusData,
  setNetworkStatusMetrics,
  setNetworkStatusLoading,
  setNetworkStatusError,
  setActiveDevices,
  appendLiveNetworkStatus,
} from "@/redux/actions/networkStatus";
import socket from "@/lib/socket";


function MetricChart({ title, dataKey, color, history, liveData, description }) {
  const [range, setRange] = useState("6h");
  
  let chartData = [];
  
  if (Array.isArray(history)) {
    chartData = history;
  } else if (history && typeof history === 'object') {
    chartData = history[range] || [];
  }

  if (liveData && liveData.length > 0) {
    const liveChartData = liveData
      .map(item => ({
        ...item.payload?.networkStatus,
        timestamp: item.timestamp || item.createdAt
      }))
      .filter(item => item && item[dataKey] !== undefined && item[dataKey] !== null);

    const now = new Date();
    let cutoffTime;
    switch (range) {
      case "1h":
        cutoffTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case "6h":
        cutoffTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        break;
      case "12h":
        cutoffTime = new Date(now.getTime() - 12 * 60 * 60 * 1000);
        break;
      case "24h":
        cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
    }

    const filteredLiveData = liveChartData.filter(item => 
      new Date(item.timestamp) >= cutoffTime
    );

    const combinedData = [...chartData];
    filteredLiveData.forEach(liveItem => {
      const existingIndex = combinedData.findIndex(
        item => Math.abs(new Date(item.timestamp) - new Date(liveItem.timestamp)) < 60000
      );
      if (existingIndex >= 0) {
        combinedData[existingIndex] = liveItem;
      } else {
        combinedData.push(liveItem);
      }
    });

    chartData = combinedData;
  }

  const formattedData = chartData.map(item => ({
    ...item,
    timestamp: item.timestamp || item.createdAt
  }))
  .filter(item => item[dataKey] !== undefined && item[dataKey] !== null)
  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const chartConfig = {
    [dataKey]: {
      label: title,
      color: color,
    },
  };

  const calculateTrend = () => {
    if (formattedData.length < 2) return null;
    const latest = formattedData[formattedData.length - 1][dataKey];
    const previous = formattedData[formattedData.length - 2][dataKey];
    if (previous === 0) return null;
    return ((latest - previous) / previous) * 100;
  };

  const trend = calculateTrend();
  const hasData = formattedData.length > 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm">{description}</CardDescription>
            )}
          </div>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-auto h-8">
              <SelectValue placeholder="Last 6 hours" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="1h">Last hour</SelectItem>
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="12h">Last 12 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px] p-0">
        {hasData ? (
          <div className="h-full w-full p-4">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%" aspect={1.5}>
                <LineChart
                  data={formattedData}
                  margin={{
                    left: 12,
                    right: 12,
                    top: 12,
                    bottom: 12,
                  }}
                >
                  <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="timestamp"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => format(new Date(value), "HH:mm")}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) =>
                          format(new Date(value), "PPpp")
                        }
                        indicator="dot"
                      />
                    }
                  />
                  <Line
                    dataKey={dataKey}
                    type="monotone"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      stroke: color,
                      fill: "hsl(var(--background))",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
      {hasData && trend !== null && (
        <div className="px-6 pb-4 text-sm">
          <div className="flex items-center gap-2 font-medium">
            {trend > 0 ? (
              <>
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500">
                  Trending up by {Math.abs(trend).toFixed(1)}%
                </span>
              </>
            ) : trend < 0 ? (
              <>
                <TrendingUp className="h-4 w-4 rotate-180 text-red-500" />
                <span className="text-red-500">
                  Trending down by {Math.abs(trend).toFixed(1)}%
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">No change</span>
            )}
          </div>
          <div className="text-muted-foreground mt-1">
            Showing data for the last {range}
          </div>
        </div>
      )}
    </Card>
  );
}

export default function NetworkStatusPage() {
  const dispatch = useDispatch();
  
  const {
    latestData,
    liveData,
    metrics,
    activeDevices,
    isLoading,
    error,
    lastUpdated,
  } = useSelector((state) => state.networkStatus);
  
  const uid = useSelector((state) => state.profile.linkedNodes[0]);

  useEffect(() => {
    if (!uid) return;

    socket.on("new_network_status", (data) => {
      const normalized = {
        payload: {
          networkStatus: data.payload,
        },
        timestamp: data.timestamp || new Date().toISOString(),
      };

      dispatch(appendLiveNetworkStatus(normalized));
    });

    return () => socket.off("new_network_status");
  }, [uid, dispatch]);

  useEffect(() => {
    const loadHistoricalData = async () => {
      dispatch(setNetworkStatusLoading(true));
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token || !uid) return;

        const result = await fetchNetworkStatus(uid, token);
        
        const findLatestData = (data) => {
          if (data["1h"]?.[0]) return data["1h"][0];
          if (data["6h"]?.[0]) return data["6h"][0];
          if (data["12h"]?.[0]) return data["12h"][0];
          if (data["24h"]?.[0]) return data["24h"][0];
          
          for (const key in data) {
            if (Array.isArray(data[key]) && data[key].length > 0) {
              return data[key][0];
            } else if (data[key]?.payload?.networkStatus) {
              return data[key];
            }
          }
          return null;
        };

        if (liveData.length === 0) {
          const latest = findLatestData(result);
          if (latest) {
            dispatch(setNetworkStatusData(latest));
            
            const devices = latest?.payload?.networkStatus?.activeDevices || [];
            dispatch(setActiveDevices(devices));
          }
        }

        const normalized = { "1h": [], "6h": [], "12h": [], "24h": [] };

        if (Array.isArray(result)) {
          const now = new Date();
          const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
          const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
          const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
          const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

          const formattedData = result.map(item => ({
            ...item.payload?.networkStatus,
            timestamp: item.timestamp || item.createdAt
          }));

          normalized["1h"] = formattedData.filter(item => 
            new Date(item.timestamp) >= oneHourAgo
          ).reverse();
          
          normalized["6h"] = formattedData.filter(item => 
            new Date(item.timestamp) >= sixHoursAgo
          ).reverse();
          
          normalized["12h"] = formattedData.filter(item => 
            new Date(item.timestamp) >= twelveHoursAgo
          ).reverse();
          
          normalized["24h"] = formattedData.filter(item => 
            new Date(item.timestamp) >= twentyFourHoursAgo
          ).reverse();
        } 
        else if (typeof result === 'object') {
          for (const range of ["1h", "6h", "12h", "24h"]) {
            if (result[range]) {
              normalized[range] = Array.isArray(result[range])
                ? result[range].map(item => ({
                    ...item.payload?.networkStatus,
                    timestamp: item.timestamp || item.createdAt
                  })).reverse()
                : [{
                    ...result[range].payload?.networkStatus,
                    timestamp: result[range].timestamp || result[range].createdAt
                  }];
            }
          }
        }

        dispatch(setNetworkStatusMetrics(normalized));
      } catch (error) {
        console.error("Failed to fetch network status:", error);
        dispatch(setNetworkStatusError(error.message || "Failed to fetch network status"));
      } finally {
        dispatch(setNetworkStatusLoading(false));
      }
    };

    loadHistoricalData();
  }, [uid, dispatch]);

  const networkStatus = latestData?.payload?.networkStatus || {};
  const timestamp = latestData?.timestamp;

  if (isLoading) {
    return <div className="p-4">Loading network status...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Network Status</h1>
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated ? format(new Date(lastUpdated), "PPpp") : (timestamp ? format(new Date(timestamp), "PPpp") : "N/A")}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Bandwidth</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {networkStatus.bandwidthKbps?.toFixed(0) ?? "N/A"} Kbps
            </p>
            <p className="text-sm text-muted-foreground">
              Max: {networkStatus.maxBandwidthKbps?.toLocaleString() ?? "—"} Kbps
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Connected Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {networkStatus.deviceCount ?? activeDevices.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Jitter</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {networkStatus.jitterMs?.toFixed(1) ?? "N/A"} ms
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ping Latency</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {networkStatus.pingLatencyMs?.toFixed(2) ?? "N/A"} ms
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Packet Count</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {networkStatus.packetCount ?? "N/A"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Packet Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {networkStatus.packetLossPercent?.toFixed(1) ?? "N/A"} %
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Out of Order Count</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {networkStatus.outOfOrderCount ?? "N/A"} %
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average RTT time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {networkStatus.averageRttMs?.toFixed(1) ?? "N/A"} ms
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-4 auto-rows-fr">
        <MetricChart
          title="Bandwidth (Kbps)"
          dataKey="bandwidthKbps"
          color="#22c55e"
          history={metrics}
          liveData={liveData}
        />
        <MetricChart
          title="Latency (ms)"
          dataKey="pingLatencyMs"
          color="#3b82f6"
          history={metrics}
          liveData={liveData}
        />
        <MetricChart
          title="Jitter (ms)"
          dataKey="jitterMs"
          color="#facc15"
          history={metrics}
          liveData={liveData}
        />
        <MetricChart
          title="Packet Loss (%)"
          dataKey="packetLossPercent"
          color="#ef4444"
          history={metrics}
          liveData={liveData}
        />
        <MetricChart
          title="Packet Count"
          dataKey="packetCount"
          color="#8b5cf6"
          history={metrics}
          liveData={liveData}
          description="Total packets sent/received"
        />
        <MetricChart
          title="Active Devices"
          dataKey="deviceCount"
          color="#f97316"
          history={metrics}
          liveData={liveData}
          description="Number of devices connected to the network"
        />
        <MetricChart
          title="Out of Order Packets"
          dataKey="outOfOrderCount"
          color="#eab308"
          history={metrics}
          liveData={liveData}
          description="Percentage of packets received out of order"
        />
        <MetricChart
          title="Average RTT Time"
          dataKey="averageRttMs"
          color="#14b8a6"
          history={metrics}
          liveData={liveData}
          description="Average round-trip time for packets"
        />
      </div>
      <Card className=" p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-2">Active Devices</h2>
        <DataTable
          columns={deviceColumns}
          data={activeDevices.map((device) => ({
            ip: device.ip,
            hostname: device.hostname || 'Unknown',
            deviceName: device.deviceName || device.hostname || 'Unknown Device',
            brand: device.brand || 'Unknown',
            model: device.model || 'Unknown',
            macAddress: device.macAddress || 'N/A',
            lastSeen: device.lastSeen ? new Date(device.lastSeen * 1000).toLocaleString() : 'N/A',
            status: "active"
          }))}
        />
      </Card>
    </div>
  );
}