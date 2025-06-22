import { useTheme } from '../../context/themeProvider';
import { useTranslation } from "react-i18next";

function Home() {

  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <div className={`${theme} text-foreground bg-background w-full h-full`}>
      <h1>{t("home.title")}</h1>
    </div>
  );
}

export default Home;