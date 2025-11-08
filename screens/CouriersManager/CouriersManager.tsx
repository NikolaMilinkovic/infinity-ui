import { Platform, StyleSheet } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import AddCourier from '../../components/couriers/AddCourier';
import EditCourier from '../../components/couriers/EditCourier';
import { ThemeColors, useThemeColors } from '../../store/theme-context';

function CouriersManager() {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 200}
    >
      <AddCourier />
      <EditCourier />
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

export default CouriersManager;
