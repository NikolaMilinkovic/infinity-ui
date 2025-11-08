import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { Animated, NativeSyntheticEvent, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useExpandAnimationWithContentVisibility } from '../../hooks/useExpand';
import { NewOrderContext } from '../../store/new-order-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import Button from '../../util-components/Button';
import CustomCheckbox from '../../util-components/CustomCheckbox';
import InputField from '../../util-components/InputField';

interface PropTypes {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  setCustomPrice: (price: string | number) => void;
}

export type NewOrderPreviewRef = {
  handleRecalculatePrice: () => void;
};

const NewOrderPreview = forwardRef<NewOrderPreviewRef, PropTypes>(
  ({ isExpanded, setIsExpanded, setCustomPrice }, ref) => {
    const colors = useThemeColors();
    const styles = getStyles(colors);
    const orderCtx = useContext(NewOrderContext);
    const [itemsPrice, setItemsPrice] = useState<string | number>('N/A');
    const [calculateItemsPrice, setCalculateItemsPrice] = useState(true);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const toggleExpandAnimation = useExpandAnimationWithContentVisibility(
      isExpanded,
      setIsContentVisible,
      0,
      contentHeight,
      280
    );

    // Calculate total article price
    function recalculatePrice() {
      if (orderCtx.productData.length > 0) {
        const calc = orderCtx.productData
          .map((item) => item.itemReference.price)
          .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        setItemsPrice(calc);
        if (calculateItemsPrice) {
          if (orderCtx.courierData) setCustomPrice((calc + orderCtx.courierData?.deliveryPrice).toString());
        }
      } else {
        setItemsPrice(0);
        orderCtx.setCustomPrice(orderCtx.courierData?.deliveryPrice.toString() || '');
      }
    }
    useEffect(() => {
      if (calculateItemsPrice) {
        recalculatePrice();
      }
    }, [orderCtx.productData, orderCtx.courierData, recalculatePrice]);

    function handleToggleExpand() {
      setIsExpanded(!isExpanded);
    }

    // DATE PICKER
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [pickedDateDisplay, setPickedDateDisplay] = useState<Date | string>(new Date());
    function formatDateHandler(date: Date) {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    }

    function handleSetPickedDate(date: Date) {
      const formattedDate = date.toISOString().split('T')[0].split('-').reverse().join('/');
      setPickedDateDisplay(formattedDate);
    }
    function handleOpenDatePicker() {
      setShowDatePicker(true);
    }
    const handleDatePick = async (e: NativeSyntheticEvent<DateTimePickerEvent>, selectedDate: Date) => {
      if (e.type === 'set') {
        orderCtx.setReservationDate(selectedDate);
        // setIsDatePicked(true);
        // await handleFetchReservationsByDate(selectedDate, token);
        handleSetPickedDate(selectedDate);
      }

      setShowDatePicker(false);
    };
    const handleDateReset = () => {
      orderCtx.setReservationDate(null);
      setShowDatePicker(false);
      setPickedDateDisplay('');
    };

    // Handles manual user input, turns off automatic price calculation
    function handleUserManualPriceInput() {
      if (calculateItemsPrice === false) return;
      setCalculateItemsPrice(false);
    }

    function handleRecalculatePrice() {
      setCalculateItemsPrice(true);
    }
    useImperativeHandle(ref, () => ({
      handleRecalculatePrice,
    }));

    return (
      <>
        {/* TOGGLE BUTTON */}
        <Pressable onPress={handleToggleExpand} style={styles.headerContainer}>
          <Text style={styles.header}>Pregled nove porudžbine</Text>
          <Icon
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            style={styles.iconStyle}
            size={26}
            color={colors.whiteText}
          />
        </Pressable>

        {isContentVisible && (
          <Animated.ScrollView style={{ height: toggleExpandAnimation, flex: 1 }}>
            <View
              style={styles.container}
              onLayout={(e) => {
                setContentHeight(e.nativeEvent.layout.height);
              }}
            >
              {/* BUYER INFORMATION */}
              <View style={styles.buyerInfoContainer}>
                <Text style={styles.header2}>Informacije o kupcu</Text>

                {/* NAME */}
                <View style={styles.rowContainer}>
                  <Text style={styles.label}>Ime:</Text>
                  <Text style={styles.information}>{orderCtx.buyerData?.name || 'N/A'}</Text>
                </View>

                {/* ADDRESS */}
                <View style={styles.rowContainer}>
                  <Text style={styles.label}>Adresa:</Text>
                  <Text style={styles.information}>{orderCtx.buyerData?.address || 'N/A'}</Text>
                </View>

                {/* PLACE */}
                <View style={styles.rowContainer}>
                  <Text style={styles.label}>Mesto:</Text>
                  <Text style={styles.information}>{orderCtx.buyerData?.place || 'N/A'}</Text>
                </View>

                {/* PHONE */}
                <View style={styles.rowContainer}>
                  <Text style={styles.label}>Telefon:</Text>
                  <Text style={styles.information}>{orderCtx.buyerData?.phone || 'N/A'}</Text>
                </View>

                {/* PHONE2 */}
                {orderCtx.buyerData?.phone2 !== '' && (
                  <View style={styles.rowContainer}>
                    <Text style={styles.label}>Dodatni telefon:</Text>
                    <Text style={styles.information}>{orderCtx.buyerData?.phone2 || 'N/A'}</Text>
                  </View>
                )}
              </View>

              {/* SELECTED PRODUCTS */}
              <View style={styles.selectedItemsContainer}>
                <Text style={styles.header2}>Izabrani proizvodi ({orderCtx.productData.length}) :</Text>
                {orderCtx?.productData.map((item, index) => (
                  <View
                    style={[
                      styles.selectedItem,
                      index === orderCtx.productData.length - 1 ? styles.lastItemStyle : null,
                    ]}
                    key={index}
                  >
                    <View style={styles.rowContainer}>
                      <Text style={styles.label}>Artikal:</Text>
                      <Text style={styles.information}>{item.itemReference.name || 'N/A'}</Text>
                    </View>
                    <View style={styles.rowContainer}>
                      <Text style={styles.label}>Kategorija:</Text>
                      <Text style={styles.information}>{item.itemReference.category || 'N/A'}</Text>
                    </View>
                    <View style={styles.rowContainer}>
                      <Text style={styles.label}>Boja:</Text>
                      <Text style={styles.information}>{item.selectedColor || 'N/A'}</Text>
                    </View>
                    {item.hasOwnProperty('selectedSize') && (
                      <View style={styles.rowContainer}>
                        <Text style={styles.label}>Veličina:</Text>
                        <Text style={styles.information}>{item.selectedSize || 'N/A'}</Text>
                      </View>
                    )}
                    <View style={styles.rowContainer}>
                      <Text style={styles.label}>Cena:</Text>
                      <Text style={styles.information}>{`${item.itemReference.price} din` || 'N/A'}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.otherInfoContainer}>
                <Text style={styles.header2}>Rezervacija:</Text>
                <View style={styles.rowContainer}>
                  <CustomCheckbox
                    label={'Da'}
                    checked={orderCtx.isReservation === true}
                    onCheckedChange={() => orderCtx.setIsReservation(true)}
                  />
                  <CustomCheckbox
                    label={'Ne'}
                    checked={orderCtx.isReservation === false}
                    onCheckedChange={() => orderCtx.setIsReservation(false)}
                  />
                </View>

                {/* DATE PICKER */}
                {orderCtx.isReservation === true && (
                  <>
                    {Platform.OS === 'ios' ? (
                      <View style={[styles.radioGroupContainer, { flexDirection: 'column' }]}>
                        <Text style={styles.filtersH2absolute}>Datum rezervacije</Text>
                        <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                          <DateTimePicker
                            value={orderCtx.reservationDate}
                            mode="date"
                            onChange={handleDatePick}
                            onTouchCancel={handleDateReset}
                            themeVariant={'light'}
                            accentColor={colors.highlight}
                          />
                        </View>
                      </View>
                    ) : (
                      <View style={[styles.radioGroupContainer, { flexDirection: 'column' }]}>
                        {orderCtx.reservationDate && pickedDateDisplay && (
                          <View style={styles.dateDisplayContainer}>
                            <Text style={styles.dateLabel}>Izabrani datum:</Text>
                            <Text style={styles.dateText}>{formatDateHandler(orderCtx.reservationDate)}</Text>
                          </View>
                        )}
                        <Text style={styles.filtersH2absolute}>Datum rezervacije</Text>
                        <View style={styles.dateButtonsContainer}>
                          <Button
                            containerStyles={styles.dateButton}
                            onPress={handleOpenDatePicker}
                            backColor={colors.buttonNormal1}
                            backColor1={colors.buttonNormal2}
                            textStyles={{ color: colors.defaultText }}
                          >
                            Izaberi datum
                          </Button>
                          {showDatePicker && (
                            <DateTimePicker
                              value={orderCtx.reservationDate}
                              mode="date"
                              onChange={handleDatePick}
                              onTouchCancel={handleDateReset}
                              accentColor={colors.highlight}
                            />
                          )}
                        </View>
                      </View>
                    )}
                  </>
                )}

                <Text style={styles.header2}>Ostale informacije:</Text>
                <View style={styles.rowContainer}>
                  <Text style={styles.label}>Težina:</Text>
                  <Text style={styles.information}>{orderCtx?.weight} kg</Text>
                </View>
                <View style={styles.rowContainer}>
                  <Text style={styles.label}>Kurir:</Text>
                  <Text style={styles.information}>{orderCtx.courierData?.name}</Text>
                </View>
                <View style={styles.rowContainer}>
                  <Text style={styles.label}>Cena dostave:</Text>
                  <Text style={styles.information}>{Number(orderCtx.courierData?.deliveryPrice) | 0} din</Text>
                </View>
                <View style={styles.rowContainer}>
                  <Text style={styles.label}>Ukupna cena artikala:</Text>
                  <Text style={styles.information}>{Number(itemsPrice) || 0} din</Text>
                </View>
                {/* Final price */}
                <View style={styles.rowContainer}>
                  <Text style={styles.label}>Ukupno:</Text>
                  <Text style={styles.information}>
                    {Number(itemsPrice) + Number(orderCtx.courierData?.deliveryPrice) || 0} din
                  </Text>
                </View>
                <View style={styles.priceContainer}>
                  <InputField
                    label="Finalna cena"
                    inputText={orderCtx.customPrice}
                    setInputText={orderCtx.setCustomPrice}
                    containerStyles={styles.customPriceInput}
                    background={colors.background}
                    keyboard="numeric"
                    selectTextOnFocus={true}
                    onManualInput={handleUserManualPriceInput}
                    labelBorders={false}
                    labelStyles={{ color: colors.defaultText }}
                    activeColor={colors.grayText}
                  />
                  {!calculateItemsPrice && (
                    <Button
                      containerStyles={styles.recalculatePriceBtn}
                      textStyles={{ color: colors.defaultText }}
                      onPress={() => setCalculateItemsPrice(true)}
                      backColor={colors.buttonNormal1}
                      backColor1={colors.buttonNormal2}
                    >
                      Preračunaj cenu
                    </Button>
                  )}
                </View>
              </View>
            </View>
          </Animated.ScrollView>
        )}
      </>
    );
  }
);

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 8,
    },
    headerContainer: {
      padding: 10,
      borderRadius: 4,
      borderWidth: 0,
      borderColor: colors.secondaryLight,
      backgroundColor: colors.secondaryDark,
      marginBottom: 6,
      flexDirection: 'row',
      flex: 1,
    },
    iconStyle: {
      marginLeft: 'auto',
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.whiteText,
    },
    buyerInfoContainer: {
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      borderRadius: 4,
      padding: 10,
      backgroundColor: colors.background,
    },
    header2: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 6,
      color: colors.highlightText,
    },
    rowContainer: {
      flexDirection: 'row',
      flex: 1,
      width: '100%',
      marginLeft: 8,
    },
    label: {
      flex: 2,
      color: colors.grayText,
    },
    information: {
      flex: 2.5,
      color: colors.defaultText,
    },
    selectedItemsContainer: {
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      borderRadius: 4,
      padding: 10,
      marginVertical: 8,
      paddingBottom: 0,
      backgroundColor: colors.background,
    },
    selectedItem: {
      borderBottomWidth: 0.5,
      borderColor: colors.borderColor,
      borderRadius: 4,
      paddingVertical: 8,
    },
    lastItemStyle: {
      borderBottomWidth: 0,
    },
    otherInfoContainer: {
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      borderRadius: 4,
      padding: 10,
      marginBottom: 8,
      position: 'relative',
      backgroundColor: colors.background,
    },
    editButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    editIcon: {},
    customPriceInput: {
      marginTop: 16,
      flex: 1,
    },
    deliveryRemarkInput: {
      marginTop: 16,
      justifyContent: 'flex-start',
      textAlignVertical: 'top',
    },
    dateButtonsContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    dateButton: {
      flex: 1,
      color: colors.defaultText,
    },
    dateDisplayContainer: {
      flexDirection: 'column',
      gap: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dateLabel: {
      color: colors.defaultText,
    },
    dateText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.highlight1,
      lineHeight: 16,
      marginBottom: 8,
    },
    filtersH2absolute: {
      fontSize: 14,
      color: colors.borderColor,
      marginBottom: 8,
      position: 'absolute',
      left: 10,
      top: -12,
      backgroundColor: colors.background,
      borderRadius: 4,
      paddingHorizontal: 4,
    },
    radioGroupContainer: {
      padding: 10,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      borderRadius: 4,
      marginBottom: 8,
      paddingTop: 20,
      marginTop: 10,
    },
    priceContainer: {
      flexDirection: 'row',
      flex: 1,
      gap: 10,
    },
    recalculatePriceBtn: {
      flex: 1,
      maxHeight: 44,
      marginTop: 'auto',
      textAlign: 'center',
      justifyContent: 'center',
      maxWidth: 150,
      padding: 1,
    },
  });
}

export default NewOrderPreview;
