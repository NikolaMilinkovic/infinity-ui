import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeColors, useThemeColors } from '../store/theme-context';

interface PropTypes {
  isExpanded: boolean;
  handleToggleExpand: () => void;
  containerStyles?: StyleProp<ViewStyle>;
  iconStyles?: StyleProp<ViewStyle>;
  size?: number;
}

function ExpandButton({ isExpanded, handleToggleExpand, containerStyles, iconStyles, size = 24 }: PropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <Pressable style={[styles.pressable, containerStyles]} onPress={handleToggleExpand}>
      <Icon
        name={isExpanded ? 'chevron-up' : 'chevron-down'}
        style={iconStyles}
        size={size}
        color={colors.defaultText}
      />
    </Pressable>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    pressable: {
      backgroundColor: colors.background,
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      alignItems: 'center',
      justifyContent: 'center',
      width: 30,
      height: 30,
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
    },
  });
}

export default ExpandButton;
