import React, { useContext, useEffect, useState } from 'react'
import Button from '../../../util-components/Button'
import { Colors } from '../../../constants/colors';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import InputField from '../../../util-components/InputField';
import ImagePicker from '../../../util-components/ImagePicker';
import MultiDropdownList from '../../../util-components/MultiDropdownList';
import { ColorsContext } from '../../../store/colors-context';
import AddDressComponents from '../unique_product_components/add/AddDressComponents';
import AddPurseComponents from '../unique_product_components/add/AddPurseComponents';
import { ProductTypes, CategoryTypes, DressColorTypes, PurseColorTypes, ProductImageTypes } from '../../../types/allTsTypes';
import DressColor from '../../../models/DressColor';
import PurseColor from '../../../models/PurseColor';
import { betterConsoleLog } from '../../../util-methods/LogMethods';

interface PropTypes {
  item: ProductTypes;
  setItem: (data: ProductTypes | null) => void;
}

function EditProductComponent({ item, setItem }: PropTypes) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState<number | string>(item.price.toString());
  const [productImage, setProductImage] = useState<ProductImageTypes>(item.image);
  const [previewImage, setPreviewImage] = useState(item.image);
  const [selectedColors, setSelectedColors] = useState<string[]>();
  const [category] = useState<CategoryTypes>(item.category);


  // defaultValues for multi dropdown list
  const [colorsDefaultOptions, setColorsDefaultOptions] = useState<string[]>(['']);
  const [itemColors, setItemColors] = useState<(DressColorTypes | PurseColorTypes)[]>([]);

  betterConsoleLog('> Item colors are', itemColors);


  useEffect(() => {
    const colors = item.colors.map((obj) => obj.color);
    setItemColors(item.colors);
    setSelectedColors(colors);
    setColorsDefaultOptions(colors);
  }, [item])

  // betterConsoleLog('> Logging edit product component item: ', item);  
  const colorsCtx = useContext(ColorsContext);
  const [allColors, setAllColors] = useState(colorsCtx.colors);

  useEffect(() => {
    setAllColors(colorsCtx.colors);
  }, [colorsCtx.colors])

  useEffect(() => {
    // console.log('> Selected colors', selectedColors);
    if(!selectedColors) return;
    setItemColors(prevItemColors => {
      // Add new colors that are in selectedColors but not in prevItemColors
      const newColors = selectedColors.filter(
        color => !prevItemColors.some(existingColor => existingColor.color === color)
      ).map(color => {
        if(!category) return;
        if(category.stockType === 'Boja-Veličina-Količina'){
          const d = new DressColor();
          d.setColor(color);
          return d;
        }
        if(category.stockType === 'Boja-Količina'){
          const d = new PurseColor();
          d.setColor(color);
          return d;
        }
        const d = new DressColor();
        d.setColor(color);
        return d;
      });
  
      // Keep only colors that are still in selectedColors
      const updatedItemColors = prevItemColors.filter(existingColor =>
        selectedColors.includes(existingColor.color)
      );
  
      // Return combined list of existing valid and newly added dress colors
      return [...updatedItemColors, ...newColors];
    });
  }, [selectedColors]);


  function handleOnPress(){
    setItem(null);
  }
  return (
    <ScrollView style={styles.container}>
      <View>
      <Text style={styles.sectionText}>Osnovne Informacije</Text>
      <InputField
        label='Naziv Proizvoda'
        isSecure={false}
        inputText={name}
        setInputText={setName}
        background={Colors.white}
        color={Colors.primaryDark}
        activeColor={Colors.secondaryDark}
        containerStyles={{ marginTop: 18 }}
      />
    </View>
    <View>
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
    <View>
      <Text style={[styles.sectionText, styles.sectionTextTopMargin]}>Slika Proizvoda</Text>
      <ImagePicker
        onTakeImage={setProductImage}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
    </View>
    {/* <View style={styles.wrapper}>
      <Text style={[styles.sectionText, styles.sectionTextTopMargin]}>Kategorija</Text>
      <DropdownList
        data={allCategories}
        placeholder='Kategorija Proizvoda'
        onSelect={setSelectedCategory}
        defaultValue='Haljina'
        buttonContainerStyles={{marginTop: 4}}
      />
    </View> */}
    <View>
      <Text style={[styles.sectionText, styles.sectionTextTopMargin]}>Boje, veličine i količina lagera</Text>
      <MultiDropdownList
        data={allColors}
        setSelected={setSelectedColors}
        isOpen={true}
        placeholder='Izaberi boje'
        label='Boje Proizvoda'
        containerStyles={{marginTop: 4}}
        defaultValues={colorsDefaultOptions}
      />
    </View>
    {/* DRESES */}
    {category && item.stockType === 'Boja-Veličina-Količina' && (
      <AddDressComponents
        dressColors={itemColors}
        setDressColors={setItemColors}
      />
    )}
    {/* PURSES */}
    {category && item.stockType === 'Boja-Količina' && (
      <AddPurseComponents
        purseColors={itemColors}
        setPurseColors={setItemColors}
      />
    )}


      {/* BUTTONS */}
      <View style={styles.buttonsContainer}>
        <Button
          onPress={handleOnPress}
          textColor={Colors.white}
          backColor={Colors.secondaryDark}
          containerStyles={styles.button}
          textStyles={{}}
        >
          Sačuvaj izmene
        </Button>
        <Button
          onPress={handleOnPress}
          textColor={Colors.white}
          backColor={Colors.error}
          containerStyles={styles.button}
          textStyles={{}}
        >
          Nazad
        </Button>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    display: 'flex',
    padding: 16,
  },
  sectionText: {
    fontSize: 18,
  },
  sectionTextTopMargin: {
    marginTop: 16
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: 'white',
  },
  input:{
    marginTop: 22
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

})

export default EditProductComponent