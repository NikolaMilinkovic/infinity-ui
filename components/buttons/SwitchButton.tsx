import { Platform, StyleSheet, Switch, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import CustomText from '../../util-components/CustomText';

interface SwitchPropTypes {
  value: boolean;
  text?: string;
  onChange: () => void;
}
export function SwitchButton({ value, text, onChange }: SwitchPropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <CustomText color={colors.defaultText} style={styles.text}>
        {text}
      </CustomText>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.grayText, true: colors.highlight }}
        thumbColor={colors.thumbColor}
        style={styles.switch}
      />
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: -10,
      flex: 1,
      justifyContent: 'space-between',
    },
    text: {
      flex: 0.8,
      color: colors.secondaryText,
    },
    switch: {
      minWidth: 50,
      transform: Platform.select({
        ios: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Make iOS switch smaller
        android: [{ scaleX: 1.1 }, { scaleY: 1.1 }], // Make Android switch bigger
      }),
    },
  });
}
