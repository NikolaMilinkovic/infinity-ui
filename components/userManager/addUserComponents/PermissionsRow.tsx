import { StyleSheet, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import CustomText from '../../../util-components/CustomText';

interface PermissionsRowTypes {
  children: any;
  header: string;
  isDisabled?: boolean;
  useCheckAll?: boolean;
}

function PermissionsRow({ children, header, isDisabled, useCheckAll }: PermissionsRowTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <View style={[styles.permissionsContainer, isDisabled && styles.disabledContainer]}>
      {/* {useCheckAll === true && (
        <View style={styles.checkAllContainer}>
          <CustomCheckbox containerStyles={styles.permissionsItem} label={''} />
        </View>
      )} */}
      <View style={styles.permissionsRow}>
        <View style={styles.permissionHeaderContainer}>
          <CustomText variant="bold" style={styles.permissionHeader}>
            {header}
          </CustomText>
        </View>
        <View style={styles.row} pointerEvents={isDisabled ? 'none' : 'auto'}>
          {children}
        </View>
      </View>
    </View>
  );
}
function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    permissionsContainer: {
      borderWidth: 1,
      borderColor: colors.borderColor,
      paddingHorizontal: 8,
      flexDirection: 'column',
      borderRadius: 4,
      marginTop: 16,
      paddingBottom: 8,
      position: 'relative',
    },
    disabledContainer: {
      opacity: 0.5, // grays out whole section
    },
    permissionsRow: {
      paddingHorizontal: 8,
      flexDirection: 'column',
      borderRadius: 4,
      flexWrap: 'wrap',
      gap: 8,
      position: 'relative',
      paddingTop: 8,
      paddingLeft: 14,
    },
    permissionHeaderContainer: {
      position: 'absolute',
      top: -18,
      left: 0,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      height: 30,
      paddingHorizontal: 8,
    },
    permissionHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.borderColor,
    },
    permissionsItem: {
      flex: 1,
    },
    row: {
      flexDirection: 'column',
      width: '100%',
      gap: 8,
    },
    checkAllContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      left: -16,
    },
  });
}

export default PermissionsRow;
