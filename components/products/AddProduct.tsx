import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import InputField from '../../util-components/InputField'
import { Colors } from '../../constants/colors';
import { CategoriesContext } from '../../store/categories-context';
import DropdownList from '../../util-components/DropdownList';
import MultiDropdownList from '../../util-components/MultiDropdownList';
import { ColorsContext } from '../../store/colors-context';
import ColorSizeInputs from '../../util-components/ColorSizeInputs';
import Button from '../../util-components/Button';
import DressColor from '../../models/DressColor';
import { AuthContext } from '../../store/auth-context';
import { popupMessage } from '../../util-components/PopupMessage';

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

function AddProduct(){
  const authCtx = useContext(AuthContext);
  const categoriesCtx = useContext(CategoriesContext);
  const colorsCtx = useContext(ColorsContext);


  // Other data
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allColors, setAllColors] = useState<Color[]>([]);
  const [isMultiDropdownOpen, setIsMultiDropdownOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);

  // Handles adding / removing and updating the dressColors data
  // In the ColorSizeInputs component
  useEffect(() => {
    setDressColors(prevDressColors => {
      // Add new colors that are in selectedColors but not in prevDressColors
      const newColors = selectedColors.filter(
        color => !prevDressColors.some(existingColor => existingColor.color === color)
      ).map(color => {
        const d = new DressColor();
        d.setColor(color);
        return d;
      });
  
      // Keep only colors that are still in selectedColors
      const updatedDressColors = prevDressColors.filter(existingColor =>
        selectedColors.includes(existingColor.color)
      );
  
      // Return combined list of existing valid and newly added dress colors
      return [...updatedDressColors, ...newColors];
    });
  }, [selectedColors]);

  // New product data
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category[]>([]);
  const [price, setPrice] = useState<number | string>('');
  const [dressColors, setDressColors] = useState<DressColorTypes[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setAllCategories(categoriesCtx.getCategories());
    setAllColors(colorsCtx.getColors());
  }, [categoriesCtx, colorsCtx])
  
  function handleOutsideClick() {
    Keyboard.dismiss();
  }
  function setErrorHandler(errMsg){
    popupMessage(errMsg, 'danger');
    setError(errMsg);
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
    if(selectedCategory.length === 0){
      setErrorHandler('Izaberite kategoriju proizvoda.');
      return false;
    } 
    if(selectedCategory.name === 'Haljina' && !dressColors.length){
      setErrorHandler('Proizvod mora imati boje');
      return false;
    }
    return true;
  }
  function resetInputsHandler(){
    setSelectedColors([])
    setProductName('')
    setSelectedCategory([])
    setPrice('')
    setAllCategories([]);
    setAllColors([]);
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

  async function handleAddProduct(){
    // Validate all data
    const isVerified = verifyInputsData();
    if(!isVerified) return;    

    try{
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/products/dress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authCtx.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: productName,
          category: selectedCategory.name,
          price: price,
          colors: dressColors,
         })
      })

      if(!response.ok) {
        const parsedResponse = await response.json();
        popupMessage(parsedResponse.message, 'danger');
        return;
      }

      popupMessage(`Proizvod pod imenom ${productName} je uspešno dodat.`, 'success');
      resetInputsHandler();
    } catch(error){
      console.log(error);
    }
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={[styles.wrapper, {marginTop: 22}]}>
          <InputField
            label='Naziv Proizvoda'
            isSecure={false}
            inputText={productName}
            setInputText={setProductName}
            background={Colors.white}
            color={Colors.primaryDark}
            activeColor={Colors.secondaryDark}
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
          />
        </View>
        <View style={styles.wrapper}>
          <DropdownList
            data={allCategories}
            placeholder='Kategorija Proizvoda'
            onSelect={setSelectedCategory}
            defaultValue='Haljina'
          />
        </View>
        <View style={styles.wrapper}>
          <MultiDropdownList
            data={allColors}
            setSelected={setSelectedColors}
            isOpen={isMultiDropdownOpen}
            placeholder='Izaberi boje'
            label='Boje'
          />
        </View>
        <View style={styles.wrapper}>
          <ColorSizeInputs 
            colorsData={dressColors}
            setColorsData={setDressColors}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleAddProduct}
            backColor={Colors.highlight}
            textColor={Colors.whiteText}
          >Dodaj</Button>
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
    marginBottom: 8,
    marginTop: 8,
  },
  buttonContainer: {
    marginBottom: 50
  }
})

export default AddProduct