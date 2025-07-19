"use client"

import { TrendingUp } from "lucide-react"
import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts"
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

export const description = "A radial chart"

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



export default function ChartRadialSimple() {
  const networkStatus = useSelector((state) => state.charts.networkStatus?.hourlyAverage?.networkParams)
  const current = useSelector((state) => state.charts.networkStatus?.hourlyAverage?.status)
  const message = useSelector((state) => state.charts.networkStatus?.hourlyAverage?.message)

  if (!networkStatus) return null

  const bandwidthMbps = +(networkStatus.avgBandwidthKbps / 1000).toFixed(2)
  const jitterMs = +networkStatus.avgJitterMs.toFixed(2)
  const packetLossPercent = +networkStatus.avgPacketLossPercent.toFixed(2)
  const latencyMs = +networkStatus.avgPingLatencyMs.toFixed(2)

  const chartData = [
    {
      key: "jitter",
      value: Math.min(jitterMs, 1000),
      fill: "var(--chart-4)",
    },
    {
      key: "latency",
      value: Math.min(latencyMs, 1000),
      fill: "var(--chart-3)",
    },
    {
      key: "packetLoss",
      value: Math.min(packetLossPercent, 100),
      fill: "var(--chart-2)",
    },
    {
      key: "bandwidth",
      value: Math.min(bandwidthMbps, 100),
      fill: "var(--chart-1)",
    },
  ]

  return (
    <Card className="flex flex-col w-full sm:w-auto">
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
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={110}>
            <PolarAngleAxis
              type="number"
              domain={[0, 100]} // This sets 100 as the full circle max
              dataKey="value"
              angleAxisId={0}
              tick={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  nameKey="key"
                  valueKey="value"
                  indicator="dot"
                  formatter={(value, name, props) => {
                    const metric = props.payload?.key
                    switch (metric) {
                      case "bandwidth":
                        return [`Bandwidth: ${value} Mbps`, ]
                      case "latency":
                        return [`Latency: ${value} ms`, ]
                      case "packetLoss":
                        return [`Packet Loss: ${value} %`, ]
                      case "jitter":
                        return [`Jitter: ${value} ms`, ]
                      default:
                        return [value, name]
                    }
                  }}
                />
              }
            />
            <RadialBar dataKey="value" background clockWise />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
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
