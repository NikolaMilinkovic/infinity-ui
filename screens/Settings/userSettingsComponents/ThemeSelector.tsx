import { Platform, StyleSheet, Switch, View } from 'react-native';
import useTextForActiveLanguage from '../../../hooks/useTextForActiveLanguage';
import { ThemeColors, useTheme, useThemeColors } from '../../../store/theme-context';
import { useTransitions } from '../../../store/transitions-context';
import CustomText from '../../../util-components/CustomText';

function ThemeSelector({ updateDefault }: { updateDefault: (field: string, value: any) => void }) {
  const text = useTextForActiveLanguage('settings');
  const { triggerTransition } = useTransitions();
  const colors = useThemeColors();
  const themeContext = useTheme();
  const styles = getStyles(colors);

  async function toggleTheme() {
    const newTheme = themeContext.theme === 'light' ? 'dark' : 'light';
    updateDefault('theme', newTheme);
    themeContext.setTheme(newTheme);
    if (themeContext.theme === 'light') {
      triggerTransition('dark', 2300);
    } else {
      triggerTransition('light', 2300);
    }
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <CustomText style={styles.text}>{text.theme_description}</CustomText>
      <Switch
        value={themeContext.theme === 'dark'}
        onValueChange={toggleTheme}
        trackColor={{ false: colors.white, true: colors.grayText }}
        thumbColor={colors.thumbColor}
        style={styles.switch}
      />
    </View>
  );
}

export default ThemeSelector;

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    text: {
      fontSize: 14,
      color: colors.defaultText,
    },
    switch: {
      marginLeft: 'auto',
      transform: Platform.select({
        ios: [{ scaleX: 0.8 }, { scaleY: 0.8 }], // Make iOS switch smaller
        android: [{ scaleX: 1.1 }, { scaleY: 1.1 }], // Make Android switch bigger
      }),
    },
  });
}
