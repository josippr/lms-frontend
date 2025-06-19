import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const Sidebar = () => {

  const routes = useSelector((state) => state.profile.routes);
  console.log("Sidebar routes:", routes);

  return(
    <nav className="w-[250px] h-full bg-white-800 text-white flex flex-col gap-2 p-4">
      <ul>
        {Array.isArray(routes) && routes.length > 0 ? (
          routes.map((route, index) => {
            const path = route === "home" ? "/" : route;
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