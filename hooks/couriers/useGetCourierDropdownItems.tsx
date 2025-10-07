import { useContext, useMemo } from 'react';
import { CouriersContext } from '../../store/couriers-context';

export function useGetCourierDropdownData() {
  const { couriers } = useContext(CouriersContext);

  // memoize so it only recalculates when couriers change
  const dropdownData = useMemo(
    () =>
      couriers.map((courier) => ({
        _id: courier._id,
        name: courier.name,
        deliveryPrice: courier.deliveryPrice,
      })),
    [couriers]
  );

  return dropdownData;
}
