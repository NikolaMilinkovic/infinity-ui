import { Pressable, StyleSheet, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../store/theme-context';
import CustomText from './CustomText';

interface CustomCheckboxPropTypes {
  label: string;
  checked: boolean;
  onCheckedChange: (newState: boolean) => void;
  containerStyles?: object | object[];
  customColor?: string;
  checkColor?: string;
}

const CustomCheckbox = ({
  label,
  checked,
  onCheckedChange,
  containerStyles,
  customColor,
  checkColor,
}: CustomCheckboxPropTypes) => {
  const colors = useThemeColors();
  const styles = getStyles(colors);
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
  const lightColor = checkColor ? getLightColor(checkColor, 0.75) : colors.primaryDark;

  return (
    <Pressable style={[styles.checkboxContainer, containerStyles]} onPress={onPressHandler}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked, checkColor && { borderColor: checkColor }]}>
        {checked && <View style={[styles.checkboxTick, checkColor && { backgroundColor: lightColor }]} />}
      </View>
      <CustomText style={[styles.label, customColor && { color: customColor }]}>{label}</CustomText>
    </Pressable>
  );
};

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 6,
      overflow: 'hidden',
    },
    checkbox: {
      height: 24,
      width: 24,
      borderWidth: 2,
      borderColor: colors.borderColor,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      borderRadius: 50,
    },
    checkboxChecked: {
      backgroundColor: colors.background1,
    },
    checkboxTick: {
      width: 15,
      height: 15,
      backgroundColor: colors.highlight,
      borderRadius: 50,
    },
    label: {
      fontSize: 14,
      color: colors.defaultText,
    },
  });
}

export default CustomCheckbox;
