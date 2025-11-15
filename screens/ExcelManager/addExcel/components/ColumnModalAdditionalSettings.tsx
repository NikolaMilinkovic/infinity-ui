import { Platform, StyleSheet, Switch, TextInput, View } from 'react-native';
import { useNewExcel } from '../../../../store/excel/new-excel-context';
import { ThemeColors } from '../../../../store/theme-context';
import CustomText from '../../../../util-components/CustomText';
import DropdownListCentered from '../../../../util-components/DropdownListCentered';

interface ColumnModalAdditionalSettingsProps {
  columnId: string;
  colors: ThemeColors;
}

function ColumnModalAdditionalSettings({ columnId, colors }: ColumnModalAdditionalSettingsProps) {
  const { excelData, updateColumn, dropdownData } = useNewExcel();

  // get current column from context
  const column = excelData.columns.find((c) => c.temp_id === columnId);
  if (!column) return null;

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <CustomText color={colors.highlightText} style={styles.header} variant="header">
        Kolona {column.name}
      </CustomText>

      {/* NAZIV KOLONE */}
      <CustomText color={colors.defaultText} style={(styles.label, { marginBottom: 0 })}>
        Naziv kolone
      </CustomText>
      <TextInput
        style={[styles.input, { marginBottom: 30 }]}
        value={column.name}
        onChangeText={(text) => updateColumn(columnId, { name: text })}
        selectionColor={colors.defaultText}
        placeholder="Naziv kolone"
        placeholderTextColor={colors.defaultText}
      />

      {/* DROPDOWN */}
      <CustomText color={colors.defaultText} style={(styles.label, { marginBottom: 0 })}>
        Predefinisana vrednost
      </CustomText>
      <DropdownListCentered
        data={dropdownData}
        value={column.source.valueKey}
        onChange={(selected) =>
          updateColumn(columnId, { source: { ...column.source, valueKey: selected?.value || '' } })
        }
        placeholder="Vrednost"
        labelField="name"
        valueField="value"
        buttonStyle={styles.dropdown}
      />

      {/* DEFAULT VALUE */}
      <CustomText color={colors.defaultText} style={styles.label}>
        Defaultna vrednost
      </CustomText>
      <TextInput
        style={styles.input}
        value={column?.options?.defaultValue}
        onChangeText={(text) => updateColumn(columnId, { options: { ...column.options, defaultValue: text } })}
        placeholder="Unesite default vrednost"
        placeholderTextColor={colors.grayText}
      />

      {/* ALL CAPS TOGGLE */}
      <View style={styles.switchRow}>
        <CustomText color={colors.defaultText} style={styles.label}>
          Sva slova velika?
        </CustomText>
        <Switch
          value={column?.options?.isAllCaps!}
          onChange={() =>
            updateColumn(columnId, { options: { ...column.options, isAllCaps: !column?.options?.isAllCaps } })
          }
          trackColor={{ false: colors.grayText, true: colors.highlight }}
          thumbColor={colors.thumbColor}
          style={styles.switch}
        />
      </View>
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      padding: 16,
      paddingTop: '20%',
    },
    header: {
      marginBottom: 26,
      fontSize: 16,
    },
    dropdown: {
      minWidth: '100%',
      marginBottom: 12,
    },
    label: {
      marginTop: 12,
      marginBottom: 6,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.borderColor,
      borderRadius: 4,
      paddingHorizontal: 12,
      paddingVertical: 8,
      color: colors.defaultText,
      fontSize: 14,
    },
    switchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 12,
    },
    switch: {
      marginLeft: 'auto',
      transform: Platform.select({
        ios: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        android: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
      }),
    },
  });
}

export default ColumnModalAdditionalSettings;
