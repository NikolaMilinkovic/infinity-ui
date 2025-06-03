import React, { useContext, useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../constants/colors';
import { useExpandAnimation } from '../../hooks/useExpand';
import { CouriersContext } from '../../store/couriers-context';
import { NewOrderContext } from '../../store/new-order-context';
import { UserContext } from '../../store/user-context';
import Button from '../../util-components/Button';
import DropdownList from '../../util-components/DropdownList';

interface PropTypes {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  onNext: () => void;
  defaultValueByMatch: string;
}
interface DropdownTypes {
  _id: string;
  name: string;
  deliveryPrice: number;
}

function CourierSelector({ isExpanded, setIsExpanded, onNext, defaultValueByMatch = 'Bex' }: PropTypes) {
  const userCtx = useContext(UserContext);
  const couriersCtx = useContext(CouriersContext);
  const orderCtx = useContext(NewOrderContext);
  const [dropdownData, setDropdownData] = useState<DropdownTypes[]>([]);
  const toggleExpandAnimation = useExpandAnimation(isExpanded, 0, 107, 180);

  useEffect(() => {
    const dropdownData = couriersCtx.couriers.map((courier) => ({
      _id: courier._id,
      name: courier.name,
      deliveryPrice: courier.deliveryPrice,
    }));
    setDropdownData(dropdownData);
  }, [couriersCtx.couriers, setDropdownData]);

  return (
    <Animated.ScrollView>
      {/* TOGGLE BUTTON */}
      <Pressable onPress={() => setIsExpanded(!isExpanded)} style={styles.headerContainer}>
        <Text style={styles.header}>Izbor Kurira</Text>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          style={styles.iconStyle}
          size={26}
          color={Colors.white}
        />
      </Pressable>

      <Animated.ScrollView style={[styles.container, { height: toggleExpandAnimation }]}>
        <DropdownList
          data={dropdownData}
          onSelect={orderCtx.setCourierData}
          isDefaultValueOn={true}
          placeholder="Izaberite kurira za dostavu"
          defaultValue={userCtx?.settings?.defaults?.courier || defaultValueByMatch}
        />
        {/* ON NEXT BUTTON */}
        <Button
          backColor={Colors.highlight}
          textColor={Colors.white}
          containerStyles={{ marginBottom: 6, marginTop: 6 }}
          onPress={onNext}
        >
          Dalje
        </Button>
      </Animated.ScrollView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.secondaryDark,
    marginBottom: 6,
    flexDirection: 'row',
  },
  iconStyle: {
    marginLeft: 'auto',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  container: {
    paddingHorizontal: 8,
  },
});

export default CourierSelector;
