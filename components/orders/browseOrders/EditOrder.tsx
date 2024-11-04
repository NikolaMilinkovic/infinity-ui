import React, { useEffect, useState } from 'react'
import Button from '../../../util-components/Button'
import { OrderTypes } from '../../../types/allTsTypes'
import { betterConsoleLog } from '../../../util-methods/LogMethods'
import { ScrollView, StyleSheet, View } from 'react-native'
import InputField from '../../../util-components/InputField'
import { Text } from 'react-native'
import { Colors } from '../../../constants/colors'
import ImagePicker from '../../../util-components/ImagePicker'
import { RollInLeft } from 'react-native-reanimated'

interface InputFieldTypes{
  input: string | number | undefined
}
interface PropTypes {
  editedOrder: OrderTypes | null
  setEditedOrder: (order: OrderTypes | null) => void
}

function EditOrder({ editedOrder, setEditedOrder }: PropTypes) {
  const [name, setName] = useState<string | number | undefined>(editedOrder?.buyer.name || '');
  const [address, setAddress] = useState<string | number | undefined>(editedOrder?.buyer.address || '');
  const [phone, setPhone] = useState<string | number | undefined>(editedOrder?.buyer.phone || '');
  const [profileImage, setProfileImage] = useState(editedOrder?.buyer.profileImage || '');

  const [courier, setCourier] = useState(editedOrder?.courier || '');

  betterConsoleLog('> Logging edited order:', editedOrder);
  useEffect(() => {
    betterConsoleLog('> Logging profile image', profileImage);
  },[profileImage])
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
      <View>
        
        {/* Courier selector */}
      </View>

      {/* Products list */}
      <View>
        {/* Remove product btn */}
        {/* Add new product btn */}
      </View>

      {/* Prices */}
      <View>
        {/* Products prices */}
        {/* Courier Price */}
        {/* Total Price */}
        {/* Custom Price */}
      </View>

      {/* Reservation | Packed */}
      <View>
        {/* Reservation cb */}
        {/* Packed cb */}
      </View>

      {/* Buttons */}
      <View>
        {/* Save btn */}
        {/* Back btn */}
      </View>

      <Button
        onPress={() => setEditedOrder(null)}
      >BACK</Button>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 32,
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
    marginBottom: 25
  },
  button: {
    flex: 2,
    height: 50,
  },
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

export default EditOrder