import React, { useContext, useEffect, useState } from 'react'
import Button from '../../../util-components/Button'
import { CourierTypesWithNoId, OrderProductTypes, OrderTypes, ProfileImageTypes } from '../../../types/allTsTypes'
import { betterConsoleLog } from '../../../util-methods/LogMethods'
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import InputField from '../../../util-components/InputField'
import { Text } from 'react-native'
import { Colors } from '../../../constants/colors'
import ImagePicker from '../../../util-components/ImagePicker'
import { RollInLeft } from 'react-native-reanimated'
import DropdownList from '../../../util-components/DropdownList'
import { CouriersContext } from '../../../store/couriers-context'
import ConfirmationModal from '../../../util-components/ConfirmationModal'
import useConfirmationModal from '../../../hooks/useConfirmationMondal'
import useImagePreviewModal from '../../../hooks/useImagePreviewModal'
import ImagePreviewModal from '../../../util-components/ImagePreviewModal'
import IconButton from '../../../util-components/IconButton'
import CustomCheckbox from '../../../util-components/CustomCheckbox'
import { popupMessage } from '../../../util-components/PopupMessage'
import { fetchWithBodyData, handleFetchingWithBodyData, handleFetchingWithFormData } from '../../../util-methods/FetchMethods'
import { AuthContext } from '../../../store/auth-context'
import { getMimeType } from '../../../util-methods/ImageMethods'

interface InputFieldTypes{
  input: string | number | undefined
}
interface PropTypes {
  editedOrder: OrderTypes
  setEditedOrder: (order: OrderTypes | null) => void
}
interface CourierTypes {
  _id: string
  name: string;
  deliveryPrice: number;
}

