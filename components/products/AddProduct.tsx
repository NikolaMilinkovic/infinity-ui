import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Keyboard, StyleSheet, TouchableWithoutFeedback, View, Text } from 'react-native'
import { Colors } from '../../constants/colors';
import { CategoriesContext } from '../../store/categories-context';
import { ColorsContext } from '../../store/colors-context';
import Button from '../../util-components/Button';
import DressColor from '../../models/DressColor';
import { AuthContext } from '../../store/auth-context';
import { popupMessage } from '../../util-components/PopupMessage';
import { addDress, addPurse } from '../../util-methods/FetchMethods';
import AddDressComponents from './unique_product_components/AddDressComponents';
import GenericProductInputComponents from './GenericProductInputComponents';
import AddPurseComponents from './unique_product_components/AddPurseComponents';
import PurseColor from '../../models/PurseColor';
import { betterConsoleLog } from '../../util-methods/LogMethods';

interface Category {
  _id: string,
  name: string
}
interface Color {
  _id: string,
  name: string,
  colorCode: string,
}
interface DressColorTypes{
  _id: string
  color: string
  colorCode: string
  sizes: { size: string; stock: number }[]
}
interface PurseColorTypes{
  _id: string
  color: string
  colorCode: string
  stock: number 
}
interface ProductImageTypes {
  assetId: string | null;
  base64: string | null;
  duration: number | null;
  exif: object | null;
  fileName: string;
  fileSize: number;
  height: number;
  mimeType: string;
  rotation: number | null;
  type: string;
  uri: string;
  width: number;
}

function AddProduct(){
  const authCtx = useContext(AuthContext);
  const categoriesCtx = useContext(CategoriesContext);
  const colorsCtx = useContext(ColorsContext);

  // Other data
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allColors, setAllColors] = useState<Color[]>([]);
  const [isMultiDropdownOpen, setIsMultiDropdownOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    setItemColors(prevItemColors => {
      // Add new colors that are in selectedColors but not in prevItemColors
      const newColors = selectedColors.filter(
        color => !prevItemColors.some(existingColor => existingColor.color === color)
      ).map(color => {
        if(selectedCategory.name === 'Haljina'){
          const d = new DressColor();
          d.setColor(color);
          return d;
        }
        if(selectedCategory.name === 'Torbica'){
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
  }, [selectedColors, selectedCategory]);

  // New product data
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category[] | undefined[]>([]);
  const [price, setPrice] = useState<number | string>('');
  const [productImage, setProductImage] = useState<ProductImageTypes>();
  
  const [dressColors, setDressColors] = useState<DressColorTypes[]>([]);
  const [purseColors, setPurseColors] = useState<PurseColorTypes[]>([]);
  const [itemColors, setItemColors] = useState<(DressColorTypes | PurseColorTypes)[]>([]);


  useEffect(() => {
    setAllCategories(categoriesCtx.getCategories());
    setAllColors(colorsCtx.getColors());
  }, [categoriesCtx, colorsCtx])
  
  function handleOutsideClick() {
    Keyboard.dismiss();
  }
  function setErrorHandler(errMsg){
    popupMessage(errMsg, 'danger');
  }
  function verifyInputsData(){
    if(!productName){
      setErrorHandler('Proizvod mora imati ime.');
      return false;
    } 
    if(!price){
      setErrorHandler('Proizvod mora imati cenu.');
      return false;
    } 
    if(selectedCategory && selectedCategory.length === 0){
      setErrorHandler('Izaberite kategoriju proizvoda.');
      return false;
    } 
    if(selectedCategory.name === 'Haljina' && !itemColors.length){
      setErrorHandler('Proizvod mora imati boje');
      return false;
    }
    return true;
  }
  function resetInputsHandler(){
    setItemColors([]);
    setSelectedColors([])
    setProductName('')
    setSelectedCategory([])
    setPrice('')
    setAllCategories([]);
    setAllColors([]);
    setPreviewImage('');
    setProductImage(undefined);
  }

  // Handles adding a new DRESS
  async function handleAddDress(){
    // Verify all data
    const isVerified = verifyInputsData();
    if(!isVerified) return;

    // Add new dress
    const dressData ={
      productName,
      selectedCategory,
      price,
      itemColors,
      productImage
    }
    let result = false;
    if(dressData && authCtx.token){
      result = await addDress(dressData, authCtx.token);

      // Reset all inputs
      if (result) resetInputsHandler();
    }
  }

  // Handles adding a new PURSE
  async function handleAddPurse(){
    // Verify all data
    const isVerified = verifyInputsData();
    if(!isVerified) return;

    // Add new dress
    const purseData = {
      productName,
      selectedCategory,
      price,
      itemColors,
      productImage
    }

    let result = false;
    if(purseData && authCtx.token){
      result = await addPurse(purseData, authCtx.token);

      // Reset all inputs
      if (result) resetInputsHandler();
    }
  }

  // Handles choosing correct method to add a product
  async function handleAddProduct(){
    if(selectedCategory.length === 0){
      return popupMessage('Izaberite Kategoriju proizvoda', 'danger');
    } else {
      if(!selectedCategory.name) return popupMessage('Error, kategorija nema ime.','danger');

      // Methods for adding productus based on category
      if(selectedCategory.name === 'Haljina') return await handleAddDress();
      if(selectedCategory.name === 'Torbica') return await handleAddPurse();
    }
  }

  // Used in combination for resetInputsHandler to again populate the Categories and Colors
  // This has to be done because components dont have methods to full input reset..
  useEffect(() => {
    if(allColors.length > 0 && allCategories.length > 0) return;
    if(allColors.length === 0){
      setAllColors(colorsCtx.getColors());
    }
    if(allCategories.length === 0){
      setAllCategories(categoriesCtx.getCategories());
    }
  }, [allColors])

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <GenericProductInputComponents
          productName={productName}
          setProductName={setProductName}
          price={price}
          setPrice={setPrice}
          setProductImage={setProductImage}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          allCategories={allCategories}
          setSelectedCategory={setSelectedCategory}
          allColors={allColors}
          setSelectedColors={setSelectedColors}
          isMultiDropdownOpen={isMultiDropdownOpen}
        />

        {/* DRESES */}
        {selectedCategory.name === 'Haljina' && (
          <AddDressComponents
            dressColors={itemColors}
            setDressColors={setItemColors}
          />
        )}
        {/* PURSES */}
        {selectedCategory.name === 'Torbica' && (
          <AddPurseComponents
            purseColors={itemColors}
            setPurseColors={setItemColors}
          />
        )}
        {/* GENERIC */}
        {selectedCategory.name !== 'Haljina' && selectedCategory.name !== 'Torbica' && (
          <AddDressComponents
          dressColors={itemColors}
          setDressColors={setItemColors}
        />
        )}
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleAddProduct}
            backColor={Colors.highlight}
            textColor={Colors.whiteText}
            containerStyles={{ marginTop: 16 }}
          >Sačuvaj Proizvod</Button>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
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

export default AddProduct