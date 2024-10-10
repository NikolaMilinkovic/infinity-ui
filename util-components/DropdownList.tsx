import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface DropdownPropTypes{
  data: any[],
  placeholder: string,
  onSelect: (selectedItem: any) => void,
}

const DropdownList = ({ 
  data,
  placeholder,
  onSelect
 }: DropdownPropTypes) => {
  const [dropdownData, setDropdownData] = useState<any[]>([]);
  useEffect(() => {
    setDropdownData(data || []);
  }, [data])

  return (
    <SelectDropdown
      data={dropdownData}
      defaultValueByIndex={0} // use default value by index or default value
      // defaultValue={'TEST'} // use default value by index or default value

      // WHEN SELECTED
      onSelect={(selectedItem, index) => {
        onSelect(selectedItem);
      }}

      // BUTTON
      renderButton={(selectedItem, isOpen) => {
        return (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>{selectedItem?.name || selectedItem?.value || placeholder || 'No placeholder value provided'}</Text>
            <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} style={styles.dropdown1ButtonArrowStyle} size={18}/>
          </View>
        );
      }}

      // ITEMS
      renderItem={(item, index, isSelected) => {
        return (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && {backgroundColor: Colors.secondaryHighlight, color: Colors.highlight}),
            }}>
              {/* <Text>{index + 1}</Text> */}
            <Text style={styles.dropdownItemTxtStyle}>{item?.name || item?.value || 'ERROR'}</Text>
          </View>
        );
      }}
      dropdownStyle={styles.dropdownMenuStyle}
      search
      searchInputStyle={styles.dropdownSearchInputStyle}
      searchInputTxtColor={Colors.primaryLight}
      searchPlaceHolder={'Pretraži'}
      searchPlaceHolderColor={Colors.secondaryLight}
      renderSearchInputLeftIcon={() => {
        return <FontAwesome name={'search'} color={Colors.secondaryLight} size={18} />;
      }}
    />
  );
};

export default DropdownList;

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    height: 50,
    backgroundColor: Colors.white,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    color: Colors.primaryDark,
  },
  dropdownMenuStyle: {
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  dropdownSearchInputStyle: {
    backgroundColor: Colors.secondaryDark,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondaryLight,
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
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.primaryDark,
    textAlign: 'center',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdown1ButtonArrowStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: Colors.primaryDark,
    height: 20,
    width: 20,
  }
});