import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalStyles } from '../constants/globalStyles';
import { ThemeColors, useThemeColors } from '../store/theme-context';
import TestMultipleDropdownList from './TestMultiDropdownList';

// React Native Dropdown Select List Documentation
// https://www.npmjs.com/package/react-native-dropdown-select-list
interface DataTypes {
  key: string | number;
  value: string | number;
}

interface DropdownPropTypes {
  data: DataTypes[];
  setSelected: (selectedData: any) => void;
  isOpen?: boolean;
  label?: string;
  placeholder?: string;
  dropdownStyles?: any;
  containerStyles?: any;
  defaultOption?: any;
  defaultValues?: any;
  search?: boolean;
}

export default function MultiDropdownList({
  data,
  setSelected,
  isOpen = false,
  label,
  placeholder = 'Izaberi iz liste',
  dropdownStyles,
  containerStyles,
  defaultOption,
  defaultValues = [],
  search = true,
}: DropdownPropTypes) {
  const [dropdownData, setDropdownData] = useState([]);
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const globalStyles = useGlobalStyles();

  useEffect(() => {
    let d = [];
    data.forEach((item) => {
      let t = {
        key: item._id,
        value: item?.name || item?.value || item?.color,
      };
      d.push(t);
    });
    setDropdownData(d);
  }, [data]);

  return (
    <View style={[styles.containerStyles, containerStyles]}>
      {dropdownData.length > 0 && (
        <TestMultipleDropdownList
          defaultValues={defaultValues}
          defaultOption={defaultOption || dropdownData[0]}
          placeholder={placeholder}
          dropdownShown={isOpen}
          setSelected={setSelected}
          data={dropdownData}
          save="value"
          label={label}
          notFoundText="Oof, ništa nije pronađeno pod tim imenom.."
          // search={false}
          searchPlaceholder="Pretraži"
          arrowicon={<Icon name={'chevron-down'} style={styles.dropdown1ButtonArrowStyle} size={18} />}
          closeicon={<Icon name={'chevron-up'} style={styles.dropdown1ButtonArrowStyle} size={18} />}
          // STYLES
          boxStyles={styles.boxStyles}
          inputStyles={[styles.inputStyles, globalStyles.fontRegular]}
          dropdownStyles={[styles.dropdownStyles, dropdownStyles]}
          dropdownItemStyles={styles.dropdownItemStyles}
          dropdownTextStyles={[styles.dropdownTextStyles, globalStyles.fontRegular]}
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
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    containerStyles: {
      marginTop: 0,
    },
    boxStyles: {
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
    },
    inputStyles: {
      fontSize: 14,
      color: colors.defaultText,
    },
    dropdownStyles: {
      backgroundColor: colors.background,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      borderRadius: 4,
      maxHeight: 200,
    },
    dropdownItemStyles: {
      backgroundColor: colors.background,
    },
    dropdownTextStyles: {
      color: colors.defaultText,
      fontSize: 14,
    },
    disabledItemStyles: {},
    disabledTextStyles: {},
    dropdown1ButtonArrowStyle: {
      alignSelf: 'center',
      justifyContent: 'center',
      color: colors.defaultText,
      height: 20,
      width: 20,
    },
    disabledCheckBoxStyles: {},
    checkBoxStyles: {
      borderColor: colors.borderColor,
    },
    badgeStyles: {
      backgroundColor: colors.secondaryHighlight,
    },
    badgeTextStyles: {
      color: colors.highlight,
    },
    labelStyles: {
      color: colors.highlightText,
      borderBottomColor: colors.borderColor,
      borderBottomWidth: 0.5,
    },
  });
}
