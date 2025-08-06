import React from 'react';
import { useSelector } from 'react-redux';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  PolarRadiusAxis
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';

const MAX_SPEED = 200;
const TICKS = [0, 25, 50, 75, 100];

function SpeedChart({ title, value, color }) {
  const data = [
    {
      name: title,
      value,
      fill: color,
    },
  ];

  return (
    <div className="flex flex-col items-center w-48">
      <div className="h-40 w-40 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="80%"
            outerRadius="100%"
            barSize={10}
            data={data}
            startAngle={180}
            endAngle={0}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <PolarRadiusAxis 
              angle={0} 
              domain={[0, MAX_SPEED]} 
              radius="80%" 
              tick={false}
            />
            <PolarAngleAxis
              type="number"
              domain={[0, MAX_SPEED]}
              angleAxisId={0}
              tick={true}
              ticks={TICKS}
              stroke="transparent"
              tickFormatter={(tick) => (tick === 0 ? '' : tick.toString())}
              tickLine={false}
              tickCount={TICKS.length}
              fontSize={10}
              orientation="inner"
            />
            <RadialBar
              minAngle={5}
              clockWise
              dataKey="value"
              cornerRadius={10}
              fill={color}
              background={{ fill: '#eee', fillOpacity: 0.5 }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-2xl font-bold" style={{ color }}>
            {value}
          </div>
          <div className="text-xs text-muted-foreground">Mbps</div>
        </div>
      </div>
      <div className="text-center mt-2">
        <div className="text-sm text-muted-foreground">{title}</div>
      </div>
    </div>
  );
}

function SpeedtestWidget() {
  const speedTestData = useSelector((state) => state.charts.speedTestData);

  if (!speedTestData?.download || !speedTestData?.upload) {
    return (
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle>Speed Test</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-muted-foreground p-6">
          No speed test data available.
        </CardContent>
      </Card>
    );
  }

  const formattedDate = speedTestData.timestamp
    ? new Date(speedTestData.timestamp).toLocaleString()
    : 'N/A';

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Speed Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around flex-wrap gap-6">
          <SpeedChart
            title="Download"
            value={speedTestData.download}
            color="#14b8a6"
          />
          <SpeedChart
            title="Upload"
            value={speedTestData.upload}
            color="#8b5cf6"
          />
        </div>
      </CardContent>

      <CardFooter className="text-sm text-muted-foreground">
        <div className="text-left">
          <div><strong>Server:</strong> {speedTestData.server || 'Unknown'}</div>
          <div><strong>Ping:</strong> {speedTestData.latency.toFixed(2) || 'N/A'} ms</div>
          <div><strong>Last tested:</strong> {formattedDate}</div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default SpeedtestWidget;