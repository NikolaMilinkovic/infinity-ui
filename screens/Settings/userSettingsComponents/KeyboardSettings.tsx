import { useEffect } from 'react';
import { Platform, StyleSheet, Switch, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { useUser } from '../../../store/user-context';
import CustomText from '../../../util-components/CustomText';
import { betterConsoleLog } from '../../../util-methods/LogMethods';

function KeyboardSettings() {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const { user, updateUser } = useUser();

  useEffect(() => {
    betterConsoleLog('> Showing toolbar?', user?.settings?.ui.displayKeyboardToolbar);
  }, [user]);

  async function toggleShowKeyboardToolbar() {
    updateUser('displayKeyboardToolbar', !user?.settings?.ui.displayKeyboardToolbar);
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <CustomText style={styles.text}>Prikaži dodatne kontrole pri unosu teksta?</CustomText>
      <Switch
        value={user?.settings?.ui?.displayKeyboardToolbar}
        onValueChange={toggleShowKeyboardToolbar}
        trackColor={{ false: colors.grayText, true: colors.highlight }}
        thumbColor={colors.thumbColor}
        style={styles.switch}
      />
    </View>
  );
}

export default KeyboardSettings;

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    text: {
      fontSize: 14,
      color: colors.secondaryText,
    },
    switch: {
      marginLeft: 'auto',
      transform: Platform.select({
        ios: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        android: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
      }),
    },
  });
}
