import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ThemeColors, useThemeColors } from '../store/theme-context';

interface DropdownListProps<T> {
  data: T[];
  value: string | number | null;
  onChange: (item: T) => void;
  placeholder?: string;
  labelField?: string;
  valueField?: string;
  containerStyle?: object;
  dropdownStyle?: object;
  resetValue?: boolean;
  reference?: any;
}

function DropdownList2<T extends { [key: string]: any }>({
  data,
  value,
  onChange,
  placeholder = 'Select...',
  labelField = 'label',
  valueField = 'value',
  containerStyle,
  dropdownStyle,
  resetValue = false,
  reference,
}: DropdownListProps<T>) {
  const [selectedValue, setSelectedValue] = useState<string | number | null>(value);
  const [isFocus, setIsFocus] = useState(false);
  const colors = useThemeColors();
  const styles = getStyles(colors);

  useEffect(() => {
    if (resetValue) setSelectedValue(null);
  }, [resetValue]);

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Overlay */}
      <Modal visible={isFocus} transparent animationType="fade" onRequestClose={() => setIsFocus(false)}>
        <Pressable style={styles.overlay} onPress={() => setIsFocus(false)} />
      </Modal>

      <Dropdown
        ref={reference}
        data={data}
        labelField={labelField}
        valueField={valueField}
        value={selectedValue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setSelectedValue(item[valueField]);
          onChange(item);
          setIsFocus(false);
        }}
        placeholder={placeholder}
        style={[styles.dropdown, dropdownStyle]}
        selectedTextStyle={styles.selectedText}
        placeholderStyle={styles.placeholder}
        containerStyle={styles.dropdownContainer}
        inverted={false}
      />
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      marginVertical: 5,
    },
    dropdown: {
      borderWidth: 0.5,
      borderColor: colors.secondaryLight,
      borderRadius: 4,
      paddingHorizontal: 12,
      height: 45,
      backgroundColor: colors.white,
    },
    selectedText: {
      fontSize: 14,
      color: colors.secondaryDark,
    },
    placeholder: {
      fontSize: 14,
      color: colors.secondaryDark,
    },
    dropdownContainer: {
      borderColor: colors.secondaryLight,
      borderRadius: 4,
      elevation: 2,
      position: 'absolute',
      bottom: '50%',
      maxHeight: 400,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.65)',
    },
  });
}

export default DropdownList2;
