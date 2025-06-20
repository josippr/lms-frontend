import { useTheme } from '../../context/themeProvider';
function Home() {

  const { theme } = useTheme();

  return (
    <div className={`${theme} text-foreground bg-background w-full h-full`}>
      <h1>Home</h1>
    </div>
  );
}

export default Home;