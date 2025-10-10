import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Colors } from '../constants/colors';

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

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  dropdown: {
    borderWidth: 0.5,
    borderColor: Colors.secondaryLight,
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 45,
    backgroundColor: Colors.white,
  },
  selectedText: {
    fontSize: 14,
    color: Colors.secondaryDark,
  },
  placeholder: {
    fontSize: 14,
    color: Colors.secondaryDark,
  },
  dropdownContainer: {
    borderColor: Colors.secondaryLight,
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

export default DropdownList2;
