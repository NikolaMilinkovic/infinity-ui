import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/colors';

interface PermissionsRowTypes {
  children: any;
  header: string;
  isDisabled?: boolean;
  useCheckAll?: boolean;
}

function PermissionsRow({ children, header, isDisabled, useCheckAll }: PermissionsRowTypes) {
  return (
    <View style={[styles.permissionsContainer, isDisabled && styles.disabledContainer]}>
      {/* {useCheckAll === true && (
        <View style={styles.checkAllContainer}>
          <CustomCheckbox containerStyles={styles.permissionsItem} label={''} />
        </View>
      )} */}
      <View style={styles.permissionsRow}>
        <View style={styles.permissionHeaderContainer}>
          <Text style={styles.permissionHeader}>{header}</Text>
        </View>
        <View style={styles.row} pointerEvents={isDisabled ? 'none' : 'auto'}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  permissionsContainer: {
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
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
    backgroundColor: Colors.white,
    height: 30,
    paddingHorizontal: 8,
  },
  permissionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
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
    justifyContent: 'center', // centers vertically between top and bottom
    left: -16,
  },
});

export default PermissionsRow;
