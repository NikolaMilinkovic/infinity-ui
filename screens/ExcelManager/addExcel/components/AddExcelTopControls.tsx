import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import uuid from 'react-native-uuid';
import LinearGradientBackground from '../../../../components/gradients/LinearBackgroundGradient';
import { useNewExcel } from '../../../../store/excel/new-excel-context';
import { ThemeColors, useThemeColors } from '../../../../store/theme-context';
import { Excel, ExcelColumn } from '../../../../types/allTsTypes';
import Button from '../../../../util-components/Button';
import InputField from '../../../../util-components/InputField';

interface AddExcelTopControlsProps {
  excelData: Excel;
  setExcelData: React.Dispatch<React.SetStateAction<Excel>>;
}

function AddExcelTopControls({ excelData, setExcelData }: AddExcelTopControlsProps) {
  const { error, setError } = useNewExcel();
  const colors = useThemeColors();
  const styles = getStyles(colors);

  const addNewColumn = () => {
    const newColumn: ExcelColumn = {
      temp_id: uuid.v4(),
      name: '',
      source: { type: 'field', valueKey: '' },
      options: { defaultValue: '', isAllCaps: false, format: '' },
    };

    setExcelData((prev) => ({
      ...prev,
      columns: [...prev.columns, newColumn],
    }));
  };
  return (
    <LinearGradientBackground
      containerStyles={{ borderRadius: 4 }}
      color1={colors.cardBackground1}
      color2={colors.cardBackground2}
      flex={false}
    >
      <View style={styles.container}>
        <View style={styles.controllsContainer}>
          <View style={styles.inputContainer}>
            <InputField
              label="Unesi naziv excel šablona"
              isSecure={false}
              inputText={excelData.name}
              setInputText={(text) => setExcelData((prev) => ({ ...prev, name: text }))}
              background={colors.cardBackground1}
              color={colors.defaultText}
              activeColor={colors.highlight}
              labelBorders={false}
              selectionColor={colors.highlight}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              onPress={addNewColumn}
              textColor={colors.defaultText}
              backColor={colors.buttonNormal1}
              backColor1={colors.buttonNormal2}
            >
              Dodaj kolonu
            </Button>
          </View>
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Ukupno kolona: {excelData.columns.length}</Text>
        </View>
      </View>
    </LinearGradientBackground>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 8,
    },
    controllsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      gap: 8,
      paddingHorizontal: 16,
    },
    inputContainer: {
      flex: 0.6,
    },
    buttonContainer: {
      flex: 0.4,
    },
    error: {
      color: colors.error,
      marginTop: 10,
    },
    success: {
      color: colors.success1,
      marginTop: 10,
    },
    counterContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 6,
      paddingBottom: 2,
    },
    counterText: {
      color: colors.defaultText,
    },
  });
}

export default AddExcelTopControls;