function EditOrder({ editedOrder, setEditedOrder }: PropTypes) {
  const couriersCtx = useContext(CouriersContext);
  const [name, setName] = useState<string | number | undefined>(editedOrder?.buyer.name || '');
  const [address, setAddress] = useState<string | number | undefined>(editedOrder?.buyer.address || '');
  const [phone, setPhone] = useState<string | number | undefined>(editedOrder?.buyer.phone || '');
  const [profileImage, setProfileImage] = useState(editedOrder?.buyer.profileImage || '');
  const [originalImage] = useState(editedOrder?.buyer.profileImage.uri);

  const [courier, setCourier] = useState<CourierTypesWithNoId>(editedOrder?.courier as CourierTypesWithNoId);
  const [courierDropdownData, setCourierDropdownData] = useState<CourierTypes[]>([]);

  const [products, setProducts] = useState(editedOrder?.products);
  
  const [isReservation, setIsReservation] = useState(editedOrder?.reservation);
  const [isPacked, setIsPacked] = useState(editedOrder?.packed);
  
  const [productsPrice, setProductsPrice] = useState(editedOrder?.productsPrice);
  const [deliveryPrice, setDeliveryPrice] = useState(editedOrder.courier?.deliveryPrice);
  const [totalPrice, setTotalPrice] = useState(editedOrder?.totalPrice);
  const [customPrice, setCustomPrice] = useState(editedOrder?.totalPrice);

  betterConsoleLog('> Logging editedOrder', editedOrder);
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
  async function handleUpdateOrderWithFormData(){
    try{
      const data = new FormData();
      if (profileImage) {
        data.append('profileImage', {
          uri: profileImage.uri,
          type: getMimeType(profileImage?.mimeType || '', profileImage.uri),
          name: profileImage?.imageName || profileImage?.fileName,
        } as any);
      }

      betterConsoleLog('> Logging data', data);

      data.append('name', name);
      data.append('address', address);
      data.append('phone', phone);
      data.append('courier', JSON.stringify(courier) as string);
      data.append('products', JSON.stringify(products) as string);
      data.append('isReservation', isReservation ? 'true' : 'false');
      data.append('isPacked', isPacked ? 'true' : 'false');
      data.append('productsPrice', productsPrice);
      data.append('customPrice',  customPrice ? customPrice : totalPrice);

      const response = await handleFetchingWithFormData(data, token, `orders/update/${editedOrder._id}`, 'PATCH');

      
      if(!response.ok) {
        const parsedResponse = await response.json();
        return popupMessage(parsedResponse.message, 'danger');
      } else {
        const parsedResponse = await response.json();
        return popupMessage(parsedResponse.message, 'success');
      }
    } catch(error){
      betterConsoleLog('> Error while updating an order', error);
      popupMessage('Došlo je do problema prilikom ažuriranja porudžbine', 'danger');
    }
  }
  async function handleUpdateOrderWithBodyData(){
    try{
      const data = {
        name, address, phone, courier, products, isReservation, isPacked, productsPrice, customPrice: customPrice ? customPrice : totalPrice
      }
      const response = await handleFetchingWithBodyData(data, token, `orders/update/${editedOrder._id}`, 'PATCH');

      if(!response.ok) {
        const parsedResponse = await response.json();
        return popupMessage(parsedResponse.message, 'danger');
      } else {
        const parsedResponse = await response.json();
        return popupMessage(parsedResponse.message, 'success');
      }

    } catch(error) {
      betterConsoleLog('> Error while updating an order', error);
      popupMessage('Došlo je do problema prilikom ažuriranja porudžbine', 'danger');
    }
  }

  useEffect(() => {
    if(products.length > 0){
      let newProductsPrice = 0; 
      for(const product of products){
        newProductsPrice += product.price;
      }

      setTotalPrice(newProductsPrice);
    }
  }, [products])

  useEffect(() => {
    if(courier){
      setDeliveryPrice(courier.deliveryPrice);
    }
  }, [courier])

  useEffect(() => {
    if(deliveryPrice && productsPrice){
      let price = deliveryPrice + productsPrice;
      setTotalPrice(price);
      if(!customPrice) setCustomPrice(price);
    }
  }, [deliveryPrice, productsPrice])

  useEffect(() => {
    const dropdownData = couriersCtx.couriers.map(courier => ({
      _id: courier._id,
      name: courier.name,
      deliveryPrice: courier.deliveryPrice
    }));
    if(dropdownData){
      setCourierDropdownData(dropdownData)
    }
  }, [couriersCtx.couriers, setCourierDropdownData])
  return (
    <ScrollView style={styles.container}>

      {/* Buyer data */}
      <Text style={styles.sectionLabel}>Podaci o kupcu</Text>
      <BuyerDataInputs
        name={name}
        setName={setName}
        address={address}
        setAddress={setAddress}
        phone={phone}
        setPhone={setPhone}
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
          placeholder='Izaberite kurira za dostavu'
          defaultValue={courier.name}
        />
      </View>

      {/* Products list */}
      <Text style={styles.sectionLabel}>Lista artikla: ({products.length} kom.)</Text>
      <View style={[styles.sectionContainer, styles.productListContainer]}>
        {products && products.map((product, index) => 
          <ProductDisplay
            key={`product-${index}`}
            product={product}
            index={index}
          />
        )}
        {/* Add new product btn */}
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

        {/* Packed */}
        <View style={styles.radioGroupContainer}>
          <Text style={styles.radioGroupHeader}>Spakovano:</Text>
            <CustomCheckbox
              label={'Da'}
              checked={isPacked === true}
              onCheckedChange={() => setIsPacked(true)}
            />
            <CustomCheckbox
              label={'Ne'}
              checked={isPacked === false}
              onCheckedChange={() => setIsPacked(false)}
            />
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
            label='Finalna cena'
            inputText={customPrice.toString()}
            setInputText={setCustomPrice}
            background={Colors.white}
            containerStyles={{marginTop: 22}}
            selectTextOnFocus={true}
          />
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>

        {/* SAVE */}
        <Button
          containerStyles={styles.button}
          onPress={handleUpdateMethod}
          backColor={Colors.secondaryDark}
          textColor={Colors.white}
        >Sačuvaj</Button>

        {/* CANCEL */}
        <Button
          containerStyles={styles.button}
          onPress={() => setEditedOrder(null)}
          backColor={Colors.error}
          textColor={Colors.white}
        >Nazad</Button>
      </View>

    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionContainer: {
    padding: 10,
  },
  sectionLabel: {
    fontSize: 18,
  },
  input:{
    marginTop: 20,
  },
  imagePickerContainer:{
    marginTop: 10
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
    gap: 10
  },
  row: {
    flexDirection: 'row',
    flex: 1
  },
  rowItem: {
    flex: 2
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
    justifyContent: 'space-around'
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
    borderColor: Colors.primaryDark
  },
  checkbox: {
    flex: 2
  }
});


