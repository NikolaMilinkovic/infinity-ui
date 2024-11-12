import React, { useContext, useEffect, useState } from 'react'
import { CouriersContext } from '../store/couriers-context';
import DropdownList from './DropdownList';
import { CourierTypes } from '../types/allTsTypes';
import { StyleProp, ViewStyle } from 'react-native';

interface DropdownTypes {
  _id: string
  name: string
  deliveryPrice: number
}
interface CourierSelectorPropTypes {
  setSelectedCourier: (courier: CourierTypes) => void
  style?: StyleProp<ViewStyle>
}
function CourierSelector({ setSelectedCourier, style }: CourierSelectorPropTypes) {
  const couriersCtx = useContext(CouriersContext);
  const [dropdownData, setDropdownData] = useState<DropdownTypes[]>([]);
  useEffect(() => {
    const dropdownData = couriersCtx.couriers.map(courier => ({
      _id: courier._id,
      name: courier.name,
      deliveryPrice: courier.deliveryPrice
    }));
    setDropdownData(dropdownData)
  }, [couriersCtx.couriers, setDropdownData])

  return (
    <DropdownList
      data={dropdownData}
      onSelect={setSelectedCourier}
      isDefaultValueOn={true}
      placeholder='Izaberite kurira za dostavu'
      defaultValueByIndex={1}
      buttonContainerStyles={style}
    />
  )
}

export default CourierSelector