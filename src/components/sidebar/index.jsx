import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/themeProvider.jsx';

const Sidebar = () => {

  const routes = useSelector((state) => state.profile.routes);
  const { theme } = useTheme();

  return(
    <nav className={`${theme} text-foreground bg-background w-[250px] h-full bg-white-800 flex flex-col gap-2 p-4  `}>
      <ul>
        {Array.isArray(routes) && routes.length > 0 ? (
          routes.map((route, index) => {
            const path = route === "home" ? "/" : `/${route}`;
            return (
              <li key={`${path}-${index}`}>
                <Link to={path} className="sidebar-link text-black">
                  {route}
                </Link>
              </li>
            );
          })
        ) : (
          <li>No routes available</li>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;