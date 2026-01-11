
import { useState, useEffect } from 'react';
import { DeviceMode } from '../types';

export const useDeviceMode = (): DeviceMode => {
  const [mode, setMode] = useState<DeviceMode>(DeviceMode.DASHBOARD);

  useEffect(() => {
    const checkMode = () => {
      // Mobile detection based on modern breakpoints and touch capabilities
      const isMobile = window.innerWidth < 1024;
      setMode(isMobile ? DeviceMode.OPERATOR : DeviceMode.DASHBOARD);
    };

    checkMode();
    window.addEventListener('resize', checkMode);
    return () => window.removeEventListener('resize', checkMode);
  }, []);

  return mode;
};
