import { StyleSheet, Text, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';

interface ModalHeaderTypes {
  title: string;
}

function ModalHeader({ title }: ModalHeaderTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.modalHeader} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
    </View>
  );
}

export default ModalHeader;

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    headerContainer: {
      height: 50,
      backgroundColor: colors.primaryDark,
      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalHeader: {
      color: colors.white,
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
      marginTop: 'auto',
      marginBottom: 10,
    },
  });
}
