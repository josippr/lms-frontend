import React, { useEffect, useState } from 'react';
import { fetchAlerts } from '@/service/apiService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const uid = useSelector((state) => state.profile.linkedNodes[0]);


  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const data = await fetchAlerts(token, uid);
        console.log("Fetched alerts:", data);
        setAlerts(data);
      } catch (err) {
        setError('Failed to load alerts.');
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, [token, uid]);

  return (
    <div className="p-6 space-y-6 w-full mx-auto">
      <h1 className="text-3xl font-bold">Unresolved Alerts</h1>

      {loading && (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-24 rounded-xl" />
        </div>
      )}

      {!loading && error && (
        <div className="text-red-500 text-sm font-medium">{error}</div>
      )}

      {!loading && !error && alerts.length === 0 && (
        <div className="text-muted-foreground">No unresolved alerts found.</div>
      )}

      {!loading && alerts.length > 0 && (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <Card key={alert._id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="text-yellow-500 w-5 h-5" />
                  {alert.alert?.type || 'Unknown Alert'}
                </CardTitle>
                <Badge variant="destructive">Unresolved</Badge>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p><strong>Source:</strong> {alert.alert?.source}</p>
                <p><strong>Scan type:</strong> {alert.alert?.method}</p>
                <p><strong>Protocols:</strong> {alert.alert?.protocols?.length} scanned</p>
                <p><strong>Ports:</strong> {alert.alert?.ports?.length} scanned</p>
                <p><strong>Timestamp:</strong> {format(new Date(alert.timestamp), 'yyyy-MM-dd HH:mm:ss')}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
