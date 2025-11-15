import { MaterialIcons } from '@expo/vector-icons';
import React, { memo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useReorderableDrag } from 'react-native-reorderable-list';
import { useGlobalStyles } from '../../../../constants/globalStyles';
import { useConfirmationModal } from '../../../../store/modals/confirmation-modal-context';
import { useDrawerModal } from '../../../../store/modals/drawer-modal-contex';
import { ThemeColors } from '../../../../store/theme-context';
import { DropdownTypes, ExcelColumn } from '../../../../types/allTsTypes';
import DropdownListCentered from '../../../../util-components/DropdownListCentered';
import IconButton from '../../../../util-components/IconButton';
import ColumnModalAdditionalSettings from './ColumnModalAdditionalSettings';

interface ExcelColumnProps {
  column: ExcelColumn;
  height: number;
  colors: ThemeColors;
  onUpdate: (updates: Partial<ExcelColumn>) => void;
  dropdownData: DropdownTypes[];
  removeColumn: (temp_id: string) => void;
}

const ExcelColumnItem: React.FC<ExcelColumnProps> = memo(
  ({ column, height, colors, onUpdate, dropdownData, removeColumn }) => {
    const globalStyles = useGlobalStyles();
    const [isFocused, setIsFocused] = useState(false);
    const { showConfirmation } = useConfirmationModal();
    const { openDrawer } = useDrawerModal();
    const drag = useReorderableDrag();
    const styles = getStyles(colors);
    const handleDeleteColumn = (tempId: string) => {
      showConfirmation(() => removeColumn(tempId), 'Da li ste sigurni da želite da obrišete ovu kolonu?');
    };

    const handleOpenDrawer = () => {
      openDrawer(<ColumnModalAdditionalSettings columnId={column.temp_id!} colors={colors} />, column.name);
    };

    return (
      <View style={[styles.card, { height }]}>
        <Pressable style={styles.iconWrapper} onPressIn={drag}>
          <MaterialIcons name="drag-handle" size={24} color={colors.borderColor} />
        </Pressable>
        <View style={styles.input_wrapper}>
          <TextInput
            style={[
              styles.input,
              { borderBottomColor: isFocused ? colors.highlight : colors.borderColor },
              globalStyles.textRegular,
            ]}
            value={column.name}
            onChangeText={(text) => onUpdate({ name: text })}
            selectionColor={colors.defaultText}
            placeholder="Naziv kolone"
            placeholderTextColor={colors.defaultText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <DropdownListCentered
            data={dropdownData}
            value={column.source.valueKey}
            onChange={(selected) =>
              onUpdate({
                source: {
                  ...column.source,
                  valueKey: selected ? selected.value : '',
                },
              })
            }
            placeholder="Vrednost"
            labelField="name"
            valueField="value"
            buttonStyle={styles.dropdown}
          />
          <IconButton
            icon="edit"
            onPress={handleOpenDrawer}
            color={colors.borderColor}
            style={styles.icon}
            size={26}
            backColor1="transparent"
            backColor="transparent"
          />
          <IconButton
            icon="delete"
            onPress={() => handleDeleteColumn(column.temp_id!)}
            color={colors.error}
            style={styles.icon}
            size={26}
            backColor1="transparent"
            backColor="transparent"
          />
        </View>
      </View>
    );
  }
);

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderBottomWidth: 0.5,
      borderColor: colors.borderColor,
      paddingHorizontal: 12,
      paddingLeft: 45,
    },
    input_wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 8,
    },
    input: {
      borderBottomColor: colors.borderColor,
      borderBottomWidth: 1,
      fontSize: 14,
      color: colors.defaultText,
      marginRight: 'auto',
      flex: 1,
      marginBottom: -5,
    },
    dropdown: {
      height: 41,
      width: 140,
    },
    text: {
      fontSize: 14,
    },
    iconWrapper: {
      position: 'absolute',
      height: '100%',
      width: 45,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      width: 30,
    },
  });
}

export default ExcelColumnItem;

{
  /* <TextInput
  style={styles.input}
  value={column.options?.defaultValue || ''}
  onChangeText={(val) => onUpdate({ options: { ...column.options, defaultValue: val } })}
  selectionColor={colors.defaultText}
  placeholderTextColor={colors.grayText}
/> */
}
