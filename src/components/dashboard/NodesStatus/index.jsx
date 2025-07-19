import React, { useState, useEffect } from "react"
import { CircleAlert, CircleCheck } from "lucide-react"
import {
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import moment from "moment"

export default function NodeStatusChart({ data }) {
  const noOfNodes = data?.length || 0
  const node = data;

  if (!node || !node.lastSync || isNaN(parseInt(node.lastSync))) {
    return (
      <Card className="flex flex-col items-center justify-center p-6 text-sm text-muted-foreground">
        <CardHeader className="pb-0">
          <CardTitle>Node status</CardTitle>
          <CardDescription>Loading sync data…</CardDescription>
        </CardHeader>
        <CardContent className="text-center">Please wait…</CardContent>
      </Card>
    )
  }

  const lastSyncUnix = parseInt(node.lastSync, 10)
  const nowUnix = Math.floor(Date.now() / 1000)
  const minutesAgo = Math.max(0, Math.floor((nowUnix - lastSyncUnix) / 60))
  const isOnline = minutesAgo <= 10
  const statusColor = isOnline ? "#22c55e" : "#ef4444"

  const chartData = [
    {
      name: node.deviceName,
      value: 120,
      fill: statusColor,
    },
  ]

  const chartConfig = {}


  const formattedLastSync = moment.unix(lastSyncUnix).format("DD.MM.YYYY HH:mm")

  return (
    <Card className="flex flex-col w-full sm:w-auto">
      <CardHeader className="items-center pb-0">
        <CardTitle>Node status</CardTitle>
        <CardDescription>Last sync: {formattedLastSync}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 relative">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid radialLines={false} stroke="none" />
            <PolarRadiusAxis
              type="number"
              domain={[0, 120]}
              tick={false}
              axisLine={false}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={10}
              background={{ fill: "#e5e7eb" }}
              fill={statusColor}
            />
          </RadialBarChart>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-foreground">
              {minutesAgo} min
            </div>
            <div className="text-muted-foreground text-sm">Since last sync</div>
          </div>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {isOnline ? (
            <p className="flex items-center gap-2">
              <CircleCheck className="h-4 w-4 text-green-600" /> Node is online
            </p>
          ) : (
            <p>
              <CircleAlert className="h-4 w-4 text-red-600" /> Node is offline
            </p>
          )}
        </div>
        <div className="text-muted-foreground leading-none">
          Showing sync activity for last node update
        </div>  
      </CardFooter>
    </Card>
  )
}

