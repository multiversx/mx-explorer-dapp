import { matchPath, useLocation } from 'react-router-dom';

const useMatchPath = () => {
  const { pathname } = useLocation();

  return (path: string) =>
    matchPath(pathname, {
      path,
      exact: true,
      strict: false,
    });
};

export default useMatchPath;
