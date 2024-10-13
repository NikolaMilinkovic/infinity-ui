import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// GitHub Repo & Documentation | Examples
// https://github.com/AdelRedaa97/react-native-select-dropdown/tree/master

interface DropdownPropTypes{
  data: any[],
  placeholder: string,
  onSelect: (selectedItem: any) => void,
  defaultValue?: any
  reference?: any
}

const DropdownList = ({ 
  data,
  placeholder,
  onSelect,
  defaultValue,
  reference
 }: DropdownPropTypes) => {
  
  const [dropdownData, setDropdownData] = useState<any[]>([]);
  const [defaultVal, setDefaultVal] = useState(['']);
  useEffect(() => {
    setDropdownData(data || []);

    // Looks for value from the data
    // If value is found > set that object as default & give onSelect that object
    let defaultDataObject;
    data.forEach(element => {
      if(element?.name === defaultValue){
        defaultDataObject = element;
        onSelect(element);
      }
      if(element?.value === defaultValue){
        defaultDataObject = element;
        onSelect(element);
      }
    });
    setDefaultVal(defaultDataObject || []);
  }, [data, defaultValue])

  if(dropdownData.length > 0){
    return (
      <SelectDropdown
        ref={reference}
        data={dropdownData}
        // defaultValueByIndex={0} // use default value by index or default value
        defaultValue={defaultVal} // use default value by index or default value
  
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
  }
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
    marginTop: 4,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 16,
    color: Colors.primaryDark,
  },
  dropdownMenuStyle: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    maxHeight: 250,
  },
  dropdownSearchInputStyle: {
    backgroundColor: Colors.secondaryDark,
    borderRadius: 4,
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