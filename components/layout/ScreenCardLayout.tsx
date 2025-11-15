import { StyleSheet } from 'react-native';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import KeyboardAvoidingWrapper from '../../util-components/KeyboardAvoidingWrapper';
import Card from './Card';

interface ScreenCardLayoutPropTypes {
  children: any;
}
function ScreenCardLayout({ children }: ScreenCardLayoutPropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <KeyboardAvoidingWrapper style={styles.container}>
      <Card cardStyles={styles.card}>{children}</Card>
    </KeyboardAvoidingWrapper>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      position: 'relative',
      backgroundColor: colors.background2,
    },
    card: {
      backgroundColor: colors.cardBackground,
      borderColor: colors.borderColor,
      borderTopColor: colors.borderColorHighlight,
      borderRadius: 4,
      borderWidth: 1,
      margin: 10,
      padding: 1,
      marginBottom: 60,
    },
  });
}
export default ScreenCardLayout;
