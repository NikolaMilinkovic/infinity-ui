import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useContext, useEffect, useState } from 'react';
import { Image, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../../constants/colors';
import useConfirmationModal from '../../../../hooks/useConfirmationMondal';
import useImagePreviewModal from '../../../../hooks/useImagePreviewModal';
import { AuthContext } from '../../../../store/auth-context';
import { CouriersContext } from '../../../../store/couriers-context';
import { CourierTypesWithNoId, OrderProductTypes, OrderTypes } from '../../../../types/allTsTypes';
import Button from '../../../../util-components/Button';
import ConfirmationModal from '../../../../util-components/ConfirmationModal';
import CustomCheckbox from '../../../../util-components/CustomCheckbox';
import DropdownList from '../../../../util-components/DropdownList';
import IconButton from '../../../../util-components/IconButton';
import ImagePicker from '../../../../util-components/ImagePicker';
import ImagePreviewModal from '../../../../util-components/ImagePreviewModal';
import InputField from '../../../../util-components/InputField';
import { popupMessage } from '../../../../util-components/PopupMessage';
import { handleFetchingWithBodyData, handleFetchingWithFormData } from '../../../../util-methods/FetchMethods';
import { getMimeType } from '../../../../util-methods/ImageMethods';
import { betterErrorLog } from '../../../../util-methods/LogMethods';
import AddItemsModal from './addItemsModal/AddItemsModal';

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
  const [originalImage] = useState(editedOrder?.buyer.profileImage.uri);

  const [courier, setCourier] = useState<CourierTypesWithNoId>(editedOrder?.courier as CourierTypesWithNoId);
  const [courierDropdownData, setCourierDropdownData] = useState<CourierTypes[]>([]);

  const [products, setProducts] = useState(editedOrder?.products);

  const [isReservation, setIsReservation] = useState(editedOrder?.reservation);
  const [reservationDate, setReservationDate] = useState(
    new Date(editedOrder?.reservationDate ? editedOrder.reservationDate : new Date())
  );
  const [orderNotes, setOrderNotes] = useState(editedOrder?.orderNotes || '');
  const [isPacked, setIsPacked] = useState(editedOrder?.packed);

  const [productsPrice, setProductsPrice] = useState(editedOrder?.productsPrice);
  const [deliveryPrice, setDeliveryPrice] = useState(editedOrder?.courier?.deliveryPrice);
  const [totalPrice, setTotalPrice] = useState(editedOrder?.totalPrice);
  const [customPrice, setCustomPrice] = useState(editedOrder?.totalPrice);

  const authCtx = useContext(AuthContext);
  const token = authCtx.token || '';

  async function handleUpdateMethod() {
    try {
      if (profileImage.uri === originalImage) {
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
      data.append('customPrice', customPrice ? customPrice : totalPrice);
      if (isReservation === true) data.append('reservationDate', reservationDate.toISOString());
      data.append('orderNotes', orderNotes || '');

      const response = await handleFetchingWithFormData(data, token, `orders/update/${editedOrder?._id}`, 'PATCH');

      if (!response.ok) {
        const parsedResponse = await response?.json();
        return popupMessage(parsedResponse.message, 'danger');
      } else {
        const parsedResponse = await response?.json();
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
        customPrice: customPrice ? customPrice : totalPrice,
        orderNotes,
        reservationDate,
      };
      const response = await handleFetchingWithBodyData(data, token, `orders/update/${editedOrder?._id}`, 'PATCH');

      if (!response?.ok) {
        const parsedResponse = await response?.json();
        return popupMessage(parsedResponse.message, 'danger');
      } else {
        const parsedResponse = await response?.json();
        return popupMessage(parsedResponse.message, 'success');
      }
    } catch (error) {
      betterErrorLog('> Error while updating an order', error);
      popupMessage('Došlo je do problema prilikom ažuriranja porudžbine', 'danger');
    }
  }

  // PRICE CALCULATION HANDLING
  useEffect(() => {
    if (products && products.length > 0) {
      let newProductsPrice = 0;
      for (const product of products) {
        newProductsPrice += product.price;
      }

      setProductsPrice(newProductsPrice);
      if (deliveryPrice) {
        const price = newProductsPrice + deliveryPrice;
        setCustomPrice(price);
      }
    } else {
      setProductsPrice(0);
      setCustomPrice(deliveryPrice);
    }
  }, [products]);

  // PRICE CALCULATION HANDLING
  useEffect(() => {
    if (deliveryPrice) {
      if (productsPrice) {
        let price = deliveryPrice + productsPrice;

        // price of delivery + products for Ukupno field
        setTotalPrice(price);
        setCustomPrice(price);
      }
    }
  }, [deliveryPrice, productsPrice]);

  // Sets the displayed custom price, since we are calculating the custom price render
  // this will bypass setting the newly calculated custom price upon rendering
  useEffect(() => {
    let dp = deliveryPrice ? deliveryPrice : 0;
    let pp = productsPrice ? productsPrice : 0;
    let price = dp + pp;
    if (editedOrder?.totalPrice === price) {
      setCustomPrice(price);
    } else {
      setCustomPrice(editedOrder?.totalPrice);
    }
  }, []);

  // Handles price update for courier change
  useEffect(() => {
    if (courier) {
      setDeliveryPrice(courier.deliveryPrice);
    }
  }, [courier]);

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
    <ScrollView style={styles.container}>
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
        profileImage={profileImage}
        setProfileImage={setProfileImage}
      />

      {/* Courier data */}
      <Text style={styles.sectionLabel}>Izabrani kurir</Text>
      <View style={styles.sectionContainer}>
        <DropdownList
          data={courierDropdownData}
          onSelect={setCourier}
          isDefaultValueOn={true}
          placeholder="Izaberite kurira za dostavu"
          defaultValue={courier.name}
        />
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
        <Button backColor={Colors.secondaryLight} textColor={Colors.primaryDark} onPress={handleShowAddItemComponent}>
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
        <InputField
          label="Finalna cena"
          inputText={customPrice ? customPrice.toString() : '0'}
          setInputText={setCustomPrice}
          background={Colors.white}
          containerStyles={{ marginTop: 22 }}
          selectTextOnFocus={true}
        />
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
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.primaryLight,
  },
  sectionContainer: {
    padding: 10,
  },
  sectionLabel: {
    fontSize: 18,
  },
  input: {
    marginTop: 20,
  },
  imagePickerContainer: {
    marginTop: 10,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    gap: 10,
    marginTop: 10,
    height: 80,
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
    borderColor: Colors.primaryDark,
    margin: 10,
  },
  radioGroupContainer: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
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
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
  },
  checkbox: {
    flex: 2,
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
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  orderNotesInput: {
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    marginVertical: 8,
    backgroundColor: Colors.white,
  },
  inputFieldLabelStyles: {
    backgroundColor: Colors.white,
  },
});

