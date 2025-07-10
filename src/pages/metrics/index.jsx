import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/themeProvider.jsx';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import socket from '@/lib/socket'; // socket.io-client wrapper
import { formatDistanceToNow, parseISO } from 'date-fns';

const MAX_POINTS = 30;


function MetricsPage() {

  const { theme } = useTheme();
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    socket.on('new_metric', (metric) => {

      console.log('debug Received new metric:', metric);

      setMetrics(prev => {
        const updated = [...prev, {
          ...metric,
          timestamp: new Date(metric.timestamp).toISOString()
        }];
        return updated.slice(-MAX_POINTS);
      });
    });

    return () => socket.off('new_metric');
  }, []);

  return (
    <Card className="p-4 dark:bg-muted bg-white shadow-xl rounded-2xl">
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Live Device Metrics</h3>
          {metrics.length > 0 && (
            <span className="text-sm text-muted-foreground">
              Updated {formatDistanceToNow(parseISO(metrics[metrics.length - 1].timestamp))} ago
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground text-xs">Hostname</Label>
            <div className="text-lg font-medium">{metrics.at(-1)?.hostname || '...'}</div>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">UID</Label>
            <div className="text-sm break-all">{metrics.at(-1)?.uid || '...'}</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={metrics}>
            <XAxis dataKey="timestamp" tickFormatter={time => new Date(time).toLocaleTimeString()} />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line type="monotone" dataKey="temperature" name="CPU Temp (°C)" stroke="#F87171" dot={false} />
            <Line type="monotone" dataKey="memory" name="Memory (MB)" stroke="#60A5FA" dot={false} />
            <Line type="monotone" dataKey="disk" name="Disk (MB)" stroke="#34D399" dot={false} />
            <Line type="monotone" dataKey="cpuPercent" name="CPU Usage (%)" stroke="#FBBF24" dot={false} />
            <Line type="monotone" dataKey="memoryUsed" name="RAM Used (%)" stroke="#A78BFA" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default MetricsPage;