function BuyerDataInputs({ name, setName, address, setAddress, phone, setPhone, profileImage, setProfileImage }: any){
  return(
    <View style={styles.sectionContainer}>
    {/* Name */}
    <InputField
      containerStyles={styles.input}
      background={Colors.white}
      label='Ime i prezime'
      inputText={name}
      setInputText={setName}
    />
    {/* Address */}
    <InputField
      containerStyles={styles.input}
      background={Colors.white}
      label='Adresa'
      inputText={address}
      setInputText={setAddress}
    />
    {/* Phone */}
    <InputField
      containerStyles={styles.input}
      background={Colors.white}
      label='Kontakt telefon'
      inputText={phone}
      setInputText={setPhone}
      keyboard='numeric'
    />
    {/* Profile Image */}
    <View style={styles.imagePickerContainer}>
      <ImagePicker
        onTakeImage={setProfileImage}
        previewImage={profileImage}
        setPreviewImage={setProfileImage}
        height={200}
        resizeMode='none'
      />
    </View>
  </View>
  )
}
interface ProductDisplayTypes {
  product: OrderProductTypes
  index: number
}
function ProductDisplay({ product, index }: ProductDisplayTypes){
  const { isModalVisible, showModal, hideModal, confirmAction } = useConfirmationModal();
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const [previewImage, setPreviewImage] = useState(product?.image);
  function handleImagePreview() {
    showImageModal();
  }
  
  async function handleOnRemovePress(){
    showModal(async () => {
      console.log('> Deleting the item from order..');
    })
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
        <ImagePreviewModal
          image={previewImage}
          isVisible={isImageModalVisible}
          onCancel={hideImageModal}
        />
      )}

      <View key={index} style={productDisplayStyles.container}>
        <View style={productDisplayStyles.subContainer}>

          {/* Image */}
          <View style={productDisplayStyles.imageContainer}>
            <Pressable onPress={handleImagePreview}>
              <Image source={{uri: product.image.uri}} style={productDisplayStyles.image} resizeMode='contain'/>
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

            <IconButton
              size={26}
              color={Colors.highlight}
              onPress={handleOnRemovePress}
              key={`key-${index}-add-button`}
              icon='delete'
              style={productDisplayStyles.removeButtonContainer} 
              pressedStyles={productDisplayStyles.buttonContainerPressed}
            />
          </View>
        </View>

        {/* Other data */}
        <View>

        </View>
      </View>
    </>
  )
}

const productDisplayStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 4,
    elevation: 2
  },
  subContainer: {
    flexDirection: 'row',
    gap: 10
  },
  imageContainer: {
    flex: 1.5,
  },
  infoContainer: {
    flex: 3,
    position: 'relative'
  },
  header: {
    fontWeight: 'bold', 
    fontSize: 16
  },
  image: {
    height: 140,
    borderRadius: 4,
  },
  removeButtonContainer: {
    position: 'absolute',
    right: 8,
    top: 0,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    padding: 10,
    elevation: 2
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
    width: '55%'
  }
})

export default EditOrder