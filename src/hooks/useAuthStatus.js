import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsLoggedIn } from "../redux/actions/general";

export const useAuthStatus = () => {
  const dispatch = useDispatch();
  const isLoggedInRedux = useSelector((state) => state.general.isLoggedIn);
  const [isLocalLoggedIn, setLocalIsLoggedIn] = useState(() => {
    return isLoggedInRedux || localStorage.getItem('token') !== null;
  });

  useEffect(() => {
    const syncAuthStatus = () => {
      const tokenPresent = localStorage.getItem('token') !== null;

      if (tokenPresent && !isLoggedInRedux) {
        dispatch(setIsLoggedIn(true));
      }

      setLocalIsLoggedIn(isLoggedInRedux || tokenPresent);
    };

    syncAuthStatus();

    const handleStorageChange = () => {
      syncAuthStatus();
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isLoggedInRedux, dispatch]);

  return isLocalLoggedIn;
};
