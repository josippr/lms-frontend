import { useTheme } from '../../context/themeProvider';
import { useTranslation } from "react-i18next";
import NodeStatusChart from '../../components/dashboard/NodesStatus';
import ChartRadialSimple from '../../components/dashboard/networkStatus/index.jsx';
import { fetchData } from '@/service/apiService';
import { useEffect } from 'react';

import { setNodeStatus, setNetworkStatus } from '@/redux/actions/charts';
import { useSelector, useDispatch } from 'react-redux';

function Home() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const nodeStatusData = useSelector((state) => state.charts.nodeStatus[0]);
  const networkStatusData = useSelector((state) => state.charts.networkStatus);

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
      console.log('Fetched data:', data);
      dispatch(setNodeStatus(data.nodeStatusChart));
      dispatch(setNetworkStatus(data.networkStatusChart));
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
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <NodeStatusChart className="col-span-1 xl:col-span-1 w-full min-w-0 min-h-[200px]" data={nodeStatusData} />
        <ChartRadialSimple className="col-span-1 xl:col-span-1 w-full min-w-0 min-h-[200px]" />
        <DummyCard className="col-span-1 md:col-span-2 xl:col-span-2 min-h-[200px] w-full">
          {t("dashboard.area_chart_placeholder")}
        </DummyCard>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DummyCard>{t("dashboard.total_revenue")}</DummyCard>
        <DummyCard>{t("dashboard.new_customers")}</DummyCard>
        <DummyCard>{t("dashboard.active_accounts")}</DummyCard>
        <DummyCard>{t("dashboard.growth_rate")}</DummyCard>
      </div>
    </div>
  );
}

export default Home;
