import { StyleSheet, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import CustomText from '../../../util-components/CustomText';

interface ModalHeaderTypes {
  title: string;
}

function ModalHeader({ title }: ModalHeaderTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <View style={styles.headerContainer}>
      <CustomText variant="header" style={styles.modalHeader} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </CustomText>
    </View>
  );
}

export default ModalHeader;

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    headerContainer: {
      height: 50,
      backgroundColor: colors.navBackground,
      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalHeader: {
      color: colors.white,
      fontSize: 20,
      textAlign: 'center',
      marginTop: 'auto',
      marginBottom: 10,
    },
  });
}
