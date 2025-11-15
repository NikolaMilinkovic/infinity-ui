import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradientBackground from '../components/gradients/LinearBackgroundGradient';
import { useGlobalStyles } from '../constants/globalStyles';
import { ThemeColors, useThemeColors } from '../store/theme-context';

// GitHub Repo & Documentation | Examples
// https://github.com/AdelRedaa97/react-native-select-dropdown/tree/master

// RESET DROPDOWN VIA REF
// dropdownRef.current?.reset();
// Parent provide ref putem reference i potrebno je samo da pozovemo ovo gore

interface DropdownPropTypes {
  data: any[];
  placeholder?: string;
  onSelect: (selectedItem: any) => void;
  isDefaultValueOn?: boolean;
  defaultValue?: string;
  reference?: any;
  buttonContainerStyles?: any;
  defaultValueByIndex?: number;
  buttonTextStyles?: any;
}

const DropdownList = ({
  data,
  placeholder,
  onSelect,
  isDefaultValueOn = true,
  defaultValue,
  reference,
  buttonContainerStyles,
  defaultValueByIndex,
  buttonTextStyles,
}: DropdownPropTypes) => {
  const [dropdownData, setDropdownData] = useState<any[]>([]);
  const [defaultVal, setDefaultVal] = useState(['']);
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const globalStyles = useGlobalStyles();

  // useEffect(() => {
  //   setDropdownData(data || []);
  //   if (!isDefaultValueOn) return setDefaultVal([]);
  //   // Looks for value from the data
  //   // If value is found > set that object as default & give onSelect that object
  //   let defaultDataObject;
  //   data.forEach((element) => {
  //     if (element?.name === defaultValue) {
  //       defaultDataObject = element;
  //       onSelect(element);
  //     }
  //     if (element?.value === defaultValue) {
  //       defaultDataObject = element;
  //       onSelect(element);
  //     }
  //   });
  //   setDefaultVal(defaultDataObject || []);
  // }, [data, defaultValue]);

  useEffect(() => {
    setDropdownData(data || []);
    if (!isDefaultValueOn) return setDefaultVal([]);

    let defaultDataObject = data.find((el) => el.name === defaultValue || el.value === defaultValue);

    if (!defaultDataObject && data.length > 0) {
      if (defaultValueByIndex) {
        defaultDataObject = data[defaultValueByIndex];
      } else {
        defaultDataObject = data[0];
      }
    }

    setDefaultVal(defaultDataObject || []);
    if (defaultDataObject) {
      // Defer calling onSelect to next tick so dropdown mounts first
      setTimeout(() => {
        onSelect(defaultDataObject);
      }, 0);
    }
  }, [data, defaultValue]);

  if (dropdownData.length > 0) {
    return (
      <SelectDropdown
        ref={reference}
        data={dropdownData}
        defaultValueByIndex={defaultValueByIndex} // use default value by index or default value
        defaultValue={defaultVal} // use default value by index or default value
        dropdownOverlayColor={'rgba(0, 0, 0, 0.8)'}
        // WHEN SELECTED
        onSelect={(selectedItem) => {
          onSelect(selectedItem);
        }}
        // BUTTON
        renderButton={(selectedItem, isOpen) => {
          return (
            <View style={[globalStyles.border, { padding: 0.7, height: 50 }, buttonContainerStyles]}>
              <LinearGradientBackground
                color1={colors.cardBackground1}
                color2={colors.cardBackground2}
                containerStyles={styles.dropdownButtonStyle}
              >
                <Text
                  style={[styles.dropdownButtonTxtStyle, globalStyles.fontRegular, buttonTextStyles]}
                  numberOfLines={1}
                >
                  {selectedItem?.name || selectedItem?.value || placeholder || 'No placeholder value provided'}
                </Text>
                <Icon
                  name={isOpen ? 'chevron-up' : 'chevron-down'}
                  style={styles.dropdown1ButtonArrowStyle}
                  size={18}
                />
              </LinearGradientBackground>
            </View>
          );
        }}
        // ITEMS
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: colors.dropdownSelectedBackground, color: colors.highlight2 }),
              }}
            >
              {/* <Text>{index + 1}</Text> */}
              <Text style={[globalStyles.fontRegular, styles.dropdownItemTxtStyle]}>
                {item?.name || item?.value || 'ERROR'}
              </Text>
            </View>
          );
        }}
        dropdownStyle={styles.dropdownMenuStyle}
        search
        searchInputStyle={styles.dropdownSearchInputStyle}
        searchInputTxtColor={colors.white}
        searchPlaceHolder={'Pretraži'}
        searchPlaceHolderColor={colors.white}
        renderSearchInputLeftIcon={() => {
          return <FontAwesome name={'search'} color={colors.white} size={18} />;
        }}
      />
    );
  }
};

export default DropdownList;

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
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
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
