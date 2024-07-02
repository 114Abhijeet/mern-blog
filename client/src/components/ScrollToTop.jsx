import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
//   useEffect: React's useEffect hook is used to run side-effects. In this case, it runs window.scrollTo(0, 0).
//   whenever the location changes, effectively scrolling the user to the top of the page on every route change.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;