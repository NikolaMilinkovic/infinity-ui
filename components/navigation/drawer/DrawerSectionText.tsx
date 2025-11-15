import { StyleSheet, Text } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';

interface DrawerSectionTextPropTypes {
  text: string;
}
function DrawerSectionText({ text = '' }: DrawerSectionTextPropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return <Text style={styles.text}>{text}</Text>;
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    text: {
      padding: 10,
      paddingBottom: 0,
      marginBottom: 4,
      marginTop: 12,
      borderBottomColor: colors.borderColor,
      borderBottomWidth: 0.5,
      paddingLeft: 26,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
      fontSize: 16,
      color: colors.grayText,
    },
  });
}

export default DrawerSectionText;
