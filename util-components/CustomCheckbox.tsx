import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const CustomCheckbox = ({ label, checked, onCheckedChange }) => {
  function onPressHandler() {
    const newCheckedState = !checked; // Toggle the checked state
    onCheckedChange(newCheckedState); // Call the onCheckedChange function
  }

  return (
    <Pressable style={styles.checkboxContainer} onPress={onPressHandler}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <View style={styles.checkboxTick} />}
      </View>
      <Text style={styles.label}>{label}</Text>
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
    width: 12,
    height: 12,
    backgroundColor: Colors.primaryDark,
    borderRadius: 50,
  },
  label: {
    fontSize: 16,
    color: Colors.primaryDark,
  },
});

export default CustomCheckbox;
