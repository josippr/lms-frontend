import { useTheme } from '../../context/themeProvider';
import { useTranslation } from "react-i18next";
import NodeStatusChart from '../../components/dashboard/NodesStatus';
import { fetchData } from '@/service/apiService';
import { useEffect } from 'react';

import { setNodeStatus } from '@/redux/actions/charts';
import { useSelector, useDispatch } from 'react-redux';

function Home() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const nodeStatusData = useSelector((state) => state.charts.nodeStatus);

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
      dispatch(setNodeStatus(data.nodeStatusChart));
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
    <div className={`${theme} text-foreground bg-background w-full min-h-screen p-6 space-y-6`}>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <NodeStatusChart className="flex-1 min-h-[200px]" data={nodeStatusData} />
        <DummyCard className="flex-[2] min-h-[200px]">
          {t("dashboard.area_chart_placeholder")}
        </DummyCard>
      </div>

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
