"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { useSelector } from "react-redux"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"

export const description = "A bar chart showing network metrics"

const chartConfig = {
  bandwidth: {
    label: "Bandwidth (Mbps)",
    color: "var(--chart-1)",
  },
  latency: {
    label: "Latency (ms)",
    color: "var(--chart-2)",
  },
  packetLoss: {
    label: "Packet Loss (%)",
    color: "var(--chart-3)",
  },
  jitter: {
    label: "Jitter (ms)",
    color: "var(--chart-4)",
  },
}

export default function ChartBarSimple() {
  const networkStatus = useSelector((state) => state.charts.networkStatus?.hourlyAverage?.networkParams)
  const current = useSelector((state) => state.charts.networkStatus?.hourlyAverage?.status)
  const invalidFlag = useSelector((state) => state.charts.networkStatus?.hourlyAverage?.invalidFlag)
  const message = useSelector((state) => state.charts.networkStatus?.hourlyAverage?.message)

  if (!networkStatus) return null

  const bandwidthMbps = +(networkStatus.avgBandwidthKbps / 1000).toFixed(2)
  const jitterMs = +networkStatus.avgJitterMs.toFixed(2)
  const packetLossPercent = +networkStatus.avgPacketLossPercent.toFixed(2)
  const latencyMs = +networkStatus.avgPingLatencyMs.toFixed(2)

  const chartData = [
    {
      name: "Bandwidth",
      value: Math.min(bandwidthMbps, 100),
      fill: "var(--chart-1)",
    },
    {
      name: "Latency",
      value: Math.min(latencyMs, 1000),
      fill: "var(--chart-2)",
    },
    {
      name: "Packet Loss",
      value: Math.min(packetLossPercent, 100),
      fill: "var(--chart-3)",
    },
    {
      name: "Jitter",
      value: Math.min(jitterMs, 1000),
      fill: "var(--chart-4)",
    },
  ]

  return (
    <Card className="flex flex-col w-full max-w-full min-w-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>Current Network Status</CardTitle>
        {current && (
          <Badge 
            variant={
              current === "good" ? "default" : 
              current === "moderate" ? "secondary" : 
              "destructive"
            }
            className={`px-3 py-1 text-xl ${
              current === "good" ? "bg-green-500 text-white" :
              current === "moderate" ? "bg-yellow-500 text-white" :
              "bg-red-500 text-white"
            }`}
          >
            {current.charAt(0).toUpperCase() + current.slice(1)}
          </Badge>
        )}
      </CardHeader>
      {invalidFlag ? (
        <h1>There is no valid data for the last hour.</h1>
      ) : (
      <CardContent className="flex-1 pb-0 min-w-0">
        <ChartContainer
          config={chartConfig}
          className="h-[250px] w-full min-w-0"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="horizontal"
              margin={{ top: 5, right: 10, left: -40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                type="category" 
              />
              <YAxis 
                type="number"
                domain={[0, (dataMax) => Math.ceil(dataMax * 1.2)]}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    nameKey="name"
                    valueKey="value"
                    indicator="dot"
                    formatter={(value, name) => {
                      switch (name) {
                        case "Bandwidth":
                          return [`${value} Mbps`]
                        case "Latency":
                        case "Jitter":
                          return [`${value} ms`]
                        case "Packet Loss":
                          return [`${value} %`]
                        default:
                          return [value]
                      }
                    }}
                  />
                }
              />
              <Bar 
                dataKey="value" 
                fill="fill" 
                radius={[4, 4, 0, 0]} // Rounded top corners only
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      )}
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium text-center">
          {message}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing network performance for the last hour
        </div>
      </CardFooter>
    </Card>
  )
}