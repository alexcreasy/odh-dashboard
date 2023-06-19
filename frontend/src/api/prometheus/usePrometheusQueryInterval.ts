import React from 'react';

const usePrometheusQueryInterval = (refreshInterval, callback: () => void) => {
  const timer = React.useRef<ReturnType<typeof setInterval>>();

  React.useEffect(() => {
    timer.current = setInterval(callback, refreshInterval);
    return () => clearInterval(timer.current);
  }, [callback, refreshInterval]);

  return React.useCallback(() => {
    callback();
    clearInterval(timer.current);
  }, [callback]);
};
export default usePrometheusQueryInterval;
