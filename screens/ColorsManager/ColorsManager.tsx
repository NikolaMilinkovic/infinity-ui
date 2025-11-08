import { Platform, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import AddColor from '../../components/colors/AddColor';
import EditColors from '../../components/colors/EditColors';
import { ThemeColors, useThemeColors } from '../../store/theme-context';

function ColorsManager() {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 200}
    >
      <AddColor />
      <EditColors />
    </KeyboardAvoidingView>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.containerBackground,
    },
  });
}

export default ColorsManager;
