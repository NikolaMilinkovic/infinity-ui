import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGetAppColors } from '../constants/useGetAppColors';
import { AppColors } from '../types/allTsTypes';

// GitHub Repo & Documentation | Examples
// https://github.com/AdelRedaa97/react-native-select-dropdown/tree/master

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
  const styles = getStyles(useGetAppColors());
  const [dropdownData, setDropdownData] = useState<any[]>([]);
  const [defaultVal, setDefaultVal] = useState(['']);
  const Colors = useGetAppColors();
  useEffect(() => {
    setDropdownData(data || []);

    if (!isDefaultValueOn) return setDefaultVal([]);
    // Looks for value from the data
    // If value is found > set that object as default & give onSelect that object
    let defaultDataObject;
    data.forEach((element) => {
      if (element?.name === defaultValue) {
        defaultDataObject = element;
        onSelect(element);
      }
      if (element?.value === defaultValue) {
        defaultDataObject = element;
        onSelect(element);
      }
    });
    setDefaultVal(defaultDataObject || []);
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
        onSelect={(selectedItem, index) => {
          onSelect(selectedItem);
        }}
        // BUTTON
        renderButton={(selectedItem, isOpen) => {
          return (
            <View style={[styles.dropdownButtonStyle, buttonContainerStyles]}>
              <Text style={[styles.dropdownButtonTxtStyle, buttonTextStyles]}>
                {selectedItem?.name || selectedItem?.value || placeholder || 'No placeholder value provided'}
              </Text>
              <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} style={styles.dropdown1ButtonArrowStyle} size={18} />
            </View>
          );
        }}
        // ITEMS
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: Colors.dropdownSelectedBackground, color: Colors.highlight }),
              }}
            >
              {/* <Text>{index + 1}</Text> */}
              <Text style={styles.dropdownItemTxtStyle}>{item?.name || item?.value || 'ERROR'}</Text>
            </View>
          );
        }}
        dropdownStyle={styles.dropdownMenuStyle}
        search
        searchInputStyle={styles.dropdownSearchInputStyle}
        searchInputTxtColor={Colors.whiteText}
        searchPlaceHolder={'Pretraži'}
        searchPlaceHolderColor={Colors.whiteText}
        renderSearchInputLeftIcon={() => {
          return <FontAwesome name={'search'} color={Colors.whiteText} size={18} />;
        }}
      />
    );
  }
};

export default DropdownList;

function getStyles(Colors: AppColors) {
  return StyleSheet.create({
    dropdownButtonStyle: {
      height: 50,
      borderRadius: 4,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 22,
      borderWidth: 0.5,
      borderColor: Colors.primaryDark,
      marginTop: 0,
      backgroundColor: Colors.white,
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 16,
      color: Colors.primaryDark,
    },
    dropdownMenuStyle: {
      backgroundColor: Colors.primaryLight,
      borderRadius: 4,
      maxHeight: 250,
    },
    dropdownSearchInputStyle: {
      backgroundColor: Colors.primaryDark,
      borderRadius: 4,
      borderBottomWidth: 1,
      borderBottomColor: Colors.borders,
    },
    dropdownItemStyle: {
      width: '100%',
      flexDirection: 'row',
      paddingHorizontal: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors.secondaryLight,
      backgroundColor: Colors.primaryLight,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: '400',
      color: Colors.defaultText,
      textAlign: 'center',
    },
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
    dropdown1ButtonArrowStyle: {
      alignSelf: 'center',
      justifyContent: 'center',
      color: Colors.defaultText,
      height: 20,
      width: 20,
    },
  });
}