function BuyerDataInputs({
  name,
  setName,
  address,
  place,
  setPlace,
  setAddress,
  phone,
  setPhone,
  phone2,
  setPhone2,
  profileImage,
  setProfileImage,
  orderNotes,
  setOrderNotes,
}: any) {
  return (
    <View style={styles.sectionContainer}>
      {/* Name */}
      <InputField
        containerStyles={styles.input}
        background={Colors.white}
        label="Ime i prezime"
        inputText={name}
        setInputText={setName}
      />
      {/* Address */}
      <InputField
        containerStyles={styles.input}
        background={Colors.white}
        label="Adresa"
        inputText={address}
        setInputText={setAddress}
      />
      {/* Place */}
      <InputField
        containerStyles={styles.input}
        background={Colors.white}
        label="Mesto"
        inputText={place}
        setInputText={setPlace}
      />
      {/* Phone */}
      <InputField
        containerStyles={styles.input}
        background={Colors.white}
        label="Kontakt telefon"
        inputText={phone}
        setInputText={setPhone}
        keyboard="numeric"
      />
      {/* Phone2 */}
      <InputField
        containerStyles={styles.input}
        background={Colors.white}
        label="Dodatni kontakt telefon"
        inputText={phone2}
        setInputText={setPhone2}
        keyboard="numeric"
      />
      {/* Order Notes */}
      <InputField
        label="Napomena za porudžbinu"
        labelStyles={styles.inputFieldLabelStyles}
        inputText={orderNotes}
        setInputText={(text: string | number | undefined) => setOrderNotes(text as string)}
        containerStyles={[styles.orderNotesInput, styles.input]}
        selectTextOnFocus={true}
        multiline={true}
        numberOfLines={4}
        labelBorders={true}
      />
      {/* Profile Image */}
      <View style={styles.imagePickerContainer}>
        <ImagePicker
          onTakeImage={setProfileImage}
          previewImage={profileImage}
          setPreviewImage={setProfileImage}
          height={200}
          resizeMode="none"
        />
      </View>
    </View>
  );
}

