import { Platform, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import AddSupplier from '../../components/suppliers/AddSupplier';
import EditSuppliers from '../../components/suppliers/EditSuppliers';
import { ThemeColors, useThemeColors } from '../../store/theme-context';

function SuppliersManager() {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 200}
    >
      <AddSupplier />
      <EditSuppliers />
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

export default SuppliersManager;
