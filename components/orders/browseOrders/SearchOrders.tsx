import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native'
import InputField from '../../../util-components/InputField'
import { Colors } from '../../../constants/colors';
import { useExpandAnimation } from '../../../hooks/useExpand';
import { useToggleFadeAnimation } from '../../../hooks/useFadeAnimation';
import ExpandButton from '../../../util-components/ExpandButton';
import { RadioButtonProps, RadioGroup } from 'react-native-radio-buttons-group';
import Button from '../../../util-components/Button';
import { CategoryTypes } from '../../../types/allTsTypes';
import DropdownList from '../../../util-components/DropdownList';
import { CouriersContext } from '../../../store/couriers-context';
import { fetchData, fetchWithBodyData } from '../../../util-methods/FetchMethods';
import { popupMessage } from '../../../util-components/PopupMessage';
import { OrdersContext } from '../../../store/orders-context';
import { AuthContext } from '../../../store/auth-context';
import { betterConsoleLog } from '../../../util-methods/LogMethods';
import DateTimePicker from '@react-native-community/datetimepicker';

interface PropTypes {
  searchData: string
  setSearchData: (data: string | number | undefined) => void
  updateSearchParam: (data: boolean) => void
  isDatePicked: boolean
  setIsDatePicked: (isDatePicked: boolean) => void
  setPickedDate: (date:string) => void
}
function SearchOrders({ searchData, setSearchData, updateSearchParam, isDatePicked, setIsDatePicked, setPickedDate }: PropTypes) {
  const [isExpanded, setIsExpanded] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const toggleExpandAnimation = useExpandAnimation(isExpanded, 10, screenHeight - 172, 180);
  const toggleFade = useToggleFadeAnimation(isExpanded, 180);
  function handleToggleExpand(){
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  }

    // PROCESSED | UNPROCESSED RADIO BUTTONS
    const processedUnprocessedButtons: RadioButtonProps[] = useMemo(() => ([
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
    ]), []);
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
    const packedUnpackedButtons: RadioButtonProps[] = useMemo(() => ([
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
    ]), []);
    type ActiveProductsParams = {
      packed: boolean;
      unpacked: boolean;
    };
    const [arePacked, setArePacked] = useState<string>('1');
    useEffect(() => {
      const updateParams: Record<string, ActiveProductsParams> = {
        '1': { unpacked: true, packed: false },
        '2': { unpacked: false, packed: true },
      };
      const params = updateParams[arePacked];
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          updateSearchParam(key as keyof ActiveProductsParams, value);
        });
      }
    }, [arePacked]);

    // ASCENDING | DESCENDING RADIO BUTTONS
    const ascendDescendFilterButtons: RadioButtonProps[] = useMemo(() => ([
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
    ]), []);
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
      }
      updateSearchParam('onCourierSearch', selectedCourier?.name);
    }, [selectedCourier]);



    // DATE PICKER
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState( new Date() );
    const ordersCtx = useContext(OrdersContext);
    const authCtx = useContext(AuthContext);
    const token = authCtx.token;

    function formatDateHandler(date: Date){
      return date.toLocaleDateString(
        'en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }
      )
    }


    async function handleFetchOrdersByDate(date: Date, token: any){
      const formattedDate = date.toISOString().split('T')[0];      
      setShowDatePicker(false);
      const response = await fetchData(token, `orders/fetch-by-date/${formattedDate}`);
      if(response === false) popupMessage('Došlo je do problema prilikom preuzimanja podataka o porudžbinama', 'danger');

      betterConsoleLog('> Logging response', response);
      popupMessage(response.message, 'success');
      ordersCtx.setCustomOrderSet(response.orders)
      return;
    }
    function handleSetPickedDate(date: Date){
      const formattedDate = date.toISOString().split('T')[0].split('-').reverse().join('/');
      setPickedDate(formattedDate);
    }
    function handleOpenDatePicker(){
      setShowDatePicker(true);
    }
    const handleDatePick = async (e, selectedDate: Date) => {
      if (selectedDate) {
        setDate(selectedDate);
        setIsDatePicked(true);
        await handleFetchOrdersByDate(selectedDate, token);
        handleSetPickedDate(selectedDate);
      }
      setShowDatePicker(false);
    }
    const handleDateReset = () => {
      setDate(new Date());
      setIsDatePicked(false);
      setShowDatePicker(false);
      setPickedDate('');
      ordersCtx.setCustomOrderSet([]);
    }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField
          label='Pretraži porudžbine'
          inputText={searchData}
          setInputText={setSearchData}
          background={Colors.white}
          color={Colors.primaryDark}
          labelBorders={false}
          containerStyles={styles.input}
        />
        <ExpandButton
          isExpanded={isExpanded}
          handleToggleExpand={handleToggleExpand}
          containerStyles={styles.expandButton}
        />
      </View>
      <Animated.ScrollView style={[styles.searchParamsContainer, { height: toggleExpandAnimation }]}>
          <Animated.ScrollView style={{ opacity: toggleFade }}>
            <Text style={styles.filtersH1}>Filteri</Text>
          </Animated.ScrollView>

          {/* Courier */}
          <View style={styles.courierContainer}>
            <Text style={styles.filtersH2}>Pretraga na osnovu kurira</Text>
            <DropdownList
              data={couriersCtx.couriers}
              onSelect={setSelectedCourier}
              placeholder='Izaberite kurira'
              defaultValue={couriersCtx.couriers[1].name}
            />
          </View>

          {/* Date Picker */}
          <View style={styles.radioGroupContainer}>
          <Text style={styles.filtersH2absolute}>Pretrazi po datumu</Text>
            <View style={styles.dateButtonsContainer}>
              <Button
                containerStyles={styles.dateButton}
                onPress={handleOpenDatePicker}
              >
                Izaberi datum
              </Button>
              <Button
                containerStyles={styles.dateButton}
                onPress={handleDateReset}
              >
                Resetuj izbor
              </Button>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode='date'
                is24Hour={true}
                onChange={handleDatePick}
              />
            )}
            {date && isDatePicked && (
              <View style={styles.dateDisplayContainer}>
                <Text style={styles.dateLabel}>Izabrani datum:</Text>
                <Text style={styles.dateText}>{formatDateHandler(date)}</Text>
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
                layout='row'
              />
            </View>
          </View>

          {/* Processed | Unprocessed */}
          {!isDatePicked && (
            <View style={styles.radioGroupContainer}>
              <Text style={styles.filtersH2absolute}>Da li je porudžbina izvršena</Text>
              <View style={styles.radioGroup}>
                <RadioGroup 
                  radioButtons={processedUnprocessedButtons} 
                  onPress={setAreProcessedOrders}
                  selectedId={areProcessedOrders}
                  containerStyle={styles.radioComponentContainer}
                  layout='row'
                />
              </View>
            </View>
          )}

          {/* Packed | Unpacked */}
          <View style={styles.radioGroupContainer}>
            <Text style={styles.filtersH2absolute}>Da li je porudžbine spakovana</Text>
            <View style={styles.radioGroup}>
              <RadioGroup 
                radioButtons={packedUnpackedButtons} 
                onPress={setArePacked}
                selectedId={arePacked}
                containerStyle={styles.radioComponentContainer}
                layout='row'
              />
            </View>
          </View>

          {/* CLOSE BUTTON */}
          <Animated.View style={{ opacity: toggleFade, pointerEvents: isExpanded ? 'auto' : 'none' }}>
            <Button
              onPress={() => setIsExpanded(!isExpanded)}
              backColor={Colors.highlight}
              textColor={Colors.white}
              containerStyles={{ marginBottom: 16, marginTop: 10}}
            >
              Zatvori
            </Button>
          </Animated.View>
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.white,
    paddingVertical: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginTop: 18,
    backgroundColor: Colors.white,
    flex: 7,
    height: 50
  },
  expandButton: {
    position: 'relative',
    flex: 1.5,
    marginLeft: 10,
    height: 45,
    right: 0,
    top: 10
  },
  searchParamsContainer: {
  },
  overlay: {
  },
  radioGroupContainer: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
    marginBottom: 8,
    paddingTop: 20,
    marginTop: 10,
  },
  radioGroup: {
  },
  radioComponentContainer: {
    justifyContent: 'flex-start',
  },
  filtersH1: {
    marginTop: 32,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryDark
  },
  filtersH2: {
    fontSize: 14,
    color: Colors.primaryDark,
    marginBottom: 8,
    backgroundColor: Colors.white,
    paddingHorizontal: 14
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
    paddingHorizontal: 4
  },
  dateButtonsContainer: {
    flexDirection: 'row',
    gap: 10
  },
  dateButton: {
    flex: 1,
    backgroundColor: Colors.secondaryLight,
    color: Colors.primaryDark
  },
  dateDisplayContainer: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabel: {
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.highlight,
    lineHeight: 16,
  },
  courierContainer: {
    marginBottom: 10,
  }
})

export default SearchOrders