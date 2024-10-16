import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import InputField from '../../util-components/InputField'
import { Colors } from '../../constants/colors';
import DropdownList from '../../util-components/DropdownList';
import MultiDropdownList from '../../util-components/MultiDropdownList';
import ImagePicker from '../../util-components/ImagePicker';

interface ColorType {
  _id: string
  name: string
  colorCode: string
}
interface Category {
  _id: string
  name: string
}
interface PropTypes {
  productName: string
  setProductName: string
  price: string | number | undefined
  setPrice: string | number | undefined
  setProductImage: any
  previewImage: any
  setPreviewImage: any
  allCategories: Category[]
  setSelectedCategory: Category
  allColors: ColorType[]
  setSelectedColors: ColorType[]
  isMultiDropdownOpen: boolean
}

function GenericProductInputComponents({
  productName,
  setProductName,
  price,
  setPrice,
  setProductImage,
  previewImage,
  setPreviewImage,
  allCategories,
  setSelectedCategory,
  allColors,
  setSelectedColors,
  isMultiDropdownOpen,
}: PropTypes) {
  return (
    <>
      <View style={[styles.wrapper, {marginTop: 22}]}>
      <Text style={styles.sectionText}>Osnovne Informacije</Text>
      <InputField
        label='Naziv Proizvoda'
        isSecure={false}
        inputText={productName}
        setInputText={setProductName}
        background={Colors.white}
        color={Colors.primaryDark}
        activeColor={Colors.secondaryDark}
        containerStyles={{ marginTop: 18 }}
      />
    </View>
    <View style={styles.wrapper}>
      <InputField
        label='Cena'
        isSecure={false}
        inputText={price}
        setInputText={setPrice}
        background={Colors.white}
        color={Colors.primaryDark}
        activeColor={Colors.secondaryDark}
        keyboard='numeric'
        containerStyles={{ marginTop: 18 }}
      />
    </View>
    <View style={styles.wrapper}>
      <Text style={[styles.sectionText, styles.sectionTextTopMargin]}>Slika Proizvoda</Text>
      <ImagePicker
        onTakeImage={setProductImage}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
    </View>
    <View style={styles.wrapper}>
      <Text style={[styles.sectionText, styles.sectionTextTopMargin]}>Kategorija</Text>
      <DropdownList
        data={allCategories}
        placeholder='Kategorija Proizvoda'
        onSelect={setSelectedCategory}
        defaultValue='Haljina'
        buttonContainerStyles={{marginTop: 4}}
      />
    </View>
    <View style={styles.wrapper}>
      <Text style={[styles.sectionText, styles.sectionTextTopMargin]}>Boje, veličine i količina lagera</Text>
      <MultiDropdownList
        data={allColors}
        setSelected={setSelectedColors}
        isOpen={isMultiDropdownOpen}
        placeholder='Izaberi boje'
        label='Boje Proizvoda'
        containerStyles={{marginTop: 4}}
      />
    </View>
  </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    padding: 16,
  },
  wrapper: {
    marginBottom: 0,
  },
  buttonContainer: {
    marginBottom: 50
  },
  sectionText: {
    fontSize: 18,
  },
  sectionTextTopMargin: {
    marginTop: 16
  },
})

export default GenericProductInputComponents