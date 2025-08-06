import { useTheme } from '../../context/themeProvider';
import { useTranslation } from "react-i18next";
import NodeStatusChart from '../../components/dashboard/NodesStatus';
import ChartRadialSimple from '../../components/dashboard/networkStatus/index.jsx';
import NetworkUsageChart from '@/components/dashboard/networkUsage';
import ActiveDevicesChart from '@/components/dashboard/activeDevicesWidget';
import SpeedtestWidget from '@/components/dashboard/speedtestWidget';
import MapWidget from '@/components/dashboard/mapWidget';

import { fetchData, fetchNodes, fetchProfile } from '@/service/apiService';
import { useEffect, useState } from 'react';

import { setNodeStatus, setNetworkStatus, setNetworkUsage, setActiveDevicesWidget, setSpeedTestData } from '@/redux/actions/charts';
import { setNodeData } from '@/redux/actions/nodes';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from '@/components/ui/card';

function Home() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const nodeStatusData = useSelector((state) => state.charts.nodeStatus[0]);
  const networkStatusData = useSelector((state) => state.charts.networkStatus);
  const networkUsageData = useSelector((state) => state.charts.networkUsage);

  const profile = useSelector((state) => state.profile ?? null);
  const latlong = useSelector((state) => state.nodes?.data[0]?.latlong);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchDataAndLog(token);
    } else {
      console.warn('No token found in localStorage');
    }
  }, []);

  const fetchDataAndLog = async (token) => {
    try {
      const data = await fetchData(token);

      if(!profile) {
        fetchProfile(token);
      }
      const nodes = await fetchNodes(token, profile?.linkedNodes[0]);
      dispatch(setNodeData(nodes));

      console.log('Fetched data:', data);
      dispatch(setNodeStatus(data.nodeStatusChart));
      dispatch(setNetworkStatus(data.networkStatusChart));
      dispatch(setNetworkUsage(data.networkUsageChart));
      dispatch(setActiveDevicesWidget(data.activeDevicesChart));
      dispatch(setSpeedTestData(data.speedtestChart));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const DummyCard = ({ className = "", children }) => (
    <div className={`bg-muted text-foreground p-4 rounded-xl shadow-sm ${className}`}>
      {children || (
        <div className="h-24 bg-muted-foreground/10 rounded-md animate-pulse" />
      )}
    </div>
  );

  return (
    <div className={`${theme} text-foreground bg-background w-full min-h-screen p-4 sm:p-6 space-y-6 overflow-auto`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-6">
          <NodeStatusChart className="w-full min-w-0 min-h-[200px]" data={nodeStatusData} />
          <ChartRadialSimple className="w-full min-w-0 min-h-[200px]" />
        </div>
        <NetworkUsageChart className="w-full min-h-[200px] h-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpeedtestWidget className="w-full min-h-[200px] h-full" />
        <div className="grid grid-cols-2 gap-6">
          <ActiveDevicesChart className="w-full min-w-0 min-h-[200px]" />
          <Card className="w-full h-full p-0 overflow-hidden">
            <MapWidget className="w-full min-w-0 min-h-[200px]" latlong={latlong} />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
