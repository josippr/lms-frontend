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
import { useSelector } from "react-redux"

export default function ActiveDevicesChart() {
  const activeDevices = useSelector((state) => state.charts.activeDevicesWidget)

  const node = activeDevices;

  console.log("debug activeDevices", activeDevices);

  if (!node) {
    return (
      <Card className="flex flex-col items-center justify-center p-6 text-sm text-muted-foreground">
        <CardHeader className="pb-0">
          <CardTitle>Active devices status</CardTitle>
          <CardDescription>Loading sync data…</CardDescription>
        </CardHeader>
        <CardContent className="text-center">Please wait…</CardContent>
      </Card>
    )
  }

  const statusColor = "#2563eb";

  const chartData = [
    {
      name: node.deviceName,
      value: 120,
      fill: statusColor,
    },
  ]

  const chartConfig = {}

  return (
    <Card className="flex flex-col w-full sm:w-auto">
      <CardHeader className="items-center pb-0">
        <CardTitle>Active devices</CardTitle>
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
              {activeDevices}
            </div>
            <div className="text-muted-foreground text-sm">Active devices</div>
          </div>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing number of devices connected in the last 5 minutes
        </div>
      </CardFooter>
    </Card>
  )
}

