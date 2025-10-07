import { useContext, useMemo } from 'react';
import { UserContext } from '../../store/user-context';
import { useGetCourierDropdownData } from './useGetCourierDropdownItems';

export function useGetDefaultCourierData() {
  const userCtx = useContext(UserContext);
  const dropdownData = useGetCourierDropdownData();

  const defaultCourier = useMemo(() => {
    const courierName = userCtx?.settings?.defaults?.courier;
    if (!courierName) return null;

    return dropdownData.find((c) => c.name === courierName) || null;
  }, [dropdownData, userCtx?.settings?.defaults?.courier]);

  return defaultCourier;
}
