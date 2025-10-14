import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../../constants/colors';
import { AuthContext } from '../../../../store/auth-context';
import { CouriersContext } from '../../../../store/couriers-context';
import { CourierTypesWithNoId, OrderTypes, ProductTypes } from '../../../../types/allTsTypes';
import Button from '../../../../util-components/Button';
import CustomCheckbox from '../../../../util-components/CustomCheckbox';
import DropdownList from '../../../../util-components/DropdownList';
import InputField from '../../../../util-components/InputField';
import KeyboardAvoidingWrapper from '../../../../util-components/KeyboardAvoidingWrapper';
import { popupMessage } from '../../../../util-components/PopupMessage';
import { handleFetchingWithBodyData, handleFetchingWithFormData } from '../../../../util-methods/FetchMethods';
import { getMimeType } from '../../../../util-methods/ImageMethods';
import { betterErrorLog } from '../../../../util-methods/LogMethods';
import AddItemsModal from './addItemsModal/AddItemsModal';
import BuyerDataInputs from './BuyerDataInputs';
import ProductDisplay from './ProductDisplay';

interface PropTypes {
  editedOrder: OrderTypes | null;
  setEditedOrder: (order: OrderTypes | null) => void;
  onBackClickMethod?: () => void;
}
interface CourierTypes {
  _id: string;
  name: string;
  deliveryPrice: number;
}

