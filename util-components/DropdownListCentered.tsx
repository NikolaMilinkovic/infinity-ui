import { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../store/theme-context';
import CustomText from './CustomText';

interface DropdownListProps<T> {
  data: T[];
  value: string | number | null;
  onChange: (item: T) => void;
  placeholder?: string;
  labelField?: string;
  valueField?: string;
  containerStyle?: object;
  buttonStyle?: object;
  itemStyle?: object;
}

function DropdownListCentered<T extends { [key: string]: any }>({
  data,
  value,
  onChange,
  placeholder = 'Select...',
  labelField = 'label',
  valueField = 'value',
  containerStyle,
  buttonStyle,
  itemStyle,
}: DropdownListProps<T>) {
  const [selectedValue, setSelectedValue] = useState<string | number | null>(value);
  const [isOpen, setIsOpen] = useState(false);
  const colors = useThemeColors();
  const styles = getStyles(colors);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  const handleSelect = (item: T) => {
    setSelectedValue(item[valueField]);
    onChange(item);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Button */}
      <Pressable style={[styles.button, buttonStyle]} onPress={() => setIsOpen(true)}>
        <CustomText style={styles.selectedText}>
          {data.find((d) => d[valueField] === selectedValue)?.[labelField] || placeholder}
        </CustomText>
      </Pressable>

      {/* Centered modal */}
      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <View style={styles.listContainer}>
            <FlatList
              data={[{ [labelField]: 'Reset', [valueField]: null }, ...data]}
              keyExtractor={(item) => (item[valueField] === null ? 'reset' : item[valueField].toString())}
              renderItem={({ item }) => {
                const isSelected = item[valueField] === selectedValue;
                return (
                  <Pressable
                    onPress={() => {
                      if (item[valueField] === null) {
                        setSelectedValue(null);
                        onChange(null as any);
                      } else handleSelect(item);
                      setIsOpen(false);
                    }}
                    style={[
                      styles.item,
                      itemStyle,
                      isSelected && { backgroundColor: colors.highlight, color: colors.whiteText },
                    ]}
                  >
                    <CustomText style={[styles.itemText, isSelected && { color: colors.highlightText }]}>
                      {item[labelField]}
                    </CustomText>
                  </Pressable>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      marginVertical: 5,
    },
    button: {
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      borderRadius: 4,
      paddingHorizontal: 12,
      height: 45,
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    selectedText: {
      fontSize: 14,
      color: colors.defaultText,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.75)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    listContainer: {
      width: '80%',
      maxHeight: 400,
      backgroundColor: colors.background,
      borderRadius: 4,
    },
    item: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      overflow: 'hidden',
      borderRadius: 4,
      borderBottomColor: colors.borderColor,
      borderBottomWidth: 0.5,
      backgroundColor: colors.background,
    },
    itemText: {
      fontSize: 14,
      color: colors.defaultText,
      textAlign: 'center',
    },
  });
}

export default DropdownListCentered;
