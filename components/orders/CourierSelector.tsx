import React, { useContext, useEffect, useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../constants/colors';
import DropdownList from '../../util-components/DropdownList';
import { CouriersContext } from '../../store/couriers-context';
import { NewOrderContext } from '../../store/new-order-context';
import { CourierTypes } from '../../types/allTsTypes';
import { betterConsoleLog } from '../../util-methods/LogMethods';
import Button from '../../util-components/Button';

interface PropTypes {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  onNext: () => void
}
interface DropdownTypes {
  _id: string
  name: string
  deliveryPrice: number
}

function CourierSelector({ isExpanded, setIsExpanded, onNext }: PropTypes) {
  const toggleExpandAnimation = useRef(new Animated.Value(isExpanded ? 0 : 107)).current;
  const couriersCtx = useContext(CouriersContext);
  const orderCtx = useContext(NewOrderContext);
  const [dropdownData, setDropdownData] = useState<DropdownTypes[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<CourierTypes>();

  useEffect(() => {
    orderCtx.setCourierData(selectedCourier);
  }, [selectedCourier])


  // EXPAND ANIMATION
  useEffect(() => {
    Animated.timing(toggleExpandAnimation, {
      toValue: isExpanded ? 107 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, toggleExpandAnimation ]);

  useEffect(() => {
    let couriers: DropdownTypes[] = [];
    couriersCtx.couriers.forEach(courier => {
      const t = {
        _id: courier._id,
        name: courier.name,
        deliveryPrice: courier.deliveryPrice
      }
      couriers.push(t);
    });
    setDropdownData(couriers)
  }, [couriersCtx.couriers, setDropdownData])

  return (
    <Animated.ScrollView>
      {/* TOGGLE BUTTON */}
      <Pressable onPress={() => setIsExpanded(!isExpanded)} style={styles.headerContainer}>
        <Text style={styles.header}>Izbor Kurira</Text>
        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} style={styles.iconStyle} size={26} color={Colors.white}/>
      </Pressable>

      <Animated.ScrollView style={[styles.container,{height: toggleExpandAnimation}]}>
        <DropdownList
          data={dropdownData}
          onSelect={setSelectedCourier}
          isDefaultValueOn={true}
          placeholder='Izaberite kurira za dostavu'
          defaultValueByIndex={1}
        />
        {/* ON NEXT BUTTON */}
        <Button
          backColor={Colors.highlight}
          textColor={Colors.white}
          containerStyles={{marginBottom: 6, marginTop: 6}}
          onPress={onNext}
        >
          Dalje
        </Button>
      </Animated.ScrollView>
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.secondaryDark,
    marginBottom: 6,
    flexDirection: 'row'
  },
  iconStyle: {
    marginLeft:'auto'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white
  },
  container: {
    paddingHorizontal: 8,
  },
})

export default CourierSelector