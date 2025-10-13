import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';

interface CustomCheckboxPropTypes {
  label: string;
  checked: boolean;
  onCheckedChange: (newState: boolean) => void;
  containerStyles?: object | object[];
  customColor?: string;
}

const CustomCheckbox = ({ label, checked, onCheckedChange, containerStyles, customColor }: CustomCheckboxPropTypes) => {
  function onPressHandler() {
    const newCheckedState = !checked;
    onCheckedChange(newCheckedState);
  }

  // Custom color but ligter for check
  const getLightColor = (hexColor: string, opacity = 0.3) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  };
  const lightColor = customColor ? getLightColor(customColor, 0.4) : Colors.primaryDark;

  return (
    <Pressable style={[styles.checkboxContainer, containerStyles]} onPress={onPressHandler}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked, customColor && { borderColor: customColor }]}>
        {checked && <View style={[styles.checkboxTick, customColor && { backgroundColor: lightColor }]} />}
      </View>
      <Text style={[styles.label, customColor && { color: customColor }]}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  checkbox: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 50,
  },
  checkboxChecked: {
    backgroundColor: Colors.white,
  },
  checkboxTick: {
    width: 15,
    height: 15,
    backgroundColor: Colors.highlight,
    borderRadius: 50,
  },
  label: {
    fontSize: 16,
    color: Colors.primaryDark,
  },
});

export default CustomCheckbox;
