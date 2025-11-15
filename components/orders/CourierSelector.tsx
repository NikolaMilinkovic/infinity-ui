import { forwardRef, useContext, useImperativeHandle, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGetCourierDropdownData } from '../../hooks/couriers/useGetCourierDropdownItems';
import { useGetDefaultCourierData } from '../../hooks/couriers/useGetDefaultCourierData';
import { useExpandAnimation } from '../../hooks/useExpand';
import { NewOrderContext } from '../../store/new-order-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import Button from '../../util-components/Button';
import DropdownList from '../../util-components/DropdownList';

interface PropTypes {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  onNext: () => void;
  defaultValueByMatch?: string;
  courierSelectorRef?: any;
}

const CourierSelector = forwardRef(
  ({ isExpanded, setIsExpanded, onNext, defaultValueByMatch = 'Bex', courierSelectorRef }: PropTypes, ref) => {
    const orderCtx = useContext(NewOrderContext);
    const dropdownData = useGetCourierDropdownData();
    const toggleExpandAnimation = useExpandAnimation(isExpanded, 0, 108, 180);
    const defaultCourierData = useGetDefaultCourierData();
    const [resetDropdownCounter, setResetDropdownCounter] = useState(0);
    const colors = useThemeColors();
    const styles = getStyles(colors);

    // Expose reset method to parent
    useImperativeHandle(ref, () => ({
      resetDropdown: () => {
        setResetDropdownCounter((prev) => prev + 1);

        if (defaultCourierData) {
          orderCtx.setCourierData(defaultCourierData);
        }
      },
    }));

    return (
      <Animated.ScrollView>
        {/* TOGGLE BUTTON */}
        <Pressable onPress={() => setIsExpanded(!isExpanded)} style={styles.headerContainer}>
          <Text style={styles.header}>Izbor Kurira</Text>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            style={styles.iconStyle}
            size={26}
            color={colors.whiteText}
          />
        </Pressable>

        <Animated.ScrollView style={[styles.container, { height: toggleExpandAnimation }]}>
          {dropdownData && (
            <DropdownList
              data={dropdownData}
              onSelect={orderCtx.setCourierData}
              isDefaultValueOn={true}
              placeholder="Izaberite kurira za dostavu"
              defaultValue={defaultCourierData?.name || ''}
              reference={courierSelectorRef}
              key={resetDropdownCounter}
            />
          )}
          {/* <DropdownList2
            key={resetDropdownCounter}
            data={dropdownData}
            value={orderCtx.courierData || defaultCourierData || null}
            placeholder="Izaberite kurira za dostavu"
            onChange={orderCtx.setCourierData}
            labelField="name"
            valueField="name"
            containerStyle={{ marginTop: 4 }}
            reference={courierSelectorRef}
          /> */}
          <Button
            backColor={colors.buttonHighlight1}
            backColor1={colors.buttonHighlight2}
            textColor={colors.highlightText}
            containerStyles={{ marginBottom: 6, marginTop: 6 }}
            onPress={onNext}
          >
            Dalje
          </Button>
        </Animated.ScrollView>
      </Animated.ScrollView>
    );
  }
);

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    headerContainer: {
      padding: 10,
      borderRadius: 4,
      borderWidth: 0,
      borderColor: colors.borderColor,
      backgroundColor: colors.accordionHeaderBackground,
      marginBottom: 6,
      flexDirection: 'row',
    },
    iconStyle: {
      marginLeft: 'auto',
    },
    header: {
      fontSize: 14,
      alignSelf: 'center',
      color: colors.whiteText,
      fontFamily: 'HelveticaNeue-Bold',
      textAlign: 'center',
      flex: 1,
    },
    container: { paddingHorizontal: 8 },
  });
}
export default CourierSelector;
