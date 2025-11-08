import { Platform, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import AddCategories from '../../components/categories/AddCategories';
import EditCategories from '../../components/categories/EditCategories';
import { ThemeColors, useThemeColors } from '../../store/theme-context';

function CategoriesManager() {
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 200}
    >
      <AddCategories />
      <EditCategories />
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

export default CategoriesManager;
