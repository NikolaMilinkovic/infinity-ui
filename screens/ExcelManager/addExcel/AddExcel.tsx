import { useMemo } from 'react';
import { ListRenderItemInfo, StyleSheet, View } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import ReorderableList, { ReorderableListReorderEvent, reorderItems } from 'react-native-reorderable-list';
import LinearGradientBackground from '../../../components/gradients/LinearBackgroundGradient';
import { useNewExcel } from '../../../store/excel/new-excel-context';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { ExcelColumn } from '../../../types/allTsTypes';
import Button from '../../../util-components/Button';
import CustomText from '../../../util-components/CustomText';
import AddExcelTopControls from './components/AddExcelTopControls';
import ExcelColumnItem from './components/ExcelColumnItem';

function AddExcel() {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const { excelData, updateColumn, removeColumn, setExcelData, dropdownData, handleAddNewExcel } = useNewExcel();

  const handleReorder = ({ from, to }: ReorderableListReorderEvent) => {
    setExcelData((prev) => ({
      ...prev,
      columns: reorderItems(prev.columns, from, to),
    }));
  };

  function NoExcelRenderer() {
    const internalStyle = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '80%',
      },
      text: {
        color: colors.defaultText,
      },
    });

    return (
      <View style={internalStyle.container}>
        <CustomText style={internalStyle.text}>Trenutno ne postoje dodate excel kolone.</CustomText>
      </View>
    );
  }

  // Reordable list onemogucuje scroll u stranu po defaulti
  // Te ne mozemo da idemo sa taba na tab
  // Ovo nam omogucava da to cinimo, aktivira se click za drag n drop posle 150ms drzanja
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(150) // wait longer to avoid stealing taps
        .activeOffsetY(8) // only activate when dragging down/up > 8px
        .failOffsetX([-5, 5]) // allow small horizontal moves / swipes
        .minDistance(8), // tap stays tap
    []
  );

  const renderExcelColumn = ({ item }: ListRenderItemInfo<ExcelColumn>) => (
    <ExcelColumnItem
      height={60}
      column={item}
      colors={colors}
      onUpdate={(updates) => updateColumn(item.temp_id!, updates)}
      dropdownData={dropdownData}
      removeColumn={removeColumn}
    />
  );
  return (
    <View style={styles.container}>
      <AddExcelTopControls excelData={excelData} setExcelData={setExcelData} />
      {excelData.columns.length > 0 ? (
        <View style={styles.listContainer}>
          <ReorderableList
            data={excelData.columns}
            onReorder={handleReorder}
            renderItem={renderExcelColumn}
            keyExtractor={(item) => item.temp_id as any}
            panGesture={panGesture}
          />
        </View>
      ) : (
        <NoExcelRenderer />
      )}
      <View style={styles.bottomControls}>
        <LinearGradientBackground
          containerStyles={{ padding: 16, borderRadius: 4 }}
          color1={colors.cardBackground1}
          color2={colors.cardBackground2}
        >
          <Button
            onPress={handleAddNewExcel}
            textColor={colors.whiteText}
            backColor={colors.buttonHighlight1}
            backColor1={colors.buttonHighlight2}
          >
            Sačuvaj Šablon
          </Button>
        </LinearGradientBackground>
      </View>
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.containerBackground,
    },
    listContainer: {
      flex: 1,
    },
    bottomControls: {
      height: 140,
      backgroundColor: colors.background,
      borderTopColor: colors.borderColor,
      borderTopWidth: 0.5,
    },
  });
}

export default AddExcel;
