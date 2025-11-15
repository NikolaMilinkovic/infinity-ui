import { StyleSheet, View } from 'react-native';
import { useEndOfDayExcelContext } from '../../../../store/excel/end-of-day-excel-presets-context';
import { useConfirmationModal } from '../../../../store/modals/confirmation-modal-context';
import { useDrawerModal } from '../../../../store/modals/drawer-modal-contex';
import { ThemeColors } from '../../../../store/theme-context';
import { Excel } from '../../../../types/allTsTypes';
import CustomText from '../../../../util-components/CustomText';
import IconButton from '../../../../util-components/IconButton';

interface EditExcelItemPropTypes {
  excel: Excel;
  colors: ThemeColors;
}

function EditExcelItem({ excel, colors }: EditExcelItemPropTypes) {
  const excelCtx = useEndOfDayExcelContext();
  const styles = getStyles(colors);
  function editExcelHandler() {}

  const { showConfirmation } = useConfirmationModal();
  const { openDrawer } = useDrawerModal();
  const handleDeleteExcel = async () => {
    showConfirmation(
      async () => await excelCtx.removeExcel(excel._id),
      'Da li ste sigurni da želite da obrišete ovaj Excel šablon?'
    );
  };

  // const handleOpenDrawer = () => {
  //   openDrawer(<ColumnModalAdditionalSettings columnId={column.temp_id!} colors={colors} />, column.name);
  // };

  return (
    <View style={styles.container}>
      <CustomText style={styles.text}>{excel.name}</CustomText>
      <IconButton
        icon="delete"
        onPress={handleDeleteExcel}
        color={colors.error}
        style={styles.icon}
        size={26}
        backColor="transparent"
        backColor1="transparent"
      />
      <IconButton
        icon="edit"
        onPress={editExcelHandler}
        color={colors.borderColor}
        style={styles.icon}
        size={26}
        backColor="transparent"
        backColor1="transparent"
      />
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingVertical: 12,
      paddingHorizontal: 20,
      gap: 10,
    },
    text: {
      fontSize: 14,
      color: colors.defaultText,
      marginRight: 'auto',
    },
    icon: {
      minHeight: 30,
      minWidth: 30,
      backgroundColor: colors.background,
    },
  });
}

export default EditExcelItem;
