import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradientBackground from '../components/gradients/LinearBackgroundGradient';
import { useGlobalStyles } from '../constants/globalStyles';
import { ThemeColors, useThemeColors } from '../store/theme-context';

interface DropdownPropTypes {
  data: any[];
  value?: string; // controlled selected value
  placeholder?: string;
  onSelect: (selectedItem: any) => void;
  reference?: any;
  buttonContainerStyles?: any;
  buttonTextStyles?: any;
}

const DropdownList3: React.FC<DropdownPropTypes> = ({
  data,
  value,
  placeholder,
  onSelect,
  reference,
  buttonContainerStyles,
  buttonTextStyles,
}) => {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const globalStyles = useGlobalStyles();

  if (!data || data.length === 0) return null;

  // Find selected item from value prop
  const selectedItem = data.find((el) => el.value === value || el.name === value);

  return (
    <SelectDropdown
      ref={reference}
      data={data}
      defaultValueByIndex={undefined} // ignore internal defaults
      defaultValue={undefined} // ignore internal defaults
      dropdownOverlayColor={'rgba(0, 0, 0, 0.8)'}
      onSelect={(item) => onSelect(item)}
      renderButton={() => (
        <View style={[globalStyles.border, { padding: 0.7, height: 50 }, buttonContainerStyles]}>
          <LinearGradientBackground
            color1={colors.cardBackground1}
            color2={colors.cardBackground2}
            containerStyles={styles.dropdownButtonStyle}
          >
            <Text style={[styles.dropdownButtonTxtStyle, buttonTextStyles]} numberOfLines={1}>
              {selectedItem?.name || selectedItem?.value || placeholder || 'No value'}
            </Text>
            <Icon name={'chevron-down'} style={styles.dropdown1ButtonArrowStyle} size={18} />
          </LinearGradientBackground>
        </View>
      )}
      renderItem={(item, index, isSelected) => (
        <View
          style={{
            ...styles.dropdownItemStyle,
            ...(isSelected && {
              backgroundColor: colors.dropdownSelectedBackground,
              color: colors.highlight2,
            }),
          }}
        >
          <Text style={styles.dropdownItemTxtStyle}>{item?.name || item?.value || 'ERROR'}</Text>
        </View>
      )}
      dropdownStyle={styles.dropdownMenuStyle}
      search
      searchInputStyle={styles.dropdownSearchInputStyle}
      searchInputTxtColor={colors.white}
      searchPlaceHolder={'Pretraži'}
      searchPlaceHolderColor={colors.white}
      renderSearchInputLeftIcon={() => <FontAwesome name={'search'} color={colors.white} size={18} />}
    />
  );
};

export default DropdownList3;

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    dropdownButtonStyle: {
      height: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 22,
      marginTop: 0,
      backgroundColor: colors.background,
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 14,
      color: colors.defaultText,
    },
    dropdownMenuStyle: {
      backgroundColor: colors.background,
      maxHeight: 250,
      borderRadius: 4,
    },
    dropdownSearchInputStyle: {
      backgroundColor: colors.dropdownSearchBackground,
      borderRadius: 4,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.borderColor,
    },
    dropdownItemStyle: {
      minWidth: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 12,
      backgroundColor: colors.background,
      marginBottom: 2,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 14,
      fontWeight: '400',
      color: colors.defaultText,
      textAlign: 'center',
    },
    dropdown1ButtonArrowStyle: {
      alignSelf: 'center',
      justifyContent: 'center',
      color: colors.defaultText,
      height: 20,
      width: 20,
    },
  });
}
