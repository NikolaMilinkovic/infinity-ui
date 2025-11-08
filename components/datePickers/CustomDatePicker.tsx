import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { ThemeColors, useTheme, useThemeColors } from '../../store/theme-context';
import Button from '../../util-components/Button';

interface DatePicker {
  date: Date;
  handleDatePick: () => void;
  handleDateReset: () => void;
  label: string;
}

/**
 * NOTE - IMA ISSUE, OTVORI DATE PICKER NA RENDER
 */
function CustomDatePicker({ date, handleDatePick, handleDateReset, label }: DatePicker) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDatePicked, setIsDatePicked] = useState(false);
  const themeContext = useTheme();
  const colors = useThemeColors();
  const styles = getStyles(colors);
  useEffect(() => {
    if (date) {
      setIsDatePicked(true);
    } else {
      setIsDatePicked(false);
    }
  }, [date]);
  function handleOpenDatePicker() {
    setShowDatePicker(true);
  }
  function formatDateHandler(date: Date) {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
  return (
    <View style={[styles.radioGroupContainer]}>
      {Platform.OS === 'ios' ? (
        <>
          <Text style={styles.filtersH2absolute}>{label}</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ justifyContent: 'center', alignSelf: 'center', width: '50%' }}>
              <DateTimePicker
                value={date}
                mode="date"
                is24Hour={true}
                onChange={handleDatePick}
                onTouchCancel={handleDateReset}
                accentColor={colors.highlight1}
                textColor={colors.defaultText}
                themeVariant={themeContext.theme === 'dark' ? 'dark' : 'light'}
                display="spinner"
              />
            </View>
            <Button containerStyles={[styles.dateButton, { width: '50%' }]} onPress={handleDateReset}>
              Resetuj izbor
            </Button>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.filtersH2absolute}>{label}</Text>
          <View style={styles.dateButtonsContainer}>
            <Button containerStyles={styles.dateButton} onPress={handleOpenDatePicker}>
              Izaberi datum
            </Button>
            <Button containerStyles={styles.dateButton} onPress={handleDateReset}>
              Resetuj izbor
            </Button>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                is24Hour={true}
                onChange={handleDatePick}
                onTouchCancel={handleDateReset}
                accentColor={colors.highlight1}
              />
            )}
          </View>
          {date && isDatePicked && (
            <View style={styles.dateDisplayContainer}>
              <Text style={styles.dateLabel}>Izabrani datum:</Text>
              <Text style={styles.dateText}>{formatDateHandler(date)}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

export default CustomDatePicker;
function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    radioGroupContainer: {
      padding: 10,
      borderWidth: 2,
      borderColor: colors.borderColor,
      borderRadius: 4,
      marginBottom: 16,
      marginTop: 10,
    },
    filtersH2absolute: {
      fontSize: 14,
      color: colors.defaultText,
      marginBottom: 8,
      position: 'absolute',
      left: 10,
      top: -12,
      backgroundColor: colors.background,
      borderRadius: 4,
      paddingHorizontal: 4,
    },
    dateButtonsContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    dateButton: {
      flex: 1,
      backgroundColor: colors.background,
      color: colors.defaultText,
    },
    dateDisplayContainer: {
      flexDirection: 'column',
      gap: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dateText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.highlight,
      lineHeight: 16,
    },
    dateLabel: {},
  });
}