function EditOrder({ editedOrder, setEditedOrder }: PropTypes) {
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const couriersCtx = useContext(CouriersContext);
  const [name, setName] = useState<string | number | undefined>(editedOrder?.buyer.name || '');
  const [address, setAddress] = useState<string | number | undefined>(editedOrder?.buyer.address || '');
  const [place, setPlace] = useState<string>(editedOrder?.buyer.place || '');
  const [phone, setPhone] = useState<string | number | undefined>(editedOrder?.buyer.phone || '');
  const [phone2, setPhone2] = useState<string | number | undefined>(editedOrder?.buyer.phone2 || '');
  const [profileImage, setProfileImage] = useState(editedOrder?.buyer.profileImage || '');
  const [originalImage] = useState(editedOrder?.buyer?.profileImage?.uri || '');

  // const [buyer, setBuyer] = useState({
  //   name: editedOrder?.buyer.name || '',
  //   address: editedOrder?.buyer.address || '',
  //   place: editedOrder?.buyer.place || '',
  //   phone: editedOrder?.buyer.phone || '',
  //   phone2: editedOrder?.buyer.phone2 || '',
  //   profileImage: editedOrder?.buyer.profileImage || '',
  // });

  const [courier, setCourier] = useState<CourierTypesWithNoId>(editedOrder?.courier as CourierTypesWithNoId);
  const [courierDropdownData, setCourierDropdownData] = useState<CourierTypes[]>([]);

  const [products, setProducts] = useState<any>(editedOrder?.products);

  const [isReservation, setIsReservation] = useState(editedOrder?.reservation);
  const [reservationDate, setReservationDate] = useState(
    new Date(editedOrder?.reservationDate ? editedOrder.reservationDate : new Date())
  );
  const [orderNotes, setOrderNotes] = useState(editedOrder?.orderNotes || '');
  const [deliveryNotes, setDeliveryNotes] = useState(editedOrder?.deliveryRemark || '');
  const [isPacked, setIsPacked] = useState(editedOrder?.packed);

  const [productsPrice, setProductsPrice] = useState(editedOrder?.productsPrice);
  const [deliveryPrice, setDeliveryPrice] = useState(editedOrder?.courier?.deliveryPrice);
  const [totalPrice, setTotalPrice] = useState(
    (editedOrder?.courier?.deliveryPrice || 0) + sumProductPrices(editedOrder?.products || [])
  );
  const [customPrice, setCustomPrice] = useState(editedOrder?.totalPrice.toString() ?? '');

  function sumProductPrices(products: ProductTypes[]) {
    return products.reduce((total, product) => total + product.price, 0);
  }

  const authCtx = useContext(AuthContext);
  const token = authCtx.token || '';

  async function handleUpdateMethod() {
    try {
      if (profileImage?.uri === originalImage) {
        await handleUpdateOrderWithBodyData();
      } else {
        await handleUpdateOrderWithFormData();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  }
  async function handleUpdateOrderWithFormData() {
    try {
      const data: any = new FormData();
      if (profileImage) {
        data.append('profileImage', {
          uri: profileImage.uri,
          type: getMimeType(profileImage?.mimeType || '', profileImage.uri),
          name: profileImage?.imageName || profileImage?.fileName,
        } as any);
      }

      data.append('name', name);
      data.append('address', address);
      data.append('place', place);
      data.append('phone', phone);
      data.append('phone2', phone2);
      data.append('courier', JSON.stringify(courier) as string);
      data.append('products', JSON.stringify(products) as string);
      data.append('isReservation', isReservation ? 'true' : 'false');
      data.append('isPacked', isPacked ? 'true' : 'false');
      data.append('productsPrice', productsPrice);
      data.append('customPrice', customPrice !== '' ? customPrice : totalPrice);
      if (isReservation === true) data.append('reservationDate', reservationDate.toISOString());
      data.append('orderNotes', orderNotes || '');
      data.append('deliveryNotes', deliveryNotes || '');

      const response = await handleFetchingWithFormData(data, token, `orders/update/${editedOrder?._id}`, 'PATCH');

      if (!response.ok) {
        const parsedResponse = await response?.json();
        return popupMessage(parsedResponse.message, 'danger');
      } else {
        const parsedResponse = await response?.json();
        setEditedOrder(null);
        return popupMessage(parsedResponse.message, 'success');
      }
    } catch (error) {
      betterErrorLog('> Error while updating an order', error);
      popupMessage('Došlo je do problema prilikom ažuriranja porudžbine', 'danger');
    }
  }
  async function handleUpdateOrderWithBodyData() {
    try {
      const data = {
        name,
        address,
        place,
        phone,
        phone2,
        courier,
        products,
        isReservation,
        isPacked,
        productsPrice,
        customPrice: customPrice !== '' ? customPrice : totalPrice,
        orderNotes,
        reservationDate,
        deliveryNotes,
      };
      const response = await handleFetchingWithBodyData(data, token, `orders/update/${editedOrder?._id}`, 'PATCH');

      if (!response?.ok) {
        const parsedResponse = await response?.json();
        return popupMessage(parsedResponse.message, 'danger');
      } else {
        const parsedResponse = await response?.json();
        setEditedOrder(null);
        return popupMessage(parsedResponse.message, 'success');
      }
    } catch (error) {
      betterErrorLog('> Error while updating an order', error);
      popupMessage('Došlo je do problema prilikom ažuriranja porudžbine', 'danger');
    }
  }

  // TOTAL PRICE CALCULATIONS AND LOGIC
  // Ako imamo custom cenu palimo automatsko preracunavanje cene
  const [calculateItemsPrice, setCalculateItemsPrice] = useState(customPrice.toString() === totalPrice.toString());

  // reCalculate total price
  const recalculatePrice = useCallback(() => {
    if (products && products.length > 0) {
      const productsCalc = products
        .map((item) => item.price)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

      setCustomPrice(productsCalc);
      if (calculateItemsPrice) {
        if (deliveryPrice) {
          setCustomPrice((Number(productsCalc) + Number(deliveryPrice)).toString());
        }
      }
    } else {
      // setCustomPrice(0);
      setCustomPrice(deliveryPrice?.toString() || '0');
    }
  }, [products, calculateItemsPrice, deliveryPrice]);

  // Updates the Ukupno i Cena proizvoda texts
  // Preskacemo prvi render kako ne bi opet calc cenu u input field
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (calculateItemsPrice && customPrice !== '0') {
      recalculatePrice();
    }
    let newVal = 0;
    products.forEach((product: ProductTypes) => {
      newVal += product.price;
    });
    setProductsPrice(newVal);
    setTotalPrice(newVal + courier.deliveryPrice);
  }, [products, courier.deliveryPrice, recalculatePrice]);

  function handleUserManualPriceInput() {
    if (calculateItemsPrice === false) return;
    setCalculateItemsPrice(false);
  }

  // Sets the displayed custom price, since we are calculating the custom price render
  // this will bypass setting the newly calculated custom price upon rendering
  useEffect(() => {
    let dp = deliveryPrice ? deliveryPrice : 0;
    let pp = productsPrice ? productsPrice : 0;
    let price = dp + pp;
    if (Number(editedOrder?.totalPrice) === Number(price)) {
      setCustomPrice(price);
    } else {
      setCustomPrice(editedOrder?.totalPrice);
    }
  }, []);

  // Courier update handler
  useEffect(() => {
    const dropdownData = couriersCtx.couriers.map((courier) => ({
      _id: courier._id,
      name: courier.name,
      deliveryPrice: courier.deliveryPrice,
    }));
    if (dropdownData) {
      setCourierDropdownData(dropdownData);
    }
  }, [couriersCtx.couriers, setCourierDropdownData]);

  function handleShowAddItemComponent() {
    setShowAddItemModal(true);
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
      setReservationDate(selectedDate);
      handleSetPickedDate(selectedDate);
    }

    setShowDatePicker(false);
  };
  const handleDateReset = () => {
    setReservationDate(new Date());
    setShowDatePicker(false);
    setPickedDateDisplay('');
  };

  return (
    <KeyboardAvoidingWrapper style={{ backgroundColor: 'red' }}>
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.modalHeader} numberOfLines={2} ellipsizeMode="tail">
            Porudžbina: {editedOrder?.buyer.name}, {editedOrder?.buyer.address}
          </Text>
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.card}>
            {/* Buyer data */}
            <Text style={styles.sectionLabel}>Podaci o kupcu</Text>
            <BuyerDataInputs
              name={name}
              setName={setName}
              address={address}
              setAddress={setAddress}
              place={place}
              setPlace={setPlace}
              phone={phone}
              phone2={phone2}
              setPhone2={setPhone2}
              setPhone={setPhone}
              orderNotes={orderNotes}
              setOrderNotes={setOrderNotes}
              deliveryNotes={deliveryNotes}
              setDeliveryNotes={setDeliveryNotes}
              profileImage={profileImage}
              setProfileImage={setProfileImage}
            />

            {/* Courier data */}
            <Text style={styles.sectionLabel}>Izabrani kurir</Text>
            <View style={styles.sectionContainer}>
              <DropdownList
                data={courierDropdownData}
                onSelect={(courier) => {
                  setCourier(courier);
                  setDeliveryPrice(courier.deliveryPrice);
                }}
                isDefaultValueOn={true}
                placeholder="Izaberite kurira za dostavu"
                defaultValue={courier.name}
              />
              {/* <DropdownList2
              data={courierDropdownData}
              value={courier as any}
              placeholder="Izaberite kurira za dostavu"
              labelField="name"
              valueField="name"
              containerStyle={{ marginTop: 4 }}
              onChange={(selectedCourier: CourierTypes) => setCourier(selectedCourier)}
            /> */}
            </View>

            {/* Products list */}
            <Text style={styles.sectionLabel}>Lista artikla: ({products.length} kom.)</Text>
            <AddItemsModal isVisible={showAddItemModal} setIsVisible={setShowAddItemModal} setProducts={setProducts} />
            <View style={[styles.sectionContainer, styles.productListContainer]}>
              {products &&
                products.map((product, index) => (
                  <ProductDisplay key={`product-${index}`} product={product} index={index} setProducts={setProducts} />
                ))}
              {/* Add new product btn */}
              <Button
                backColor={Colors.secondaryLight}
                textColor={Colors.primaryDark}
                onPress={handleShowAddItemComponent}
              >
                Dodaj Artikal
              </Button>
            </View>

            {/* Reservation | Packed */}
            <Text style={styles.sectionLabel}>Rezervacija | Spakovano:</Text>
            <View style={styles.sectionContainer}>
              {/* Reservation */}
              <View style={styles.radioGroupContainer}>
                <Text style={styles.radioGroupHeader}>Rezervacija:</Text>
                <CustomCheckbox
                  label={'Da'}
                  checked={isReservation === true}
                  onCheckedChange={() => setIsReservation(true)}
                />
                <CustomCheckbox
                  label={'Ne'}
                  checked={isReservation === false}
                  onCheckedChange={() => setIsReservation(false)}
                />
              </View>
              {/* DATE PICKER */}
              {isReservation === true && (
                <View style={styles.radioGroupContainer}>
                  {reservationDate && pickedDateDisplay && (
                    <View style={styles.dateDisplayContainer}>
                      <Text style={styles.dateLabel}>Izabrani datum:</Text>
                      <Text style={styles.dateText}>{formatDateHandler(reservationDate)}</Text>
                    </View>
                  )}
                  <Text style={styles.filtersH2absolute}>Datum rezervacije</Text>
                  <View style={styles.dateButtonsContainer}>
                    <Button containerStyles={styles.dateButton} onPress={handleOpenDatePicker}>
                      Izaberi datum
                    </Button>
                  </View>

                  {showDatePicker && (
                    <DateTimePicker
                      value={reservationDate}
                      mode="date"
                      is24Hour={true}
                      onChange={handleDatePick}
                      onTouchCancel={handleDateReset}
                    />
                  )}
                </View>
              )}

              {/* Packed */}
              <View style={styles.radioGroupContainer}>
                <Text style={styles.radioGroupHeader}>Spakovano:</Text>
                <CustomCheckbox label={'Da'} checked={isPacked === true} onCheckedChange={() => setIsPacked(true)} />
                <CustomCheckbox label={'Ne'} checked={isPacked === false} onCheckedChange={() => setIsPacked(false)} />
              </View>
            </View>

            {/* Prices */}
            <Text style={styles.sectionLabel}>Cene:</Text>
            <View style={[styles.sectionContainer, styles.pricesContainer]}>
              {/* Products prices */}
              <View style={styles.row}>
                <Text style={styles.rowItem}>Cena proizvoda:</Text>
                <Text style={styles.rowItem}>{productsPrice} din.</Text>
              </View>
              {/* Courier Price */}
              <View style={styles.row}>
                <Text style={styles.rowItem}>Cena kurira:</Text>
                <Text style={styles.rowItem}>{deliveryPrice} din.</Text>
              </View>
              {/* Total Price */}
              <View style={styles.row}>
                <Text style={styles.rowItem}>Ukupno:</Text>
                <Text style={styles.rowItem}>{totalPrice} din.</Text>
              </View>

              {/* Custom Price */}
              <View style={styles.priceContainer}>
                <InputField
                  label="Finalna cena"
                  inputText={customPrice.toString()}
                  setInputText={setCustomPrice as any}
                  containerStyles={styles.customPriceInput}
                  background={Colors.white}
                  keyboard="number-pad"
                  onManualInput={handleUserManualPriceInput}
                  labelBorders={false}
                />
                {!calculateItemsPrice && (
                  <Button
                    containerStyles={styles.recalculatePriceBtn}
                    textStyles={{ color: Colors.primaryDark }}
                    onPress={() => setCalculateItemsPrice(true)}
                  >
                    Preračunaj cenu
                  </Button>
                )}
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              {/* CANCEL */}
              <Button
                containerStyles={styles.button}
                onPress={() => setEditedOrder(null)}
                backColor={Colors.error}
                textColor={Colors.white}
              >
                Nazad
              </Button>

              {/* SAVE */}
              <Button
                containerStyles={styles.button}
                onPress={handleUpdateMethod}
                backColor={Colors.secondaryDark}
                textColor={Colors.white}
              >
                Sačuvaj
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingWrapper>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 2,
    height: 60,
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    position: 'relative',
    backgroundColor: Colors.primaryLight,
  },
  card: {
    marginTop: 70,
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.secondaryLight,
    marginBottom: 16,
    margin: 10,
  },
  sectionContainer: {
    padding: 10,
  },
  sectionLabel: {
    fontSize: 18,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 2,
    height: 50,
  },
  productListContainer: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  rowItem: {
    flex: 2,
  },
  pricesContainer: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.secondaryLight,
    margin: 10,
  },
  radioGroupContainer: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: Colors.secondaryLight,
    borderRadius: 4,
    marginBottom: 8,
    paddingTop: 20,
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    justifyContent: 'space-around',
  },
  radioGroupHeader: {
    fontSize: 14,
    color: Colors.primaryDark,
    marginBottom: 8,
    position: 'absolute',
    left: 10,
    top: -12,
    backgroundColor: Colors.white,
    borderRadius: 4,
    paddingHorizontal: 4,
    borderWidth: 0,
    borderColor: Colors.secondaryLight,
  },
  dateButtonsContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: Colors.secondaryLight,
    color: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 8,
  },
  filtersH2absolute: {
    fontSize: 14,
    color: Colors.primaryDark,
    marginBottom: 8,
    position: 'absolute',
    left: 10,
    top: -12,
    backgroundColor: Colors.white,
    borderWidth: 0,
    paddingHorizontal: 4,
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
    backgroundColor: Colors.secondaryLight,
    textAlign: 'center',
    justifyContent: 'center',
    maxWidth: 150,
    marginBottom: 1,
  },
  customPriceInput: {
    marginTop: 16,
    flex: 1,
  },
});

export default EditOrder;
