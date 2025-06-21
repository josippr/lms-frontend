import React from 'react';
import { useTheme } from '../../context/themeProvider.jsx';
function MetricsPage() {

  const { theme } = useTheme();

  return (
    <div className={`${theme} text-foreground bg-background w-full h-full`}>
      <h1>Metrics Page</h1>
    </div>
  );
}

export default MetricsPage;