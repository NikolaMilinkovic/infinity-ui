import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Animated, Dimensions, NativeSyntheticEvent, Platform, StyleSheet, Text, View } from 'react-native';
import { RadioButtonProps, RadioGroup } from 'react-native-radio-buttons-group';
import useBackClickHandler from '../../../hooks/useBackClickHandler';
import { useExpandAnimation } from '../../../hooks/useExpand';
import { useToggleFadeAnimation } from '../../../hooks/useFadeAnimation';
import { AuthContext } from '../../../store/auth-context';
import { ColorsContext } from '../../../store/colors-context';
import { CouriersContext } from '../../../store/couriers-context';
import { OrdersContext } from '../../../store/orders-context';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { CategoryTypes } from '../../../types/allTsTypes';
import Button from '../../../util-components/Button';
import DropdownList from '../../../util-components/DropdownList';
import ExpandButton from '../../../util-components/ExpandButton';
import InputField from '../../../util-components/InputField';
import KeyboardAvoidingWrapper from '../../../util-components/KeyboardAvoidingWrapper';
import MultiDropdownList from '../../../util-components/MultiDropdownList';
import { popupMessage } from '../../../util-components/PopupMessage';
import SizePickerCheckboxes from '../../../util-components/SizePickerCheckboxes';
import { fetchData } from '../../../util-methods/FetchMethods';

