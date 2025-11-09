import { useMemo } from 'react';
import { useUser } from '../../store/user-context';
import { useGetCourierDropdownData } from './useGetCourierDropdownItems';

export function useGetDefaultCourierData() {
  const { user } = useUser();
  const dropdownData = useGetCourierDropdownData();

  const defaultCourier = useMemo(() => {
    const courierName = user?.settings?.defaults?.courier;
    if (!courierName) return null;

    return dropdownData.find((c) => c.name === courierName) || null;
  }, [dropdownData, user?.settings?.defaults?.courier]);

  return defaultCourier;
}
