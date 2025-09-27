import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Animated, Dimensions, NativeSyntheticEvent, StyleSheet, Text, View } from 'react-native';
import { RadioButtonProps, RadioGroup } from 'react-native-radio-buttons-group';
import { Colors } from '../../constants/colors';
import useBackClickHandler from '../../hooks/useBackClickHandler';
import { useExpandAnimation } from '../../hooks/useExpand';
import { useToggleFadeAnimation } from '../../hooks/useFadeAnimation';
import { AuthContext } from '../../store/auth-context';
import { ColorsContext } from '../../store/colors-context';
import Button from '../../util-components/Button';
import ExpandButton from '../../util-components/ExpandButton';
import InputField from '../../util-components/InputField';
import MultiDropdownList from '../../util-components/MultiDropdownList';
import { popupMessage } from '../../util-components/PopupMessage';
import SizePickerCheckboxes from '../../util-components/SizePickerCheckboxes';
import { fetchData } from '../../util-methods/FetchMethods';

interface PropTypes {
  searchParams: any;
  setSearchParams: any;
  updateSearchParam: any;
}
function SearchReservations({ searchParams, setSearchParams, updateSearchParam }: PropTypes) {
  const [isExpanded, setIsExpanded] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const toggleExpandAnimation = useExpandAnimation(isExpanded, 10, screenHeight - 172, 180);
  const toggleFade = useToggleFadeAnimation(isExpanded, 180);
  function handleToggleExpand() {
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  }
  useBackClickHandler(isExpanded, handleToggleExpand);

  // ASCENDING | DESCENDING RADIO BUTTONS
  const ascendDescendFilterButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1',
        label: 'Najstarije prvo',
        value: 'ascending',
      },
      {
        id: '2',
        label: 'Najnovije prvo',
        value: 'descending',
      },
    ],
    []
  );
  type AscDescPropTypes = {
    ascending: boolean;
    descending: boolean;
  };
  const [isAscending, setIsAscending] = useState<string>('1');
  useEffect(() => {
    const updateParams: Record<string, AscDescPropTypes> = {
      '1': { ascending: true, descending: false },
      '2': { ascending: false, descending: true },
    };
    const params = updateParams[isAscending];
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        updateSearchParam(key as keyof AscDescPropTypes, value);
      });
    }
  }, [isAscending]);

  // DATE PICKER
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  function formatDateHandler(date: Date) {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  async function handleFetchReservationsByDate(date: Date, token: any) {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    const formattedDate = utcDate.toISOString().split('T')[0]; // Gets 'YYYY-MM-DD' format
    setShowDatePicker(false);
    const response = await fetchData(token, `orders/fetch-reservations-by-date/${formattedDate}`);
    if (response === false)
      popupMessage('Došlo je do problema prilikom preuzimanja podataka o rezervacijama', 'danger');

    popupMessage(response.message, 'success');
    return;
  }
  function handleSetPickedDate(date: Date) {
    const formattedDate = date.toISOString().split('T')[0].split('-').reverse().join('/');
    setSearchParams((prev: any) => ({ ...prev, pickedDateFormatted: formattedDate }));
  }
  function handleOpenDatePicker() {
    setShowDatePicker(true);
  }
  const handleDatePick = async (e: NativeSyntheticEvent<DateTimePickerEvent>, selectedDate: Date) => {
    if (e.type === 'set') {
      const normalized = new Date(
        Date.UTC(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
      );

      setSearchParams((prev: any) => ({ ...prev, pickedDate: normalized }));
      await handleFetchReservationsByDate(normalized, token);
      handleSetPickedDate(normalized);
    }

    setShowDatePicker(false);
  };
  const handleDateReset = () => {
    setSearchParams((prev: any) => ({ ...prev, pickedDate: '' }));
    setSearchParams((prev: any) => ({ ...prev, pickedDateFormatted: '' }));
    setShowDatePicker(false);
  };

  // COLORS AND SIZES FILTER
  interface ColorDataType {
    key: string | number;
    value: string | number;
  }
  const colorsCtx = useContext(ColorsContext);
  const [colorsData] = useState<ColorDataType[]>(colorsCtx.getColorItemsForDropdownList() || []);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  useEffect(() => {
    updateSearchParam('onColorsSearch', selectedColors);
    updateSearchParam('onSizeSearch', selectedSizes);
  }, [selectedColors, selectedSizes]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField
          label="Pretraži rezervacije"
          inputText={searchParams.query}
          setInputText={(text) => setSearchParams((prev: any) => ({ ...prev, query: text }))}
          background={Colors.white}
          color={Colors.primaryDark}
          labelBorders={false}
          containerStyles={styles.input}
          displayClearInputButton={true}
        />
        <ExpandButton
          isExpanded={isExpanded}
          handleToggleExpand={handleToggleExpand}
          containerStyles={styles.expandButton}
        />
      </View>
      <Animated.ScrollView
        style={[styles.searchParamsContainer, { height: toggleExpandAnimation, opacity: toggleFade }]}
      >
        <Text style={styles.filtersH1}>Filteri</Text>

        {/* Date Picker */}
        <View style={styles.radioGroupContainer}>
          <Text style={styles.filtersH2absolute}>Pretrazi po datumu</Text>
          <View style={styles.dateButtonsContainer}>
            <Button containerStyles={styles.dateButton} onPress={handleOpenDatePicker}>
              Izaberi datum
            </Button>
            <Button containerStyles={styles.dateButton} onPress={handleDateReset}>
              Resetuj izbor
            </Button>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={searchParams.pickedDate || new Date()}
              mode="date"
              is24Hour={true}
              onChange={handleDatePick}
              onTouchCancel={handleDateReset}
            />
          )}
          {date && searchParams.pickedDate !== '' && (
            <View style={styles.dateDisplayContainer}>
              <Text style={styles.dateLabel}>Izabrani datum:</Text>
              <Text style={styles.dateText}>{formatDateHandler(searchParams.pickedDate)}</Text>
            </View>
          )}
        </View>

        {/* Ascending | Descending */}
        <View style={styles.radioGroupContainer}>
          <Text style={styles.filtersH2absolute}>Redosled</Text>
          <View style={styles.radioGroup}>
            <RadioGroup
              radioButtons={ascendDescendFilterButtons}
              onPress={setIsAscending}
              selectedId={isAscending}
              containerStyle={styles.radioComponentContainer}
              layout="row"
            />
          </View>
        </View>

        {/* COLORS FILTER */}
        <Text style={styles.filtersH2}>Pretraga po boji proizvoda</Text>
        <MultiDropdownList
          data={colorsData}
          setSelected={setSelectedColors}
          isOpen={true}
          label="Boje"
          placeholder="Filtriraj po bojama"
          dropdownStyles={{ maxHeight: 150 }}
        />

        {/* SIZE FILTER */}
        <View style={[styles.radioGroupContainer, { paddingBottom: 8, paddingTop: 8, marginTop: 36 }]}>
          <Text style={styles.filtersH2absolute}>Pretraga po veličini proizvoda</Text>
          <SizePickerCheckboxes
            sizes={['UNI', 'XS', 'S', 'M', 'L', 'XL']}
            selectedSizes={selectedSizes}
            setSelectedSizes={setSelectedSizes}
            borders={false}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    elevation: 2,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.white,
    marginBottom: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: Colors.white,
  },
  input: {
    marginTop: 18,
    backgroundColor: Colors.white,
    flex: 7,
    height: 50,
  },
  expandButton: {
    position: 'relative',
    flex: 1.5,
    marginLeft: 10,
    height: 45,
    right: 0,
    top: 10,
  },
  searchParamsContainer: {
    position: 'relative',
  },
  overlay: {},
  radioGroupContainer: {
    padding: 10,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    borderRadius: 4,
    marginBottom: 16,
    // paddingTop: 20,
    marginTop: 10,
  },
  radioGroup: {},
  radioComponentContainer: {
    justifyContent: 'flex-start',
  },
  filtersH1: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryDark,
  },
  filtersH2: {
    fontSize: 14,
    color: Colors.primaryDark,
    marginBottom: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
  },
  filtersH2absolute: {
    fontSize: 14,
    color: Colors.primaryDark,
    marginBottom: 8,
    position: 'absolute',
    left: 10,
    top: -12,
    backgroundColor: Colors.white,
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  dateButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: Colors.secondaryLight,
    color: Colors.primaryDark,
  },
  dateDisplayContainer: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabel: {},
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.highlight,
    lineHeight: 16,
  },
  courierContainer: {
    marginBottom: 10,
  },
});

export default SearchReservations;