interface ProductDisplayTypes {
  product: OrderProductTypes;
  index: number;
  setProducts: (product: OrderProductTypes) => void;
}
function ProductDisplay({ product, index, setProducts }: ProductDisplayTypes) {
  const { isModalVisible, showModal, hideModal, confirmAction } = useConfirmationModal();
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const [previewImage, setPreviewImage] = useState(product?.image);
  function handleImagePreview() {
    showImageModal();
  }

  // REMOVE PRODUCTS HANDLER
  async function handleOnRemovePress() {
    showModal(async () => {
      setProducts((prevProducts: OrderProductTypes) => [
        ...prevProducts.slice(0, index),
        ...prevProducts.slice(index + 1),
      ]);
    });
  }
  return (
    <>
      <ConfirmationModal
        isVisible={isModalVisible}
        onConfirm={confirmAction}
        onCancel={hideModal}
        message="Da li sigurno želiš da obrišeš selektovani proizvod iz porudžbine?"
      />
      {previewImage && (
        <ImagePreviewModal image={previewImage} isVisible={isImageModalVisible} onCancel={hideImageModal} />
      )}

      <View key={index} style={productDisplayStyles.container}>
        <View style={productDisplayStyles.subContainer}>
          {/* Image */}
          <View style={productDisplayStyles.imageContainer}>
            <Pressable onPress={handleImagePreview}>
              <Image source={{ uri: product.image.uri }} style={productDisplayStyles.image} resizeMode="contain" />
            </Pressable>
          </View>

          {/* Main data */}
          <View style={productDisplayStyles.infoContainer}>
            <Text style={productDisplayStyles.header}>{product.name}</Text>

            {/* Category */}
            <View style={productDisplayStyles.infoRow}>
              <Text style={productDisplayStyles.infoLabel}>Kategorija:</Text>
              <Text style={productDisplayStyles.infoText}>{product.category}</Text>
            </View>

            {/* Price */}
            <View style={productDisplayStyles.infoRow}>
              <Text style={productDisplayStyles.infoLabel}>Cena:</Text>
              <Text style={productDisplayStyles.infoText}>{product.price} din.</Text>
            </View>

            {/* Color */}
            <View style={productDisplayStyles.infoRow}>
              <Text style={productDisplayStyles.infoLabel}>Boja:</Text>
              <Text style={productDisplayStyles.infoText}>{product.selectedColor}</Text>
            </View>

            {/* Size */}
            {product.selectedSize && (
              <View style={productDisplayStyles.infoRow}>
                <Text style={productDisplayStyles.infoLabel}>Veličina:</Text>
                <Text style={productDisplayStyles.infoText}>{product.selectedSize}</Text>
              </View>
            )}

            {/* Delete button */}
            <IconButton
              size={26}
              color={Colors.highlight}
              onPress={handleOnRemovePress}
              key={`key-${index}-remove-button`}
              icon="delete"
              style={productDisplayStyles.removeButtonContainer}
              pressedStyles={productDisplayStyles.buttonContainerPressed}
            />
          </View>
        </View>

        {/* Other data */}
        <View></View>
      </View>
    </>
  );
}

const productDisplayStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 4,
    elevation: 2,
  },
  subContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  imageContainer: {
    flex: 1.5,
  },
  infoContainer: {
    flex: 3,
    position: 'relative',
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    height: 140,
    borderRadius: 4,
  },
  removeButtonContainer: {
    position: 'absolute',
    right: 8,
    bottom: 0,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    padding: 10,
    elevation: 2,
  },
  buttonContainerPressed: {
    opacity: 0.7,
    elevation: 1,
  },
  infoRow: {
    maxWidth: '75%',
    flexDirection: 'row',
  },
  infoLabel: {
    width: 75,
  },
  infoText: {
    width: '55%',
  },
});

export default EditOrder;

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  modal: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 10,
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: Colors.secondaryLight,
    width: '100%',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.highlight,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: '13%',
    paddingTop: 10,
  },
  button: {
    flex: 2,
  },
});
