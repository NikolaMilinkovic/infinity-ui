import React, { useContext, useEffect, useState } from 'react'
import { Animated, NativeSyntheticEvent, Pressable, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../constants/colors';
import { NewOrderContext } from '../../store/new-order-context';
import { popupMessage } from '../../util-components/PopupMessage';
import InputField from '../../util-components/InputField';
import CustomCheckbox from '../../util-components/CustomCheckbox';
import Button from '../../util-components/Button';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';


interface PropTypes {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  customPrice: string | number
  setCustomPrice: (price: string | number) => void
}


function NewOrderPreview({ isExpanded, setIsExpanded, customPrice, setCustomPrice }: PropTypes) {
  const orderCtx = useContext(NewOrderContext)
  const [itemsPrice, setItemsPrice] = useState<string | number>('N/A');

  // Calculate total article price
  useEffect(() => {
    if(orderCtx.productData.length > 0){
      const calc = orderCtx.productData.map((item) => item.itemReference.price)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

      setItemsPrice(calc);
      if(orderCtx.courierData)
        setCustomPrice((calc + orderCtx.courierData?.deliveryPrice).toString());
    } else {
      setItemsPrice(0);
      orderCtx.setCustomPrice(orderCtx.courierData?.deliveryPrice.toString() || '');
    }
  }, [orderCtx.productData, orderCtx.courierData])

  function handleToggleExpand(){
    setIsExpanded(!isExpanded)
  }

  // DATE PICKER
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickedDateDisplay, setPickedDateDisplay] = useState<Date | string>( new Date() );
  function formatDateHandler(date: Date){
    return date.toLocaleDateString(
      'en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }
    )
  }

  function handleSetPickedDate(date: Date){
    const formattedDate = date.toISOString().split('T')[0].split('-').reverse().join('/');
    setPickedDateDisplay(formattedDate);
  }
  function handleOpenDatePicker(){
    setShowDatePicker(true);
  }
  const handleDatePick = async (e:NativeSyntheticEvent<DateTimePickerEvent>, selectedDate: Date) => {
    if(e.type === "set"){
      orderCtx.setReservationDate(selectedDate);
      // setIsDatePicked(true);
      // await handleFetchReservationsByDate(selectedDate, token);
      handleSetPickedDate(selectedDate);
    }

    setShowDatePicker(false);
  }
  const handleDateReset = () => {
    orderCtx.setReservationDate(null);
    setShowDatePicker(false);
    setPickedDateDisplay('');
  }

  return (
    <Animated.ScrollView>
      {/* TOGGLE BUTTON */}
      <Pressable onPress={handleToggleExpand} style={styles.headerContainer}>
        <Text style={styles.header}>Pregled nove porudžbine</Text>
        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} style={styles.iconStyle} size={26} color={Colors.white}/>
      </Pressable>
      
      {isExpanded &&(
        <View style={styles.container}>

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
            {/* EDIT FIELDS BUTTON */}
            {/* <Pressable onPress={() => setShowEdit(!showEdit)} style={styles.editButton}>
              <Icon name={showEdit ? 'file-edit-outline' : 'cancel'} style={styles.editIcon} size={28} color={Colors.primaryDark}/>
            </Pressable> */}
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
            <View style={styles.radioGroupContainer}>
            {orderCtx.reservationDate && pickedDateDisplay && (
              <View style={styles.dateDisplayContainer}>
                {/* <Text style={styles.dateLabel}>Izabrani datum:</Text> */}
                <Text style={styles.dateText}>{formatDateHandler(orderCtx.reservationDate)}</Text>
              </View>
            )}
            <Text style={styles.filtersH2absolute}>Datum rezervacije</Text>
              <View style={styles.dateButtonsContainer}>
                <Button
                  containerStyles={styles.dateButton}
                  onPress={handleOpenDatePicker}
                >
                  Izaberi datum
                </Button>
              </View>

              {showDatePicker && (
                <DateTimePicker
                  value={orderCtx.reservationDate}
                  mode='date'
                  is24Hour={true}
                  onChange={handleDatePick}
                  onTouchCancel={handleDateReset}
                />
              )}
            </View>
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
              <Text style={styles.information}>{Number(itemsPrice) + Number(orderCtx.courierData?.deliveryPrice) || 0} din</Text>
            </View>
            <InputField
              label='Finalna cena'
              inputText={orderCtx.customPrice}
              setInputText={orderCtx.setCustomPrice}
              containerStyles={styles.customPriceInput}
              background={Colors.white}
              keyboard='numeric'
              selectTextOnFocus={true}
            />
          </View>
        </View>
      )}
    </Animated.ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8
  },
  headerContainer: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.secondaryDark,
    marginBottom: 6,
    flexDirection: 'row'
  },
  iconStyle: {
    marginLeft:'auto'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white
  },
  buyerInfoContainer: {
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
    padding: 10,
  },
  header2: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  rowContainer: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    marginLeft: 8
  },
  label: {
    flex: 2,
  },
  information: {
    flex: 2.5,
  },
  selectedItemsContainer: {
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
    padding: 10,
    marginVertical: 8,
    paddingBottom: 0,
  },
  selectedItem: {
    borderBottomWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
    paddingVertical: 8,
  },
  lastItemStyle: {
    borderBottomWidth: 0
  },
  otherInfoContainer: {
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
    padding: 10,
    marginBottom: 8,
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  editIcon: {

  },
  customPriceInput: {
    marginTop: 16
  },
  deliveryRemarkInput: {
    marginTop: 16,
    justifyContent: 'flex-start',
    textAlignVertical: 'top'
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
    marginBottom: 8,
  },
  filtersH2absolute: {
    fontSize: 14,
    color: Colors.primaryDark,
    marginBottom: 8,
    position: 'absolute',
    left: 10,
    top: -12,
    backgroundColor: Colors.primaryLight,
    borderRadius: 4,
    paddingHorizontal: 4
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
})

export default NewOrderPreview