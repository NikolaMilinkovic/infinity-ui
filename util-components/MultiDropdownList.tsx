import { useEffect, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, Keyboard, View, Pressable } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import { Colors } from '../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// React Native Dropdown Select List Documentation
// https://www.npmjs.com/package/react-native-dropdown-select-list

interface DropdownPropTypes {
  data: any[]
  setSelected: (selectedData:any) => void
  isOpen: boolean
  label: string,
  placeholder: string
}

export default function MultiDropdownList({
  data,
  setSelected,
  isOpen,
  label,
  placeholder='Izaberi iz liste',
}:DropdownPropTypes){

  const [dropdownData, setDropdownData] = useState([])

  useEffect(() => {
    let d = [];
    data.forEach(item => {
      let t = {
        key: item._id,
        value: item?.name || item?.value
      }
      d.push(t);
    });
    setDropdownData(d);
  }, [data])

  return(
    <View style={styles.container}>
      {dropdownData.length > 0 && (
        <MultipleSelectList 
          defaultOption={dropdownData[0]}
          placeholder={placeholder}
          dropdownShown={isOpen}
          setSelected={setSelected} 
          data={dropdownData} 
          save="value"
          label={label}
          notFoundText='Oof, ništa nije pronađeno pod tim imenom..'
          searchPlaceholder='Pretraži boje'
          arrowicon={
            <Icon name={'chevron-down'} style={styles.dropdown1ButtonArrowStyle} size={18}/>
          }
          closeicon={
            <Icon name={'chevron-up'} style={styles.dropdown1ButtonArrowStyle} size={18}/>
          }

          // STYLES
          boxStyles={styles.boxStyles}
          inputStyles={styles.inputStyles}
          dropdownStyles={styles.dropdownStyles}
          dropdownItemStyles={styles.dropdownItemStyles}
          dropdownTextStyles={styles.dropdownTextStyles}
          disabledItemStyles={styles.disabledItemStyles}
          disabledTextStyles={styles.disabledTextStyles}

          disabledCheckBoxStyles={styles.disabledCheckBoxStyles}
          checkBoxStyles={styles.checkBoxStyles}
          badgeStyles={styles.badgeStyles}
          badgeTextStyles={styles.badgeTextStyles}
          labelStyles={styles.labelStyles}
        />
      )}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  boxStyles: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
  },
  inputStyles: {
    fontSize: 16
  },
  dropdownStyles: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
  },
  dropdownItemStyles: {
    backgroundColor: Colors.white,
  },
  dropdownTextStyles: {
    fontSize: 16,
  },
  disabledItemStyles: {

  },
  disabledTextStyles: {

  },
  dropdown1ButtonArrowStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: Colors.primaryDark,
    height: 20,
    width: 20,
  },
  disabledCheckBoxStyles: {
  },
  checkBoxStyles: {
    borderColor: Colors.primaryDark,
  },
  badgeStyles: {
    backgroundColor: Colors.secondaryHighlight,
  },
  badgeTextStyles: {
    color: Colors.highlight
  },
  labelStyles: {
    // color: 'white',
    // backgroundColor: 'red',
    // fontSize: 34
    color: Colors.primaryDark,
    borderBottomColor: Colors.secondaryLight,
    borderBottomWidth: 0.5
  },
});