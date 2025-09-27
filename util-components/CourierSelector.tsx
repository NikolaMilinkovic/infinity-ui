import React, { useContext, useEffect, useState } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { CouriersContext } from '../store/couriers-context';
import { CourierTypes } from '../types/allTsTypes';
import DropdownList from './DropdownList';

interface DropdownTypes {
  _id: string;
  name: string;
  deliveryPrice: number;
}
interface CourierSelectorPropTypes {
  setSelectedCourier: (courier: CourierTypes) => void;
  style?: StyleProp<ViewStyle>;
  defaultValueByMatch: string;
}
/**
 *
 * @param setSelectedCourier - Set method, sets the selected courier
 * @param style - Styles for the selector
 * @param defaultValueByMatch - Matches the provided string with all couriers to find a match in name / value, then sets this courier as a default
 * @returns
 */
function CourierSelector({ setSelectedCourier, style, defaultValueByMatch }: CourierSelectorPropTypes) {
  const couriersCtx = useContext(CouriersContext);
  const [dropdownData, setDropdownData] = useState<DropdownTypes[]>([]);
  useEffect(() => {
    const dropdownData = couriersCtx.couriers.map((courier) => ({
      _id: courier._id,
      name: courier.name,
      deliveryPrice: courier.deliveryPrice,
    }));
    setDropdownData(dropdownData);
  }, [couriersCtx.couriers, setDropdownData]);

  return (
    <DropdownList
      data={dropdownData}
      onSelect={setSelectedCourier}
      isDefaultValueOn={true}
      placeholder="Izaberite kurira za dostavu"
      defaultValueByIndex={1}
      buttonContainerStyles={style}
      defaultValue={defaultValueByMatch}
    />
  );
}

export default CourierSelector;