interface PropTypes {
  searchData: string;
  setSearchData: (data: string | number | undefined) => void;
  updateSearchParam: (paramName: string, value: any) => void;
  isDatePicked: boolean;
  setIsDatePicked: (isDatePicked: boolean) => void;
  setPickedDate: (date: string) => void;
  isDateForPeriodPicked: boolean;
  setIsDateForPeriodPicked: (isDatePicked: boolean) => void;
  setPickedDateForPeriod: (date: string) => void;
}
function SearchOrders({
  searchData,
  setSearchData,
  updateSearchParam,
  isDatePicked,
  setIsDatePicked,
  setPickedDate,
  isDateForPeriodPicked,
  setIsDateForPeriodPicked,
  setPickedDateForPeriod,
}: PropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const [isExpanded, setIsExpanded] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const toggleExpandAnimation = useExpandAnimation(isExpanded, 10, screenHeight - 172, 180);
  const toggleFade = useToggleFadeAnimation(isExpanded, 180);
  function handleToggleExpand() {
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  }
  useBackClickHandler(isExpanded, handleToggleExpand);

  // PROCESSED | UNPROCESSED RADIO BUTTONS
  const processedUnprocessedButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1',
        label: 'Neizvršene',
        value: 'unprocessed',
      },
      {
        id: '2',
        label: 'Izvršene',
        value: 'processed',
      },
    ],
    []
  );
  type ProcessedUnprocessedTypes = {
    processed: boolean;
    unprocessed: boolean;
  };
  const [areProcessedOrders, setAreProcessedOrders] = useState<string>('1');
  useEffect(() => {
    const updateParams: Record<string, ProcessedUnprocessedTypes> = {
      '1': { processed: false, unprocessed: true },
      '2': { processed: true, unprocessed: false },
    };
    const params = updateParams[areProcessedOrders];
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        updateSearchParam(key as keyof ProcessedUnprocessedTypes, value);
      });
    }
  }, [areProcessedOrders]);

  // PACKED | UNPACKED RADIO BUTTONS
  const packedUnpackedButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1',
        label: 'Za pakovanje',
        value: 'unpacked',
      },
      {
        id: '2',
        label: 'Spakovane',
        value: 'packed',
      },
      {
        id: '3',
        label: 'Sve',
        value: 'packedAndUnpacked',
      },
    ],
    []
  );
  type ActiveProductsParams = {
    packed: boolean;
    unpacked: boolean;
    packedAndUnpacked: boolean;
  };
  const [arePacked, setArePacked] = useState<string>('3');
  useEffect(() => {
    const updateParams: Record<string, ActiveProductsParams> = {
      '1': { unpacked: true, packed: false, packedAndUnpacked: false },
      '2': { unpacked: false, packed: true, packedAndUnpacked: false },
      '3': { packed: false, unpacked: false, packedAndUnpacked: true },
    };
    const params = updateParams[arePacked];
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        updateSearchParam(key as keyof ActiveProductsParams, value);
      });
    }
  }, [arePacked]);

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

  // CATEGORY FILTER
  const couriersCtx = useContext(CouriersContext);
  const [selectedCourier, setSelectedCourier] = useState<CategoryTypes | null>(null);
  useEffect(() => {
    if (selectedCourier && selectedCourier?.name === 'Resetuj izbor') {
      resetDropdown();
      return;
    }
    updateSearchParam('onCourierSearch', selectedCourier?.name);
  }, [selectedCourier]);

  // Category Dropdown Reset
  const [resetKey, setResetKey] = useState(0);
  function resetDropdown() {
    updateSearchParam('onCourierSearch', null);
    setResetKey((prevKey) => prevKey + 1);
    setSelectedCourier(null);
  }

  // DATE PICKER
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const ordersCtx = useContext(OrdersContext);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;

  function formatDateHandler(date: Date) {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  async function handleFetchOrdersByDate(date: Date, token: any) {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    const formattedDate = utcDate.toISOString().split('T')[0]; // Gets 'YYYY-MM-DD' format
    setShowDatePicker(false);
    const response = await fetchData(token, `orders/fetch-by-date/${formattedDate}`);
    if (response === false) popupMessage('Došlo je do problema prilikom preuzimanja podataka o porudžbinama', 'danger');

    popupMessage(response.message, 'success');
    ordersCtx.setCustomOrderSet(response.orders);
    return;
  }
  function handleSetPickedDate(date: Date) {
    const formattedDate = date.toISOString().split('T')[0].split('-').reverse().join('/');
    setPickedDate(formattedDate);
  }
  function handleOpenDatePicker() {
    setShowDatePicker(true);
  }
  const handleDatePick = async (e: NativeSyntheticEvent<DateTimePickerEvent>, selectedDate: Date) => {
    if (e.type === 'set') {
      setDate(selectedDate);
      setIsDatePicked(true);
      // Handle resetting other date picker
      setIsDateForPeriodPicked(false);
      setPickedDateForPeriod('');
      handleSetPickedDate(selectedDate);
      await handleFetchOrdersByDate(selectedDate, token);
    }

    setShowDatePicker(false);
  };
  const handleDateReset = () => {
    setDate(new Date());
    setIsDatePicked(false);
    setShowDatePicker(false);
    setPickedDate('');
    ordersCtx.setCustomOrderSet([]);
  };

  // SIZE FILTER
  const colorsCtx = useContext(ColorsContext);
  const [colorsData, setColorsData] = useState<ColorDataType[]>(colorsCtx.getColorItemsForDropdownList() || []);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  useEffect(() => {
    updateSearchParam('onColorsSearch', selectedColors);
    updateSearchParam('onSizeSearch', selectedSizes);
  }, [selectedColors, selectedSizes]);

  // COLOR FILTER
  interface ColorDataType {
    key: string | number;
    value: string | number;
  }
  useEffect(() => {
    setColorsData(
      colorsCtx.colors.map((item) => ({
        key: item.name,
        value: item.name,
      }))
    );
  }, [colorsCtx.colors]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField
          label="Pretraži porudžbine"
          inputText={searchData}
          setInputText={setSearchData}
          background={colors.background}
          color={colors.defaultText}
          labelBorders={false}
          containerStyles={styles.input}
          displayClearInputButton={true}
          activeColor={colors.highlight}
          selectionColor={colors.highlight}
        />
        <ExpandButton
          isExpanded={isExpanded}
          handleToggleExpand={handleToggleExpand}
          containerStyles={styles.expandButton}
        />
      </View>
      <Animated.View style={[styles.searchParamsContainer, { height: toggleExpandAnimation, opacity: toggleFade }]}>
        <KeyboardAvoidingWrapper>
          <Text style={styles.filtersH1}>Filteri</Text>

          {/* Courier */}
          <View style={styles.courierContainer}>
            <Text style={styles.filtersH2}>Pretraga na osnovu kurira</Text>
            <DropdownList
              key={resetKey}
              data={[{ _id: '', name: 'Resetuj izbor' }, ...couriersCtx.couriers]}
              onSelect={setSelectedCourier}
              placeholder="Izaberite kurira"
              isDefaultValueOn={false}
            />
          </View>

          {/* Ascending | Descending */}
          <View style={[styles.radioGroupContainer]}>
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

          {/* Processed | Unprocessed */}
          <View style={styles.radioGroupContainer}>
            <Text style={styles.filtersH2absolute}>Da li je porudžbina izvršena</Text>
            <View style={styles.radioGroup}>
              <RadioGroup
                radioButtons={processedUnprocessedButtons}
                onPress={setAreProcessedOrders}
                selectedId={areProcessedOrders}
                containerStyle={styles.radioComponentContainer}
                layout="row"
              />
            </View>
          </View>

          {/* Packed | Unpacked */}
          <View style={styles.radioGroupContainer}>
            <Text style={styles.filtersH2absolute}>Da li je porudžbine spakovana</Text>
            <View style={styles.radioGroup}>
              <RadioGroup
                radioButtons={packedUnpackedButtons}
                onPress={setArePacked}
                selectedId={arePacked}
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

          {/* Date Picker */}

          {/* PRETRAGA OD DATUMA PA DO SADA */}
          <DatePickerFromDateToNow
            isDatePicked={isDateForPeriodPicked}
            setIsDatePicked={setIsDateForPeriodPicked}
            setPickedDate={setPickedDateForPeriod}
            resetOtherDatePickers={handleDateReset}
          />

          {/* PRETRAGA PO DATUMU */}
          <View style={[styles.radioGroupContainer, { marginBottom: '20%' }]}>
            {Platform.OS === 'ios' ? (
              <>
                <Text style={styles.filtersH2absolute}>Pretraži po datumu</Text>
                <View style={{ flexDirection: 'row' }}>
                  <View style={{ justifyContent: 'center', alignSelf: 'center', width: '50%' }}>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      is24Hour={true}
                      onChange={handleDatePick}
                      onTouchCancel={handleDateReset}
                    />
                  </View>
                  <Button
                    containerStyles={[styles.dateButton, { width: '50%' }]}
                    onPress={handleDateReset}
                    textColor={colors.defaultText}
                  >
                    Resetuj izbor
                  </Button>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.filtersH2absolute}>Pretraži po datumu</Text>
                <View style={styles.dateButtonsContainer}>
                  <Button
                    containerStyles={styles.dateButton}
                    onPress={handleOpenDatePicker}
                    textColor={colors.defaultText}
                  >
                    Izaberi datum
                  </Button>
                  <Button containerStyles={styles.dateButton} onPress={handleDateReset} textColor={colors.defaultText}>
                    Resetuj izbor
                  </Button>

                  {showDatePicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      is24Hour={true}
                      onChange={handleDatePick}
                      onTouchCancel={handleDateReset}
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
          <View style={{ marginBottom: 26 }}></View>
        </KeyboardAvoidingWrapper>
      </Animated.View>
    </View>
  );
}

interface DatePickerFromDateToNowTypes {
  isDatePicked: boolean;
  setIsDatePicked: (isPicked: boolean) => void;
  setPickedDate: (date: string) => void;
  resetOtherDatePickers: () => void;
}
/**
 * Handles component for fetching orders from certain date until the current moment
 */
function DatePickerFromDateToNow({
  isDatePicked,
  setIsDatePicked,
  setPickedDate,
  resetOtherDatePickers,
}: DatePickerFromDateToNowTypes) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const ordersCtx = useContext(OrdersContext);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const colors = useThemeColors();
  const styles = getStyles(colors);

  async function handleFetchOrdersFromDateToNow(date: Date, token: any) {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    const formattedDate = utcDate.toISOString().split('T')[0]; // Gets 'YYYY-MM-DD' format
    setShowDatePicker(false);

    const response = await fetchData(token, `orders/fetch-for-period-from-date/${formattedDate}`);
    if (response === false) popupMessage('Došlo je do problema prilikom preuzimanja podataka o porudžbinama', 'danger');

    popupMessage(response.message, 'success');
    ordersCtx.setCustomOrderSet(response.orders);
    return;
  }
  function handleSetPickedDate(date: Date) {
    const formattedDate = date.toISOString().split('T')[0].split('-').reverse().join('/');
    setPickedDate(formattedDate);
  }
  function handleOpenDatePicker() {
    setShowDatePicker(true);
  }
  const handleDatePick = async (e: NativeSyntheticEvent<DateTimePickerEvent>, selectedDate: Date) => {
    if (e.type === 'set') {
      setIsDatePicked(true);
      resetOtherDatePickers();
      handleSetPickedDate(selectedDate);
      setDate(selectedDate);

      await handleFetchOrdersFromDateToNow(selectedDate, token);
    }

    setShowDatePicker(false);
  };
  const handleDateReset = () => {
    setDate(new Date());
    setIsDatePicked(false);
    setShowDatePicker(false);
    setPickedDate('');
    ordersCtx.setCustomOrderSet([]);
  };

  function formatDateHandler(date: Date) {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }
  return (
    <View style={styles.radioGroupContainer}>
      {Platform.OS === 'ios' ? (
        <>
          <Text style={styles.filtersH2absolute}>Datum rezervacije</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ justifyContent: 'center', alignSelf: 'center', width: '50%' }}>
              <DateTimePicker
                value={date}
                mode="date"
                is24Hour={true}
                onChange={handleDatePick}
                onTouchCancel={handleDateReset}
              />
            </View>
            <Button
              containerStyles={[styles.dateButton, { width: '50%' }]}
              onPress={handleDateReset}
              textColor={colors.defaultText}
            >
              Resetuj izbor
            </Button>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.filtersH2absolute}>Datum rezervacije</Text>
          <View style={styles.dateButtonsContainer}>
            <Button containerStyles={styles.dateButton} onPress={handleOpenDatePicker} textColor={colors.defaultText}>
              Izaberi datum
            </Button>
            <Button containerStyles={styles.dateButton} onPress={handleDateReset} textColor={colors.defaultText}>
              Resetuj izbor
            </Button>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                is24Hour={true}
                onChange={handleDatePick}
                onTouchCancel={handleDateReset}
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

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      borderColor: colors.borderColor,
      backgroundColor: colors.background,
      paddingBottom: 2,
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 6,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 2,
      backgroundColor: colors.background,
    },
    input: {
      marginTop: 18,
      backgroundColor: colors.background,
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
      marginBottom: 2,
    },
    searchParamsContainer: {
      position: 'relative',
    },
    overlay: {},
    radioGroupContainer: {
      padding: 10,
      borderWidth: 0.7,
      borderColor: colors.borderColor,
      borderRadius: 4,
      marginBottom: 16,
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
      color: colors.defaultText,
      marginBottom: 16,
    },
    filtersH2: {
      fontSize: 14,
      color: colors.defaultText,
      marginBottom: 8,
      backgroundColor: colors.background,
      paddingHorizontal: 14,
    },
    filtersH2absolute: {
      fontSize: 14,
      color: colors.highlightText,
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
      backgroundColor: colors.borderColor,
      color: colors.defaultText,
    },
    dateDisplayContainer: {
      flexDirection: 'column',
      gap: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    dateLabel: {},
    dateText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.highlight,
      lineHeight: 16,
    },
    courierContainer: {
      marginBottom: 10,
    },
  });
}
export default SearchOrders;
